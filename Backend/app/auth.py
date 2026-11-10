import hashlib
import os
import secrets
from datetime import datetime, timedelta, timezone
from pathlib import Path

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2 import id_token
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.database_models import (
    User,
    AuthIdentity,
    EmailVerificationToken,
    RefreshSession,
    PasswordResetToken,
)

from app.security import (
    create_access_token,
    generate_refresh_token,
    hash_refresh_token,
    get_refresh_token_expiry,
    get_current_user,
    hash_password,
    verify_password,
)

from app.email_service import (
    send_password_reset_email,
    send_email_verification_email,
)

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID") or ""

if not GOOGLE_CLIENT_ID:
    raise RuntimeError(
        "GOOGLE_CLIENT_ID is missing from Backend/.env"
    )

COOKIE_SECURE = (
    os.getenv("COOKIE_SECURE", "false").lower() == "true"
)

REFRESH_COOKIE_NAME = "fraudshield_refresh_token"


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

class GoogleLoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    credential: str

class RegisterRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    full_name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class ForgotPasswordRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    token: str = Field(min_length=20, max_length=200)
    new_password: str = Field(min_length=8, max_length=128)


class ResendVerificationRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    email: EmailStr


def create_verification_token(db: Session, user: User) -> str:
    now = datetime.now(timezone.utc)

    # Invalidate older unused verification links.
    db.query(EmailVerificationToken).filter(
        EmailVerificationToken.user_id == user.id,
        EmailVerificationToken.used_at.is_(None),
    ).update(
        {EmailVerificationToken.used_at: now},
        synchronize_session=False,
    )

    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(
        raw_token.encode("utf-8")
    ).hexdigest()

    db.add(
        EmailVerificationToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=now + timedelta(minutes=15),
        )
    )
    return raw_token


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    email = str(request.email).strip().lower()
    full_name = request.full_name.strip()

    if len(full_name) < 2:
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid full name.",
        )

    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists. Please log in or request verification.",
        )

    user = User(
        email=email,
        full_name=full_name,
        is_email_verified=False,
        is_active=True,
    )

    try:
        db.add(user)
        db.flush()

        db.add(
            AuthIdentity(
                user_id=user.id,
                provider="password",
                provider_user_id=email,
                password_hash=hash_password(request.password),
            )
        )

        raw_token = create_verification_token(db, user)
        db.commit()

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not create your account. Please try again.",
        )

    try:
        send_email_verification_email(email, raw_token)
    except Exception:
        # Keep the account pending so the user can request another link.
        raise HTTPException(
            status_code=503,
            detail="Account created, but verification email could not be sent. Please request a new verification email.",
        )

    return {
        "message": "Account created. Please verify your email before logging in.",
        "email": email,
        "requires_verification": True,
    }


@router.get("/verify-email")
def verify_email(
    token: str,
    db: Session = Depends(get_db),
):
    token_hash = hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()

    now = datetime.now(timezone.utc)

    try:
        verification = (
            db.query(EmailVerificationToken)
            .filter(
                EmailVerificationToken.token_hash == token_hash,
                EmailVerificationToken.used_at.is_(None),
                EmailVerificationToken.expires_at > now,
            )
            .with_for_update()
            .first()
        )

        if verification is None:
            raise HTTPException(
                status_code=400,
                detail="Verification link is invalid, expired, or already used.",
            )

        user = (
            db.query(User)
            .filter(
                User.id == verification.user_id,
                User.is_active.is_(True),
            )
            .first()
        )

        if user is None:
            raise HTTPException(
                status_code=400,
                detail="This account is unavailable.",
            )

        user.is_email_verified = True
        verification.used_at = now

        # Invalidate any other outstanding verification links.
        db.query(EmailVerificationToken).filter(
            EmailVerificationToken.user_id == user.id,
            EmailVerificationToken.id != verification.id,
            EmailVerificationToken.used_at.is_(None),
        ).update(
            {EmailVerificationToken.used_at: now},
            synchronize_session=False,
        )

        db.commit()

    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not verify your email. Please try again.",
        )

    return {"message": "Email verified successfully. You can now log in."}


@router.post("/resend-verification")
def resend_verification(
    request: ResendVerificationRequest,
    db: Session = Depends(get_db),
):
    email = str(request.email).strip().lower()

    generic_response = {
        "message": "If an unverified account exists, a new verification email will be sent."
    }

    user = (
        db.query(User)
        .filter(
            User.email == email,
            User.is_active.is_(True),
            User.is_email_verified.is_(False),
        )
        .first()
    )

    if user is None:
        return generic_response

    password_identity = (
        db.query(AuthIdentity)
        .filter(
            AuthIdentity.user_id == user.id,
            AuthIdentity.provider == "password",
        )
        .first()
    )

    if password_identity is None:
        return generic_response

    try:
        raw_token = create_verification_token(db, user)
        db.commit()
        send_email_verification_email(email, raw_token)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=503,
            detail="Could not send verification email. Please try again later.",
        )

    return generic_response

@router.post("/google")
def google_login(
    request: GoogleLoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    client_id = GOOGLE_CLIENT_ID

    try:
        google_user = id_token.verify_oauth2_token(
            request.credential,
            GoogleRequest(),
            client_id,
        )  # type: ignore[arg-type]

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Google authentication token.",
        )

    email = google_user.get("email")
    email_verified = google_user.get("email_verified")
    google_user_id = google_user.get("sub")

    if (
            not isinstance(email, str)
            or not email.strip()
            or email_verified is not True
            or not isinstance(google_user_id, str)
            or not google_user_id
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google account email could not be verified.",
        )

    email = email.strip().lower()

    identity = (
        db.query(AuthIdentity)
        .filter(
            AuthIdentity.provider == "google",
            AuthIdentity.provider_user_id == google_user_id,
        )
        .first()
    )

    if identity:
        user = identity.user

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This account has been disabled.",
            )

    else:

        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if user:
            if not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="This account has been disabled.",
                )

            user.is_email_verified = True

            identity = AuthIdentity(
                user_id=user.id,
                provider="google",
                provider_user_id=google_user_id,
            )

            db.add(identity)

        else:

            user = User(
                email=email,
                full_name=(
                    google_user.get("name")
                    or email.split("@")[0]
                ),
                profile_picture=google_user.get("picture"),
                is_email_verified=True,
                is_active=True,
            )

            db.add(user)
            db.flush()

            identity = AuthIdentity(
                user_id=user.id,
                provider="google",
                provider_user_id=google_user_id,
            )

            db.add(identity)

        try:
            db.commit()
            db.refresh(user)

        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Account could not be created or linked. Please try again.",
            )

    access_token = create_access_token(user.id)

    refresh_token = generate_refresh_token()

    refresh_session = RefreshSession(
        user_id=user.id,
        token_hash=hash_refresh_token(refresh_token),
        expires_at=get_refresh_token_expiry(),
    )

    try:
        db.add(refresh_session)
        db.commit()

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create login session.",
        )

    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
        path="/auth",
    )

    return {
        "message": "Google authentication successful.",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "profile_picture": user.profile_picture,
            "is_email_verified": user.is_email_verified,
        },
    }

@router.post("/login")
def login(
    request: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    email = str(request.email).strip().lower()

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    password_identity = None

    if user:
        password_identity = (
            db.query(AuthIdentity)
            .filter(
                AuthIdentity.user_id == user.id,
                AuthIdentity.provider == "password",
            )
            .first()
        )

    if (
        user is None
        or password_identity is None
        or not password_identity.password_hash
        or not verify_password(
            request.password,
            password_identity.password_hash,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been disabled.",
        )

    if not user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in.",
        )

    access_token = create_access_token(user.id)
    refresh_token = generate_refresh_token()

    refresh_session = RefreshSession(
        user_id=user.id,
        token_hash=hash_refresh_token(refresh_token),
        expires_at=get_refresh_token_expiry(),
    )

    try:
        db.add(refresh_session)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create login session.",
        )

    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
        path="/auth",
    )

    return {
        "message": "Login successful.",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "profile_picture": user.profile_picture,
            "is_email_verified": user.is_email_verified,
        },
    }

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "profile_picture": current_user.profile_picture,
        "is_email_verified": current_user.is_email_verified,
    }

@router.post("/refresh")
def refresh_access_token(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    refresh_token = request.cookies.get(REFRESH_COOKIE_NAME)

    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is missing.",
        )

    token_hash = hash_refresh_token(refresh_token)

    session = (
        db.query(RefreshSession)
        .filter(RefreshSession.token_hash == token_hash)
        .first()
    )

    if session is None or session.revoked_at is not None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh session.",
        )

    now = datetime.now(timezone.utc)

    if session.expires_at <= now:
        session.revoked_at = now
        db.commit()

        response.delete_cookie(
            key=REFRESH_COOKIE_NAME,
            path="/auth",
            httponly=True,
            secure=COOKIE_SECURE,
            samesite="lax",
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh session has expired.",
        )

    user = session.user

    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is unavailable.",
        )

    if not user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email verification is required.",
        )

    session.revoked_at = now

    new_refresh_token = generate_refresh_token()

    new_session = RefreshSession(
        user_id=user.id,
        token_hash=hash_refresh_token(new_refresh_token),
        expires_at=get_refresh_token_expiry(),
    )

    db.add(new_session)

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not rotate refresh token.",
        )

    new_access_token = create_access_token(user.id)

    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=new_refresh_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
        path="/auth",
    )

    return {
        "message": "Token refreshed successfully.",
        "access_token": new_access_token,
        "token_type": "bearer",
    }

@router.post("/logout")
def logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    refresh_token = request.cookies.get(REFRESH_COOKIE_NAME)

    if refresh_token:
        token_hash = hash_refresh_token(refresh_token)

        session = (
            db.query(RefreshSession)
            .filter(
                RefreshSession.token_hash == token_hash,
                RefreshSession.revoked_at.is_(None),
            )
            .first()
        )

        if session:
            session.revoked_at = datetime.now(timezone.utc)
            db.commit()

    response.delete_cookie(
        key=REFRESH_COOKIE_NAME,
        path="/auth",
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
    )

    return {
        "message": "Logged out successfully."
    }

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    email = str(request.email).strip().lower()

    generic_response = {
        "message": "If an eligible account exists, a password reset email will be sent."
    }

    user = (
        db.query(User)
        .filter(User.email == email, User.is_active.is_(True))
        .first()
    )

    if user is None:
        return generic_response

    password_identity = (
        db.query(AuthIdentity)
        .filter(
            AuthIdentity.user_id == user.id,
            AuthIdentity.provider == "password",
        )
        .first()
    )

    if password_identity is None or not password_identity.password_hash:
        return generic_response

    now = datetime.now(timezone.utc)

    try:

        db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.used_at.is_(None),
        ).update(
            {PasswordResetToken.used_at: now},
            synchronize_session=False,
        )

        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(
            raw_token.encode("utf-8")
        ).hexdigest()

        reset_token = PasswordResetToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=now + timedelta(minutes=15),
        )

        db.add(reset_token)
        db.commit()

        try:
            send_password_reset_email(email, raw_token)

        except Exception:
            db.rollback()
            db.query(PasswordResetToken).filter(
                PasswordResetToken.token_hash == token_hash,
                PasswordResetToken.used_at.is_(None),
            ).update(
                {PasswordResetToken.used_at: datetime.now(timezone.utc)},
                synchronize_session=False,
            )
            db.commit()

            raise HTTPException(
                status_code=503,
                detail="Password reset email could not be sent. Please try again later.",
            )

    except HTTPException:
        raise

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not process password reset request.",
        )

    return generic_response

@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    token_hash = hashlib.sha256(
        request.token.encode("utf-8")
    ).hexdigest()

    now = datetime.now(timezone.utc)

    try:
        reset_token = (
            db.query(PasswordResetToken)
            .filter(
                PasswordResetToken.token_hash == token_hash,
                PasswordResetToken.used_at.is_(None),
                PasswordResetToken.expires_at > now,
            )
            .with_for_update()
            .first()
        )

        if reset_token is None:
            raise HTTPException(
                status_code=400,
                detail="Reset link is invalid, expired, or already used.",
            )

        user = (
            db.query(User)
            .filter(
                User.id == reset_token.user_id,
                User.is_active.is_(True),
            )
            .first()
        )

        if user is None:
            raise HTTPException(
                status_code=400,
                detail="Reset link is invalid, expired, or already used.",
            )

        password_identity = (
            db.query(AuthIdentity)
            .filter(
                AuthIdentity.user_id == user.id,
                AuthIdentity.provider == "password",
            )
            .with_for_update()
            .first()
        )

        if password_identity is None:
            raise HTTPException(
                status_code=400,
                detail="Password reset is unavailable for this account.",
            )

        password_identity.password_hash = hash_password(
            request.new_password
        )

        reset_token.used_at = now

        db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.id != reset_token.id,
            PasswordResetToken.used_at.is_(None),
        ).update(
            {PasswordResetToken.used_at: now},
            synchronize_session=False,
        )

        db.query(RefreshSession).filter(
            RefreshSession.user_id == user.id,
            RefreshSession.revoked_at.is_(None),
        ).update(
            {RefreshSession.revoked_at: now},
            synchronize_session=False,
        )

        db.commit()

    except HTTPException:
        db.rollback()
        raise

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not reset password. Please try again.",
        )

    return {
        "message": "Password has been reset successfully. Please log in again."
    }