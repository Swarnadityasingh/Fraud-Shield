from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any
import os
import logging
from urllib.parse import urlsplit
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.database import engine, Base, get_db
from app.database_models import PredictionHistory, User
from app.security import get_current_user
from app.auth import router as auth_router

import hashlib
import joblib
import math
import pandas as pd

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy.orm import Session


BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"

FRAUD_MODEL_PATH = MODEL_DIR / "fraud_selected.joblib"
CREDIT_MODEL_PATH = MODEL_DIR / "credit_selected.joblib"

models: dict[str, Any] = {
    "fraud": None,
    "credit_risk": None,
}

class PredictionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    features: dict[str, Any]


def validate_feature_values(model, features: dict[str, Any]):
    preprocessor = model.named_steps["preprocessor"]

    numeric_columns = set()
    categorical_columns = set()

    for name, transformer, columns in preprocessor.transformers_:
        if name == "numeric":
            numeric_columns.update(columns)
        elif name == "categorical":
            categorical_columns.update(columns)

    errors = []

    for column, value in features.items():

        if value is None:
            continue

        if isinstance(value, bool):
            errors.append(
                f"{column} must not contain a boolean value."
            )
            continue

        if column in numeric_columns:
            if not isinstance(value, (int, float)):
                errors.append(
                    f"{column} must be a numeric value or null."
                )
            elif not math.isfinite(value):
                errors.append(
                    f"{column} must be a finite numeric value."
                )

        elif column in categorical_columns:
            if not isinstance(value, (str, int, float)):
                errors.append(
                    f"{column} must be a string, number, or null."
                )
            elif isinstance(value, float) and not math.isfinite(value):
                errors.append(
                    f"{column} must be a finite categorical value."
                )

    if errors:
        raise HTTPException(
            status_code=422,
            detail={
                "message": "Invalid feature values.",
                "errors": errors,
            },
        )


def load_model(name: str, path: Path):
    if not path.exists():
        print(f"{name} model not found: {path}")
        return None

    try:
        with path.open("rb") as artifact:
            digest = hashlib.sha256()
            for block in iter(lambda: artifact.read(1024 * 1024), b""):
                digest.update(block)
            artifact.seek(0)
            loaded_model = joblib.load(artifact)
        # Accumulate the 100 tree scores in tree order, independent of batch size.
        loaded_model.named_steps["classifier"].set_params(n_jobs=1)
        loaded_model.artifact_sha256_ = digest.hexdigest()
        if not 0 < loaded_model.decision_threshold_ < 1:
            raise ValueError("Invalid binary decision threshold.")
        print(f"{name} model loaded successfully.")
        return loaded_model
    except Exception as exc:
        print(f"Error loading {name} model: {exc}")
        return None


@asynccontextmanager
async def lifespan(_app: FastAPI):
    models["fraud"] = load_model("IEEE-CIS", FRAUD_MODEL_PATH)
    models["credit_risk"] = load_model("Credit Risk", CREDIT_MODEL_PATH)

    # PostgreSQL deployments apply Alembic before starting the service.
    if engine.dialect.name == "sqlite":
        Base.metadata.create_all(bind=engine)

    yield

    models["fraud"] = None
    models["credit_risk"] = None


app = FastAPI(
    title="FraudShield API",
    version="2.0.0",
    lifespan=lifespan,
)

@app.exception_handler(RequestValidationError)
async def validation_error(_request, exc):
    # Validation errors can contain a submitted password, credential or feature vector.
    return JSONResponse(status_code=422, content={"detail": [
        {"loc": err["loc"], "type": err["type"], "msg": err["msg"]} for err in exc.errors()
    ]})


class RedactQueryString(logging.Filter):
    def filter(self, record):
        # Uvicorn access logs include the email-verification token in the request target.
        if isinstance(record.args, tuple) and len(record.args) == 5:
            client, method, target, protocol, status = record.args
            record.args = (client, method, str(target).split("?", 1)[0], protocol, status)
        return True


logging.getLogger("uvicorn.access").addFilter(RedactQueryString())
app.include_router(auth_router)
origins = [origin.strip().rstrip("/") for origin in os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(",") if origin.strip()]
for origin in origins:
    parsed = urlsplit(origin)
    if parsed.scheme not in ("https", "http") or not parsed.netloc or parsed.path or parsed.query or parsed.fragment or parsed.username or "*" in origin:
        raise RuntimeError("CORS_ORIGINS requires explicit HTTP(S) origins.")
    if os.getenv("APP_ENV", "").lower() == "production" and parsed.scheme != "https":
        raise RuntimeError("Production requires HTTPS CORS origins.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get("/")
def home():
    return {
        "message": "FraudShield API is running",
        "version": "2.0.0",
        "models": ["fraud", "credit_risk"],
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "models": {
            "fraud_detection": models["fraud"] is not None,
            "credit_risk": models["credit_risk"] is not None,
        },
    }


def run_prediction(
    model_name: str,
    request: PredictionRequest,
    db: Session,
    user_id: int,
):
    model = models[model_name]

    if model is None:
        raise HTTPException(
            status_code=503,
            detail=f"{model_name} model is not available.",
        )

    try:
        expected_features = list(model.feature_names_in_)
        supplied_features = request.features

        missing = [
            col for col in expected_features
            if col not in supplied_features
        ]

        extra = [
            col for col in supplied_features
            if col not in expected_features
        ]

        if missing or extra:
            raise HTTPException(
                status_code=422,
                detail={
                    "message": "Feature schema mismatch.",
                    "missing_features": missing,
                    "unexpected_features": extra,
                },
            )
        validate_feature_values(model, supplied_features)

        features = pd.DataFrame(
            [{k: float("nan") if v is None else v for k, v in supplied_features.items()}],
            columns=expected_features,
        )

        probabilities = model.predict_proba(features)[0]
        classes = list(model.classes_)

        if 1 not in classes:
            raise ValueError("Positive class 1 is missing.")

        probability = float(probabilities[classes.index(1)])
        threshold = model.decision_threshold_
        prediction = int(probability >= threshold)

        risk_level = (
            "High" if probability >= 0.70
            else "Medium" if probability >= 0.30
            else "Low"
        )

        try:
            history = PredictionHistory(
                user_id=user_id,
                model_type=model_name,
                prediction=prediction,
                probability=probability,
                risk_level=risk_level,
            )
            db.add(history)
            db.commit()
            db.refresh(history)
        except Exception as exc:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail="Prediction generated but history could not be saved.",
            ) from exc

        return {
            "prediction": prediction,
            "probability": probability,
            "decision_threshold": threshold,
            "model_version": model.artifact_sha256_,
            "risk_level": risk_level,
            "model_connected": True,
            "history_id": history.id,
            "created_at": history.created_at,
        }

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail="Could not process the supplied feature values.",
        ) from exc


@app.get("/predict/{model_name}/schema")
def feature_schema(model_name: str, current_user: User = Depends(get_current_user)):
    key = {"fraud": "fraud", "credit-risk": "credit_risk"}.get(model_name)
    if key is None:
        raise HTTPException(404, "Unknown model.")
    model = models[key]
    if model is None:
        raise HTTPException(503, "Model is unavailable.")
    return {"features": list(model.feature_names_in_)}


@app.post("/predict/fraud")
def predict_fraud(
    request: PredictionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = run_prediction("fraud", request, db, current_user.id)
    return {
        **result,
        "prediction_label": (
            "Fraudulent" if result["prediction"] == 1
            else "Legitimate"
        ),
        "model": "IEEE-CIS Random Forest",
    }


@app.post("/predict/credit-risk")
def predict_credit_risk(
    request: PredictionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = run_prediction("credit_risk", request, db, current_user.id)
    return {
        **result,
        "prediction_label": (
            "Serious Delinquency" if result["prediction"] == 1
            else "No Serious Delinquency"
        ),
        "model": "Give Me Some Credit Random Forest",
    }


@app.get("/history")
def get_prediction_history(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    model_type: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(PredictionHistory).filter(PredictionHistory.user_id == current_user.id)

    if model_type:
        query = query.filter(PredictionHistory.model_type == model_type)

    total = query.count()
    records = (
        query.order_by(PredictionHistory.created_at.desc(), PredictionHistory.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "records": [
            {
                "id": record.id,
                "model_type": record.model_type,
                "prediction": record.prediction,
                "probability": record.probability,
                "risk_level": record.risk_level,
                "created_at": record.created_at,
            }
            for record in records
        ],
    }


@app.get("/history/{history_id}")
def get_prediction_by_id(
    history_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = db.query(PredictionHistory).filter(
        PredictionHistory.user_id == current_user.id,
        PredictionHistory.id == history_id
    ).first()

    if record is None:
        raise HTTPException(
            status_code=404,
            detail="Prediction history record not found.",
        )

    return {
        "id": record.id,
        "model_type": record.model_type,
        "prediction": record.prediction,
        "probability": record.probability,
        "risk_level": record.risk_level,
        "created_at": record.created_at,
    }
