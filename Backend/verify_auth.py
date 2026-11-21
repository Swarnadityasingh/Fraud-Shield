"""Show authentication table counts for local diagnostics."""
from sqlalchemy import func, select

from app.database import SessionLocal
from app.database_models import AuthIdentity, RefreshSession, User


if __name__ == "__main__":
    with SessionLocal() as db:
        for entity in (User, AuthIdentity, RefreshSession):
            print(entity.__tablename__, db.scalar(select(func.count()).select_from(entity)))
