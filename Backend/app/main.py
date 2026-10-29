
from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="FraudShield API", version="1.0.0")

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

MODEL_PATH = Path(__file__).resolve().parent / "fraud_model.joblib"
model = None


@app.on_event("startup")
def load_model():
    global model
    if MODEL_PATH.exists():
        model = joblib.load(MODEL_PATH)


class Transaction(BaseModel):
    amount: float = Field(gt=0)
    transaction_type: str
    step: int = Field(default=1, ge=1, le=744)


@app.get("/")
def home():
    return {"message": "FraudShield API is running"}


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_connected": model is not None,
    }


@app.post("/predict")
def predict(transaction: Transaction):
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not found. Run training/train.py first.",
        )

    features = pd.DataFrame([{
        "step": transaction.step,
        "type": transaction.transaction_type.upper(),
        "amount": transaction.amount,
    }])

    try:
        prediction = int(model.predict(features)[0])
        probabilities = model.predict_proba(features)[0]
        classes = list(model.classes_)
        fraud_index = classes.index(1)
        probability = float(probabilities[fraud_index])
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Could not analyze transaction: {exc}",
        ) from exc

    risk = (
        "High" if probability >= 0.70
        else "Medium" if probability >= 0.30
        else "Low"
    )

    return {
        "prediction": "Fraudulent" if prediction == 1 else "Legitimate",
        "fraud_probability": round(probability, 4),
        "risk_level": risk,
        "model_connected": True,
        "disclaimer": "Experimental prediction from a synthetic dataset.",
    }
