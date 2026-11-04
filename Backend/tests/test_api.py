import pytest
from fastapi.testclient import TestClient

from app import main

@pytest.fixture
def client():
    with TestClient(main.app) as test_client:
        yield test_client

def test_api_is_running(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "FraudShield API is running"
    }

def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "healthy"
    assert data["model_connected"] is True

def test_valid_transaction_prediction(client):
    response = client.post(
        "/predict",
        json={
            "amount": 2500.0,
            "transaction_type": "TRANSFER",
            "step": 1,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["prediction"] in ["Fraudulent", "Legitimate"]
    assert 0.0 <= data["fraud_probability"] <= 1.0
    assert data["risk_level"] in ["Low", "Medium", "High"]
    assert data["model_connected"] is True
    assert "disclaimer" in data

def test_invalid_input_is_rejected(client):
    response = client.post(
        "/predict",
        json={},
    )

    assert response.status_code == 422

def test_zero_or_negative_amount_is_rejected(client):
    for amount in [0, -100]:
        response = client.post(
            "/predict",
            json={
                "amount": amount,
                "transaction_type": "TRANSFER",
                "step": 1,
            },
        )

        assert response.status_code == 422

def test_invalid_step_is_rejected(client):
    for step in [0, 745]:
        response = client.post(
            "/predict",
            json={
                "amount": 2500.0,
                "transaction_type": "TRANSFER",
                "step": step,
            },
        )

        assert response.status_code == 422

def test_missing_model_returns_service_unavailable(
    monkeypatch,
    tmp_path,
):
    missing_model = tmp_path / "missing_model.joblib"

    monkeypatch.setattr(
        main,
        "MODEL_PATH",
        missing_model,
    )

    with TestClient(main.app) as test_client:
        response = test_client.post(
            "/predict",
            json={
                "amount": 2500.0,
                "transaction_type": "TRANSFER",
                "step": 1,
            },
        )

    assert response.status_code == 503
    assert response.json()["detail"] == (
        "Model not found. Run training/train.py first."
    )
