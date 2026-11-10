import os
import smtplib
from email.message import EmailMessage
from pathlib import Path

from dotenv import load_dotenv
from textwrap import dedent

load_dotenv(Path(__file__).resolve().parents[1] / ".env")


def send_password_reset_email(to_email: str, reset_token: str) -> None:
    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_APP_PASSWORD", "").replace(" ", "")
    frontend_url = os.getenv(
        "FRONTEND_URL", "http://localhost:5173"
    ).rstrip("/")

    if not smtp_email or not smtp_password:
        raise RuntimeError("SMTP credentials are not configured.")

    reset_link = f"{frontend_url}/reset-password?token={reset_token}"

    message = EmailMessage()
    message["From"] = smtp_email
    message["To"] = to_email
    message["Subject"] = "FraudShield | Reset Your Password"

    message.set_content(
        dedent(f"""\
            [SECURITY ALERT & ACCESS RECOVERY]
            --------------------------------------------------
            PLATFORM: FraudShield Risk Intelligence OS
            REQUEST: Password Reset / Credential Recalibration
            --------------------------------------------------

            Hello,

            A password reset request has been initiated for your
            FraudShield monitoring workspace associated with this email address.

            To establish a new secure password, authorize the request
            via the portal link below:

              {reset_link}

            [!] SECURITY NOTICE:
- This secure link expires after 15 minutes.

- It contains a single-use token that becomes invalid after

              a successful password reset.
- If you did not trigger this request, please disregard this

              notification. Your account remains secure.

            --------------------------------------------------
            FraudShield Security Operations
            Automated Telemetry Dispatch System
        """)
    )

    with smtplib.SMTP("smtp.gmail.com", 587, timeout=15) as server:
        server.starttls()
        server.login(smtp_email, smtp_password)
        server.send_message(message)


def send_email_verification_email(to_email: str, verification_token: str) -> None:
    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_APP_PASSWORD", "").replace(" ", "")
    frontend_url = os.getenv(
        "FRONTEND_URL", "http://localhost:5173"
    ).rstrip("/")

    if not smtp_email or not smtp_password:
        raise RuntimeError("SMTP credentials are not configured.")

    verification_link = (
        f"{frontend_url}/verify-email?token={verification_token}"
    )

    message = EmailMessage()
    message["From"] = smtp_email
    message["To"] = to_email
    message["Subject"] = "FraudShield | Verify Your Email Address"

    message.set_content(
        dedent(f"""\
            [SECURITY VERIFICATION]
            --------------------------------------------------
            PLATFORM: FraudShield Risk Intelligence OS
            REQUEST: New Account Email Verification
            --------------------------------------------------

            Hello,

            A new FraudShield account has been registered using
            this email address.

            To verify ownership of your email address and activate
            your account, use the secure link below:

              {verification_link}

            [!] SECURITY NOTICE:
            • This verification link expires after 15 minutes.
            • The link can only be used once.
            • Your account will remain inactive for login until
              your email address is verified.
            • If you did not create this account, disregard this email.

            --------------------------------------------------
            FraudShield Security Operations
            Automated Telemetry Dispatch System
        """)
    )

    with smtplib.SMTP("smtp.gmail.com", 587, timeout=15) as server:
        server.starttls()
        server.login(smtp_email, smtp_password)
        server.send_message(message)