from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any
from app.database import engine, Base, get_db
from app.database_models import PredictionHistory
from app.auth import router as auth_router

import joblib
import math
import pandas as pd

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy.orm import Session


BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"

FRAUD_MODEL_PATH = MODEL_DIR / "ieee_cis_model.joblib"
CREDIT_MODEL_PATH = MODEL_DIR / "credit_risk_model.joblib"

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
        loaded_model = joblib.load(path)
        print(f"{name} model loaded successfully.")
        return loaded_model
    except Exception as exc:
        print(f"Error loading {name} model: {exc}")
        return None


@asynccontextmanager
async def lifespan(_app: FastAPI):
    models["fraud"] = load_model("IEEE-CIS", FRAUD_MODEL_PATH)
    models["credit_risk"] = load_model("Credit Risk", CREDIT_MODEL_PATH)

    Base.metadata.create_all(bind=engine)
    print("Database tables initialized successfully.")

    yield

    models["fraud"] = None
    models["credit_risk"] = None


app = FastAPI(
    title="FraudShield API",
    version="2.0.0",
    lifespan=lifespan,
)

app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
            [supplied_features],
            columns=expected_features,
        )

        prediction = int(model.predict(features)[0])

        probabilities = model.predict_proba(features)[0]
        classes = list(model.classes_)

        if 1 not in classes:
            raise ValueError("Positive class 1 is missing.")

        probability = float(probabilities[classes.index(1)])

        risk_level = (
            "High" if probability >= 0.70
            else "Medium" if probability >= 0.30
            else "Low"
        )

        try:
            history = PredictionHistory(
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
            "probability": round(probability, 4),
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
            detail=f"Could not process prediction: {exc}",
        ) from exc


@app.post("/predict/fraud")
def predict_fraud(
    request: PredictionRequest,
    db: Session = Depends(get_db),
):
    result = run_prediction("fraud", request, db)
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
    db: Session = Depends(get_db),
):
    result = run_prediction("credit_risk", request, db)
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
    db: Session = Depends(get_db),
):
    query = db.query(PredictionHistory)

    if model_type:
        query = query.filter(PredictionHistory.model_type == model_type)

    total = query.count()
    records = (
        query.order_by(PredictionHistory.created_at.desc())
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
    db: Session = Depends(get_db),
):
    record = db.query(PredictionHistory).filter(
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
