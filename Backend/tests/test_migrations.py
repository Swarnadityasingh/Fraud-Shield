"""Integration checks for upgrades and the authenticated PostgreSQL workflow."""
import json
import os
import secrets
import uuid
from pathlib import Path

import pytest
from alembic import command
from alembic.autogenerate import compare_metadata
from alembic.config import Config
from alembic.migration import MigrationContext
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.schema import CreateSchema, DropSchema

from app import database, main
from app.database_models import AuthIdentity, User
from app.security import hash_password

BACKEND = Path(__file__).resolve().parents[1]


def migrate_and_check(engine, monkeypatch):
    monkeypatch.setattr(database, "engine", engine)
    cfg = Config(str(BACKEND / "alembic.ini"))
    cfg.set_main_option("script_location", str(BACKEND / "alembic"))
    command.upgrade(cfg, "head")
    command.upgrade(cfg, "head")
    with engine.connect() as conn:
        assert conn.scalar(text("SELECT version_num FROM alembic_version")) == "9ab32e041a67"
        for table in database.Base.metadata.tables:
            assert inspect(conn).has_table(table)
        assert compare_metadata(MigrationContext.configure(conn), database.Base.metadata) == []


def test_fresh_migrations(tmp_path, monkeypatch):
    engine = create_engine("sqlite:///" + str(tmp_path / "migration.db"))
    try:
        migrate_and_check(engine, monkeypatch)
    finally:
        engine.dispose()


@pytest.mark.skipif(os.getenv("FRAUDSHIELD_TEST_POSTGRES") != "1", reason="Set FRAUDSHIELD_TEST_POSTGRES=1 to audit a scratch PostgreSQL schema")
def test_live_postgres_migrations_and_history(monkeypatch):
    admin = database.engine
    assert admin.dialect.name == "postgresql"
    schema = "fs_audit_" + uuid.uuid4().hex
    with admin.begin() as conn:
        conn.execute(CreateSchema(schema))
    engine = create_engine(admin.url, connect_args={"options": "-csearch_path=" + schema}, hide_parameters=True)
    try:
        with engine.connect() as conn:
            assert conn.scalar(text("SELECT current_schema()")) == schema
        migrate_and_check(engine, monkeypatch)
        session = sessionmaker(bind=engine)
        monkeypatch.setattr(main, "engine", engine)
        monkeypatch.setattr(database, "SessionLocal", session)
        password = secrets.token_urlsafe(32)
        with session.begin() as db:
            for email in ("first@example.org", "second@example.org"):
                user = User(email=email, full_name="Audit account", is_email_verified=True)
                db.add(user)
                db.flush()
                db.add(AuthIdentity(user_id=user.id, provider="password", provider_user_id=email,
                                    password_hash=hash_password(password)))
        with TestClient(main.app) as client:
            def login(email):
                response = client.post("/auth/login", json={"email": email, "password": password})
                response.raise_for_status()
                return {"Authorization": "Bearer " + response.json()["access_token"]}

            owner = login("first@example.org")
            ids = []
            for route, sample in (("fraud", "fraud"), ("credit-risk", "credit_risk")):
                payload = json.loads((BACKEND / f"{sample}_test_payload.json").read_text())
                response = client.post("/predict/" + route, json=payload, headers=owner)
                response.raise_for_status()
                ids.append(response.json()["history_id"])
            assert client.get("/history", headers=owner).json()["total"] == 2
            other = login("second@example.org")
            assert client.get("/history", headers=other).json()["total"] == 0
            for row_id in ids:
                assert client.get(f"/history/{row_id}", headers=owner).status_code == 200
                assert client.get(f"/history/{row_id}", headers=other).status_code == 404
    finally:
        engine.dispose()
        with admin.begin() as conn:
            conn.execute(DropSchema(schema, cascade=True))
