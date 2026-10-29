
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_api_is_running():
    response = client.get("/")

    assert response.status_code == 200


def test_invalid_input_is_rejected():
    response = client.post(
        "/predict",
        json={}
    )

    assert response.status_code in (400, 422)
