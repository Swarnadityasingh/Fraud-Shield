"""Exercise the shipped models through ASGI using an isolated, temporary demo account."""
import json
import os
from pathlib import Path
import secrets
import sys
from tempfile import TemporaryDirectory

from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def main():
    with TemporaryDirectory() as tmp:
        os.environ["DATABASE_URL"] = "sqlite:///" + (Path(tmp) / "demo.db").as_posix()
        os.environ["JWT_SECRET_KEY"] = secrets.token_hex(32)
        from app.main import app
        from app.database import engine, SessionLocal
        from app.database_models import User, AuthIdentity
        from app.security import hash_password

        with TestClient(app) as client:
            password = secrets.token_urlsafe(24)
            email = "demo@example.org"
            with SessionLocal.begin() as db:
                user = User(email=email, full_name="Research Demo", is_email_verified=True)
                db.add(user)
                db.flush()
                db.add(AuthIdentity(user_id=user.id, provider="password", provider_user_id=email,
                                    password_hash=hash_password(password)))
            login = client.post("/auth/login", json={"email":email, "password":password})
            login.raise_for_status()
            evidence = {"transport":"in-process FastAPI TestClient", "database":"temporary SQLite",
                        "inputs":"repository example payloads", "login_status": login.status_code}
            client.headers["Authorization"] = "Bearer " + login.json()["access_token"]
            for route, filename in [("fraud","fraud"), ("credit-risk","credit_risk")]:
                schema = client.get(f"/predict/{route}/schema")
                schema.raise_for_status()
                payload = json.loads((ROOT / f"{filename}_test_payload.json").read_text())
                response = client.post(f"/predict/{route}", json=payload)
                response.raise_for_status()
                evidence[route] = {"fields":len(schema.json()["features"]), "status":response.status_code,
                                   "response":response.json()}
            history = client.get("/history")
            history.raise_for_status()
            evidence["history"] = history.json()
            assert {row["id"] for row in evidence["history"]["records"]} == {
                evidence[route]["response"]["history_id"] for route in ("fraud","credit-risk")}
            output = ROOT / "reports/research/api_workflow.json"
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_text(json.dumps(evidence, indent=2))
        engine.dispose()


if __name__ == "__main__":
    main()
