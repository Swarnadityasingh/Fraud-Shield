import json
import pytest
from fastapi.testclient import TestClient

from app import main


@pytest.fixture
def client():
    with TestClient(main.app) as test_client:
        yield test_client


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
