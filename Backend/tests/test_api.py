import json
import pytest
from fastapi.testclient import TestClient

from app import main


@pytest.fixture(scope="module")
def client(tmp_path_factory):
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from app import database
    from app.database_models import User
    from app.security import create_access_token

    engine = create_engine("sqlite:///" + str(tmp_path_factory.mktemp("db") / "test.db"))
    session = sessionmaker(bind=engine)
    with pytest.MonkeyPatch.context() as patch:
        patch.setattr(main, "engine", engine)
        patch.setattr(database, "SessionLocal", session)
        with TestClient(main.app) as test_client:
            with session.begin() as db:
                user = User(email="research@example.org", full_name="Research demo")
                db.add(user)
                db.flush()
                token = create_access_token(user.id)
            test_client.headers["Authorization"] = "Bearer " + token
            yield test_client
    engine.dispose()


def make_payload(model_name):
    model = main.models[model_name]

    if model is None:
        raise RuntimeError(f"{model_name} model is unavailable")

    preprocessor = model.named_steps["preprocessor"]

    features = {}

    for name, transformer, columns in preprocessor.transformers_:
        for column in columns:
            features[column] = (
                "unknown" if name == "categorical" else 0
            )

    return {"features": features}


def test_api_is_running(client):
    response = client.get("/")

    assert response.status_code == 200

    data = response.json()
    assert data["message"] == "FraudShield API is running"
    assert data["version"] == "2.0.0"


@pytest.mark.parametrize("route,file_stem,changes,threshold,score", [
    ("fraud", "fraud", {}, 0.21, 0.22790691867617516),
    ("credit-risk", "credit_risk", {"NumberOfTimes90DaysLate": 1}, 0.23, 0.31020491822975454),
    ("credit-risk", "credit_risk", {}, 0.23, 0.04155259649156279),
])
def test_research_serving_parity(client, route, file_stem, changes, threshold, score):
    from pathlib import Path

    path = Path(__file__).resolve().parents[1] / f"{file_stem}_test_payload.json"
    payload = json.loads(path.read_text())
    payload["features"].update(changes)
    response = client.post(f"/predict/{route}", json=payload)
    response.raise_for_status()
    result = response.json()
    assert result["decision_threshold"] == threshold
    assert result["probability"] == pytest.approx(score, abs=1e-12, rel=0)
    assert result["prediction"] == int(score >= threshold)
    expected_hash = {
        "fraud": "d8c98d26d7458b13d79e6328c2f1ddd9c75dcdd175bc3cc12923732665f17f00",
        "credit-risk": "607e7f0ba9ecfefa342ea25311c2e021123e5727d2459964fc45b0cf4778c90c",
    }[route]
    assert result["model_version"] == expected_hash
    assert result["risk_level"] == ("High" if score >= 0.70 else "Medium" if score >= 0.30 else "Low")
    record = client.get(f"/history/{result['history_id']}").json()
    assert record["risk_level"] == result["risk_level"]
    assert record["prediction"] == result["prediction"]
    assert record["probability"] == pytest.approx(score, abs=1e-12, rel=0)


def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "healthy"
    assert data["models"]["fraud_detection"] is True
    assert data["models"]["credit_risk"] is True


def test_valid_fraud_prediction(client):
    response = client.post(
        "/predict/fraud",
        json=make_payload("fraud"),
    )

    assert response.status_code == 200

    data = response.json()

    assert data["prediction"] in [0, 1]
    assert data["prediction_label"] in [
        "Fraudulent",
        "Legitimate",
    ]
    assert 0.0 <= data["probability"] <= 1.0
    assert data["risk_level"] in ["Low", "Medium", "High"]
    assert data["model_connected"] is True


def test_valid_credit_risk_prediction(client):
    response = client.post(
        "/predict/credit-risk",
        json=make_payload("credit_risk"),
    )

    assert response.status_code == 200

    data = response.json()

    assert data["prediction"] in [0, 1]
    assert data["prediction_label"] in [
        "Serious Delinquency",
        "No Serious Delinquency",
    ]
    assert 0.0 <= data["probability"] <= 1.0
    assert data["risk_level"] in ["Low", "Medium", "High"]
    assert data["model_connected"] is True


def test_invalid_input_is_rejected(client):
    for endpoint in ["/predict/fraud", "/predict/credit-risk"]:
        response = client.post(endpoint, json={})
        assert response.status_code == 422


def test_missing_features_are_rejected(client):
    response = client.post(
        "/predict/fraud",
        json={"features": {"TransactionAmt": 250.0}},
    )

    assert response.status_code == 422


def test_missing_fraud_model_returns_service_unavailable(
    client,
    monkeypatch,
):
    monkeypatch.setitem(main.models, "fraud", None)

    response = client.post(
        "/predict/fraud",
        json={"features": {}},
    )

    assert response.status_code == 503


def test_missing_credit_model_returns_service_unavailable(
    client,
    monkeypatch,
):
    monkeypatch.setitem(main.models, "credit_risk", None)

    response = client.post(
        "/predict/credit-risk",
        json={"features": {}},
    )

    assert response.status_code == 503


def test_prediction_history_returns_records(client):
    client.post("/predict/fraud", json=make_payload("fraud")).raise_for_status()
    client.post("/predict/credit-risk", json=make_payload("credit_risk")).raise_for_status()
    response = client.get("/history")

    assert response.status_code == 200

    data = response.json()

    assert "total" in data
    assert "records" in data
    assert data["total"] >= 2

    for record in data["records"]:
        assert record["model_type"] in ["fraud", "credit_risk"]
        assert record["prediction"] in [0, 1]
        assert 0.0 <= record["probability"] <= 1.0
        assert record["risk_level"] in ["Low", "Medium", "High"]


def test_prediction_history_filtering(client):
    for model_type in ["fraud", "credit_risk"]:
        response = client.get(
            "/history",
            params={"model_type": model_type},
        )

        assert response.status_code == 200

        data = response.json()

        for record in data["records"]:
            assert record["model_type"] == model_type


def test_prediction_history_pagination(client):
    response = client.get(
        "/history",
        params={"limit": 1, "offset": 0},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["limit"] == 1
    assert data["offset"] == 0
    assert len(data["records"]) <= 1


def test_get_prediction_by_id(client):
    client.post("/predict/fraud", json=make_payload("fraud")).raise_for_status()
    history_response = client.get("/history")

    assert history_response.status_code == 200

    records = history_response.json()["records"]

    assert len(records) > 0

    history_id = records[0]["id"]

    response = client.get(f"/history/{history_id}")

    assert response.status_code == 200
    assert response.json()["id"] == history_id


def test_get_nonexistent_prediction_returns_404(client):
    response = client.get("/history/999999999")

    assert response.status_code == 404

    assert response.json()["detail"] == (
        "Prediction history record not found."
    )


@pytest.mark.parametrize(
    "endpoint,model_name,numeric_feature",
    [
        ("/predict/fraud", "fraud", "TransactionAmt"),
        (
            "/predict/credit-risk",
            "credit_risk",
            "RevolvingUtilizationOfUnsecuredLines",
        ),
    ],
)
def test_invalid_numeric_feature_is_rejected(
    client,
    endpoint,
    model_name,
    numeric_feature,
):
    payload = make_payload(model_name)
    payload["features"][numeric_feature] = "invalid_number"

    response = client.post(
        endpoint,
        content=json.dumps(payload),
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 422
    assert response.json()["detail"]["message"] == (
        "Invalid feature values."
    )


@pytest.mark.parametrize(
    "endpoint,model_name,numeric_feature",
    [
        ("/predict/fraud", "fraud", "TransactionAmt"),
        (
            "/predict/credit-risk",
            "credit_risk",
            "RevolvingUtilizationOfUnsecuredLines",
        ),
    ],
)
def test_boolean_numeric_feature_is_rejected(
    client,
    endpoint,
    model_name,
    numeric_feature,
):
    payload = make_payload(model_name)
    payload["features"][numeric_feature] = True

    response = client.post(endpoint, json=payload)

    assert response.status_code == 422
    assert response.json()["detail"]["message"] == (
        "Invalid feature values."
    )


@pytest.mark.parametrize(
    "invalid_value",
    [float("nan"), float("inf"), float("-inf")],
)
@pytest.mark.parametrize(
    "endpoint,model_name,numeric_feature",
    [
        ("/predict/fraud", "fraud", "TransactionAmt"),
        (
            "/predict/credit-risk",
            "credit_risk",
            "RevolvingUtilizationOfUnsecuredLines",
        ),
    ],
)
def test_non_finite_numeric_feature_is_rejected(
    client,
    endpoint,
    model_name,
    numeric_feature,
    invalid_value,
):
    payload = make_payload(model_name)
    payload["features"][numeric_feature] = invalid_value

    response = client.post(
        endpoint,
        content=json.dumps(payload),
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 422
    assert response.json()["detail"]["message"] == (
        "Invalid feature values."
    )

def test_prediction_history_commit_failure_returns_500(
    client,
    monkeypatch,
):
    from app.database import get_db

    def override_get_db():
        from app.database import SessionLocal

        db = SessionLocal()

        def failing_commit():
            raise Exception("Simulated database failure")

        monkeypatch.setattr(db, "commit", failing_commit)

        try:
            yield db
        finally:
            db.close()

    main.app.dependency_overrides[get_db] = override_get_db

    try:
        response = client.post(
            "/predict/fraud",
            json=make_payload("fraud"),
        )

        assert response.status_code == 500
        assert response.json()["detail"] == (
            "Prediction generated but history could not be saved."
        )
    finally:
        main.app.dependency_overrides.pop(get_db, None)


@pytest.mark.parametrize(
    "endpoint,model_name",
    [
        ("/predict/fraud", "fraud"),
        ("/predict/credit-risk", "credit_risk"),
    ],
)
def test_prediction_response_structure(
    client,
    endpoint,
    model_name,
):
    response = client.post(
        endpoint,
        json=make_payload(model_name),
    )

    assert response.status_code == 200

    data = response.json()

    required_fields = {
        "prediction",
        "prediction_label",
        "probability",
        "risk_level",
        "model_connected",
        "history_id",
        "created_at",
        "model",
    }

    assert required_fields.issubset(data.keys())
    assert isinstance(data["history_id"], int)
    assert isinstance(data["created_at"], str)
    assert data["model_connected"] is True
    assert 0.0 <= data["probability"] <= 1.0


def test_private_history_and_schema(client):
    from app.database import SessionLocal
    from app.database_models import User
    from app.security import create_access_token

    for route, key in [("fraud", "fraud"), ("credit-risk", "credit_risk")]:
        response = client.get(f"/predict/{route}/schema")
        assert set(response.json()["features"]) == set(make_payload(key)["features"])
        assert client.post(f"/predict/{route}", json=make_payload(key),
                           headers={"Authorization": ""}).status_code == 401
    assert client.get("/history", headers={"Authorization": ""}).status_code == 401
    saved = client.post("/predict/fraud", json=make_payload("fraud")).json()
    with SessionLocal.begin() as db:
        user = User(email="second@example.org", full_name="Second user")
        db.add(user)
        db.flush()
        headers = {"Authorization": "Bearer " + create_access_token(user.id)}
    assert client.get("/history", headers=headers).json()["total"] == 0
    assert client.get(f"/history/{saved['history_id']}", headers=headers).status_code == 404
