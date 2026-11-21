import os
import secrets

# Keep local tests independent of a site signing key. The opt-in integration test
# alone uses the configured PostgreSQL database in a uniquely named scratch schema.
os.environ["JWT_SECRET_KEY"] = secrets.token_hex(32)
if os.getenv("FRAUDSHIELD_TEST_POSTGRES") != "1":
    os.environ["DATABASE_URL"] = "sqlite://"
