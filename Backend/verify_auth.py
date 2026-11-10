from sqlalchemy import text
from app.database import engine

with engine.connect() as connection:

    users = connection.execute(
        text("""
            SELECT id, email, full_name, is_email_verified
            FROM users
        """)
    ).fetchall()

    identities = connection.execute(
        text("""
            SELECT provider, user_id
            FROM auth_identities
            WHERE provider = :provider
        """),
        {"provider": "google"},
    ).fetchall()

    sessions = connection.execute(
        text("""
            SELECT id, user_id, expires_at, revoked_at
            FROM refresh_sessions
        """)
    ).fetchall()

    print("\nUSERS:", users)
    print("\nGOOGLE IDENTITIES:", identities)
    print("\nREFRESH SESSIONS:", sessions)
