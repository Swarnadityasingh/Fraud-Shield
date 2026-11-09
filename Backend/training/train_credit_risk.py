from pathlib import Path
import json
import gc

import joblib
import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    average_precision_score,
    classification_report,
    confusion_matrix,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OrdinalEncoder


BASE_DIR = Path(__file__).resolve().parents[1]

DATA_PATH = (
    Path(r"D:\FraudShield-Datasets\GiveMeSomeCredit")
    / "cs-training.csv"
)

REPORT_DIR = BASE_DIR / "reports"
MODEL_DIR = BASE_DIR / "app" / "models"

MODEL_PATH = MODEL_DIR / "credit_risk_model.joblib"
METRICS_PATH = REPORT_DIR / "credit_risk_metrics.json"

TARGET = "SeriousDlqin2yrs"
EXCLUDED = ["Unnamed: 0", TARGET]

REPORT_DIR.mkdir(parents=True, exist_ok=True)
MODEL_DIR.mkdir(parents=True, exist_ok=True)


def main():

    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {DATA_PATH}"
        )

    print("Loading Give Me Some Credit dataset...")

    df = pd.read_csv(DATA_PATH)

    if TARGET not in df.columns:
        raise ValueError(f"Target column missing: {TARGET}")

    df = df.dropna(subset=[TARGET])

    X = df.drop(columns=EXCLUDED, errors="ignore")
    y = df[TARGET].astype("int8")

    print("\n========== DATASET INFORMATION ==========")
    print("Rows:", len(df))
    print("Features:", X.shape[1])
    print("Target distribution:")
    print(y.value_counts())

    # Chronological splitting is not applicable to this dataset.
    # Use a stratified split with a fixed random seed.
    from sklearn.model_selection import train_test_split

    X_train, X_validation, y_train, y_validation = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    numeric_columns = X_train.select_dtypes(
        include=["number"]
    ).columns.tolist()

    categorical_columns = [
        col for col in X_train.columns
        if col not in numeric_columns
    ]

    constant_columns = [
        col for col in X_train.columns
        if X_train[col].nunique(dropna=False) <= 1
    ]

    numeric_columns = [
        col for col in numeric_columns
        if col not in constant_columns
    ]

    categorical_columns = [
        col for col in categorical_columns
        if col not in constant_columns
    ]

    X_train = X_train[numeric_columns + categorical_columns]
    X_validation = X_validation[numeric_columns + categorical_columns]

    print("\n========== FEATURE CONFIGURATION ==========")
    print("Numerical features:", len(numeric_columns))
    print("Categorical features:", len(categorical_columns))
    print("Constant features removed:", constant_columns)

    numeric_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
    ])

    categorical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OrdinalEncoder(
            handle_unknown="use_encoded_value",
            unknown_value=-1,
        )),
    ])

    preprocessor = ColumnTransformer([
        ("numeric", numeric_pipeline, numeric_columns),
        ("categorical", categorical_pipeline, categorical_columns),
    ])

    model = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(
            n_estimators=100,
            max_depth=16,
            min_samples_leaf=2,
            class_weight="balanced_subsample",
            random_state=42,
            n_jobs=-1,
        )),
    ])

    print("\nTraining Credit Risk Random Forest...")
    model.fit(X_train, y_train)

    print("Generating validation predictions...")

    predictions = model.predict(X_validation)

    probabilities = model.predict_proba(X_validation)[
        :, list(model.classes_).index(1)
    ]

    cm = confusion_matrix(
        y_validation,
        predictions,
        labels=[0, 1],
    )

    tn, fp, fn, tp = cm.ravel()

    metrics = {
        "model_name": "Random Forest",
        "dataset": "Give Me Some Credit",
        "split_strategy": "Stratified 80/20",
        "training_rows": int(len(X_train)),
        "validation_rows": int(len(X_validation)),
        "features_after_removal": len(numeric_columns) + len(categorical_columns),
        "constant_features_removed": constant_columns,
        "accuracy": float((predictions == y_validation).mean()),
        "precision_positive": float(
            precision_score(y_validation, predictions, zero_division=0)
        ),
        "recall_positive": float(
            recall_score(y_validation, predictions, zero_division=0)
        ),
        "f1_positive": float(
            f1_score(y_validation, predictions, zero_division=0)
        ),
        "roc_auc": float(roc_auc_score(y_validation, probabilities)),
        "pr_auc": float(average_precision_score(y_validation, probabilities)),
        "true_negatives": int(tn),
        "false_positives": int(fp),
        "false_negatives": int(fn),
        "true_positives": int(tp),
    }

    print("\n========== VALIDATION RESULTS ==========")
    print(classification_report(
        y_validation,
        predictions,
        labels=[0, 1],
        target_names=["No Serious Delinquency", "Serious Delinquency"],
        zero_division=0,
    ))

    print("Confusion Matrix:")
    print(cm)

    print("\nROC-AUC:", metrics["roc_auc"])
    print("PR-AUC:", metrics["pr_auc"])

    joblib.dump(model, MODEL_PATH)

    METRICS_PATH.write_text(
        json.dumps(metrics, indent=2),
        encoding="utf-8",
    )

    print("\nModel saved:", MODEL_PATH)
    print("Metrics saved:", METRICS_PATH)

    del X_train, X_validation, y_train, y_validation
    gc.collect()


if __name__ == "__main__":
    main()
