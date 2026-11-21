"""PostgreSQL audit: read-only by default; --exercise upgrades and tests a scratch DB.

Never prints connection URLs or row data. Exercise mode advances the configured
database only from the reviewed former head with matching metadata. Destructive
rollback checks run exclusively in a newly created, separately named database.
"""
import json
import os
from pathlib import Path
import subprocess
import sys
import uuid

from alembic import command
from alembic.config import Config
from alembic.autogenerate import compare_metadata
from alembic.migration import MigrationContext
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.exc import IntegrityError

from app import database
from app.database import Base, engine
from app import database_models  # noqa: F401


def snapshot(conn):
    inspector = inspect(conn)
    tables = inspector.get_table_names()
    result = {
        "dialect": conn.dialect.name,
        "server_version": conn.dialect.server_version_info,
        "revision": conn.scalar(text("SELECT version_num FROM alembic_version")) if "alembic_version" in tables else None,
        "tables": tables,
        "schema_differences": [str(d) for d in compare_metadata(MigrationContext.configure(conn, opts={"compare_type": True}), Base.metadata)],
        "constraints": {},
    }
    for table in Base.metadata.tables:
        if table in tables:
            result["constraints"][table] = {
                "foreign_keys": inspector.get_foreign_keys(table),
                "unique": inspector.get_unique_constraints(table),
                "indexes": inspector.get_indexes(table),
                "nullable": {c["name"]: c["nullable"] for c in inspector.get_columns(table)},
            }
    return result


BACKEND = Path(__file__).resolve().parent


def config():
    cfg = Config(str(BACKEND / "alembic.ini"))
    cfg.set_main_option("script_location", str(BACKEND / "alembic"))
    return cfg


def exercise():
    """Only the reviewed head upgrade touches the configured database."""
    with engine.connect() as conn:
        before = snapshot(conn)
        counts = {t: conn.scalar(text(f'SELECT count(*) FROM "{t}"')) for t in Base.metadata.tables}
    assert before["revision"] in ("7d7f41e47961", "9ab32e041a67")
    assert before["schema_differences"] == []
    command.upgrade(config(), "head")
    with engine.connect() as conn:
        after = snapshot(conn)
        assert after["revision"] == "9ab32e041a67"
        assert after["schema_differences"] == []
        assert counts == {t: conn.scalar(text(f'SELECT count(*) FROM "{t}"')) for t in Base.metadata.tables}
    print("PASS existing database upgrade: head, no schema drift, all table row counts unchanged", flush=True)

    scratch_name = "fs_audit_" + uuid.uuid4().hex
    admin = create_engine(engine.url, isolation_level="AUTOCOMMIT", hide_parameters=True)
    scratch = None
    created = False
    try:
        with admin.connect() as conn:
            conn.execute(text(f'CREATE DATABASE "{scratch_name}"'))
        created = True
        scratch = create_engine(engine.url.set(database=scratch_name), hide_parameters=True)
        database.engine = scratch
        command.upgrade(config(), "head")
        command.upgrade(config(), "head")
        with scratch.connect() as conn:
            assert snapshot(conn)["schema_differences"] == []
        print("PASS separate fresh PostgreSQL database: initialization, repeat upgrade, metadata consistency", flush=True)

        with scratch.begin() as conn:
            owner = conn.scalar(text("INSERT INTO users (email,full_name,is_email_verified,is_active) VALUES ('audit@example.org','Audit',true,true) RETURNING id"))
            conn.execute(text("INSERT INTO prediction_history (user_id,model_type,prediction,probability,risk_level) VALUES (:uid,'fraud',0,0.1,'Low')"), {"uid": owner})
            for table in ("auth_identities", "refresh_sessions", "password_reset_tokens", "email_verification_tokens"):
                if table == "auth_identities":
                    sql = "INSERT INTO auth_identities (user_id,provider,provider_user_id) VALUES (:uid,'audit','audit')"
                else:
                    sql = f"INSERT INTO {table} (user_id,token_hash,expires_at) VALUES (:uid,'audit',now() + interval '1 day')"
                conn.execute(text(sql), {"uid": owner})
            try:
                with conn.begin_nested():
                    conn.execute(text("INSERT INTO prediction_history (user_id,model_type,prediction,probability,risk_level) VALUES (-1,'fraud',0,0.1,'Low')"))
            except IntegrityError:
                pass
            else:
                raise AssertionError("Orphan ownership accepted")
            conn.execute(text("DELETE FROM users WHERE id=:uid"), {"uid": owner})
            assert conn.scalar(text("SELECT count(*) FROM prediction_history WHERE user_id IS NULL")) == 1
            for table in ("auth_identities", "refresh_sessions", "password_reset_tokens", "email_verification_tokens"):
                assert conn.scalar(text(f"SELECT count(*) FROM {table}")) == 0
        print("PASS PostgreSQL FK enforcement, account cascades, retained history with SET NULL", flush=True)

        command.downgrade(config(), "7d7f41e47961")
        with scratch.connect() as conn:
            assert inspect(conn).has_table("password_reset_tokens")
            assert inspect(conn).has_table("email_verification_tokens")
        command.upgrade(config(), "head")
        with scratch.begin() as conn:
            owner = conn.scalar(text("INSERT INTO users (email,full_name,is_email_verified,is_active) VALUES ('rollback@example.org','Audit',true,true) RETURNING id"))
            conn.execute(text("UPDATE prediction_history SET user_id=:uid"), {"uid": owner})
        command.downgrade(config(), "base")
        command.upgrade(config(), "head")
        with scratch.connect() as conn:
            assert snapshot(conn)["schema_differences"] == []
            assert conn.scalar(text("SELECT count(*) FROM prediction_history WHERE user_id IS NULL")) == 1
        print("CONFIRMED rollback limitation: head downgrade preserves tokens; full downgrade/reupgrade loses history ownership", flush=True)

        env = os.environ.copy()
        env["DATABASE_URL"] = scratch.url.render_as_string(hide_password=False)
        env["FRAUDSHIELD_TEST_POSTGRES"] = "1"
        result = subprocess.run([sys.executable, "-m", "pytest", "-q"], cwd=BACKEND, env=env, check=False)
        print(f"Backend suite exit code: {result.returncode}", flush=True)
        if result.returncode:
            raise RuntimeError("Backend suite failed")
    finally:
        database.engine = engine
        if scratch is not None:
            scratch.dispose()
        if created:
            # Name is generated here and never comes from configuration or user input.
            assert scratch_name.startswith("fs_audit_") and len(scratch_name) == 41
            with admin.connect() as conn:
                conn.execute(text(f'DROP DATABASE "{scratch_name}"'))
            print("PASS removed only the disposable database created by this audit", flush=True)
        admin.dispose()


if __name__ == "__main__":
    try:
        assert engine.dialect.name == "postgresql"
        if "--exercise" in sys.argv:
            exercise()
        else:
            with engine.connect() as conn:
                conn.execute(text("SET TRANSACTION READ ONLY"))
                print(json.dumps(snapshot(conn), indent=2, default=str))
    except Exception as error:
        print(json.dumps({"error_type": type(error).__name__}))
        raise SystemExit(1) from None
