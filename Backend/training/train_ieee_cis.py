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

DATA_DIR = BASE_DIR / "data" / "processed"
REPORT_DIR = BASE_DIR / "reports"
MODEL_DIR = BASE_DIR / "app" / "models"

TRAIN_PATH = DATA_DIR / "train.parquet"
VALIDATION_PATH = DATA_DIR / "validation.parquet"

MODEL_PATH = MODEL_DIR / "ieee_cis_model.joblib"
METRICS_PATH = REPORT_DIR / "ieee_cis_metrics.json"

TARGET = "isFraud"
EXCLUDED = ["TransactionID", TARGET]

REPORT_DIR.mkdir(parents=True, exist_ok=True)
MODEL_DIR.mkdir(parents=True, exist_ok=True)


def load_dataset(path):
    print(f"Loading: {path.name}")

    df = pd.read_parquet(path)

    if TARGET not in df.columns:
        raise ValueError(f"Target column missing: {TARGET}")

    if df[TARGET].isna().any():
        raise ValueError("Target contains missing values.")

    return df


def main():

    if not TRAIN_PATH.exists() or not VALIDATION_PATH.exists():
        raise FileNotFoundError("Train or validation parquet file missing.")

    train_df = load_dataset(TRAIN_PATH)
    validation_df = load_dataset(VALIDATION_PATH)

    feature_columns = [
        col for col in train_df.columns
        if col not in EXCLUDED
    ]

    if set(feature_columns) != set(
        col for col in validation_df.columns
        if col not in EXCLUDED
    ):
        raise ValueError("Train and validation feature schemas do not match.")

    numeric_columns = train_df[feature_columns].select_dtypes(
        include=["number"]
    ).columns.tolist()

    categorical_columns = [
        col for col in feature_columns
        if col not in numeric_columns
    ]

    # Constant feature removal based only on training data.
    constant_columns = [
        col for col in feature_columns
        if train_df[col].nunique(dropna=False) <= 1
    ]

    numeric_columns = [
        col for col in numeric_columns
        if col not in constant_columns
    ]

    categorical_columns = [
        col for col in categorical_columns
        if col not in constant_columns
    ]

    print("\n========== FEATURE CONFIGURATION ==========")
    print("Total features:", len(feature_columns))
    print("Numeric features:", len(numeric_columns))
    print("Categorical features:", len(categorical_columns))
    print("Constant features removed:", constant_columns)

    X_train = train_df[numeric_columns + categorical_columns]
    y_train = train_df[TARGET].astype("int8")

    X_validation = validation_df[numeric_columns + categorical_columns]
    y_validation = validation_df[TARGET].astype("int8")

    del train_df, validation_df
    gc.collect()

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

    print("\nTraining IEEE-CIS Random Forest...")
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
        "dataset": "IEEE-CIS",
        "split_strategy": "Chronological 70/15/15",
        "training_rows": int(len(X_train)),
        "validation_rows": int(len(X_validation)),
        "features_before_removal": len(feature_columns),
        "features_after_removal": len(numeric_columns) + len(categorical_columns),
        "constant_features_removed": constant_columns,
        "accuracy": float((predictions == y_validation).mean()),
        "precision_fraud": float(
            precision_score(y_validation, predictions, zero_division=0)
        ),
        "recall_fraud": float(
            recall_score(y_validation, predictions, zero_division=0)
        ),
        "f1_fraud": float(
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
        target_names=["Legitimate", "Fraud"],
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


if __name__ == "__main__":
    main()
