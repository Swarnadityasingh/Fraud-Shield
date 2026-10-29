
from pathlib import Path
import json

import joblib
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_PATH = BASE_DIR / "data" / "transactions.csv"
MODEL_PATH = BASE_DIR / "app" / "fraud_model.joblib"
REPORT_DIR = BASE_DIR / "reports"

REPORT_DIR.mkdir(parents=True, exist_ok=True)

if not DATA_PATH.exists():
    raise FileNotFoundError(f"Dataset not found: {DATA_PATH}")

print("Loading transaction data...")

df = pd.read_csv(
    DATA_PATH,
    usecols=["step", "type", "amount", "isFraud"],
)

df = df.dropna(subset=["step", "type", "amount", "isFraud"])
df["type"] = df["type"].astype(str)
df["isFraud"] = df["isFraud"].astype(int)

fraud = df[df["isFraud"] == 1]
legitimate = df[df["isFraud"] == 0].sample(
    n=min(200_000, (df["isFraud"] == 0).sum()),
    random_state=42,
)

data = pd.concat([fraud, legitimate], ignore_index=True)
data = data.sample(frac=1, random_state=42)

X = data[["step", "type", "amount"]]
y = data["isFraud"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

preprocessor = ColumnTransformer([
    ("type", OneHotEncoder(handle_unknown="ignore"), ["type"]),
    ("numeric", "passthrough", ["step", "amount"]),
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

print(f"Training rows: {len(X_train):,}")
print(f"Test rows: {len(X_test):,}")
print("Training model...")

model.fit(X_train, y_train)

predictions = model.predict(X_test)
probabilities = model.predict_proba(X_test)[:, list(model.classes_).index(1)]

cm = confusion_matrix(y_test, predictions, labels=[0, 1])
tn, fp, fn, tp = cm.ravel()

metrics = {
    "model_name": "Random Forest",
    "dataset": "transactions.csv",
    "sampling": "All fraud rows and up to 200000 legitimate rows",
    "test_size": 0.2,
    "random_state": 42,
    "training_rows": int(len(X_train)),
    "test_rows": int(len(X_test)),
    "test_legitimate_rows": int((y_test == 0).sum()),
    "test_fraud_rows": int((y_test == 1).sum()),
    "accuracy": float(accuracy_score(y_test, predictions)),
    "precision_fraud": float(
        precision_score(y_test, predictions, zero_division=0)
    ),
    "recall_fraud": float(
        recall_score(y_test, predictions, zero_division=0)
    ),
    "f1_fraud": float(
        f1_score(y_test, predictions, zero_division=0)
    ),
    "roc_auc": float(roc_auc_score(y_test, probabilities)),
    "pr_auc": float(average_precision_score(y_test, probabilities)),
    "true_negatives": int(tn),
    "false_positives": int(fp),
    "false_negatives": int(fn),
    "true_positives": int(tp),
    "false_positive_rate": float(fp / (fp + tn)) if (fp + tn) else 0.0,
}

print("\nEvaluation on held-out test data:")
print(classification_report(
    y_test,
    predictions,
    labels=[0, 1],
    target_names=["Legitimate", "Fraud"],
    zero_division=0,
))

print("Confusion matrix (rows=true, columns=predicted; order 0, 1):")
print(cm)

metrics_path = REPORT_DIR / "metrics.json"
metrics_path.write_text(json.dumps(metrics, indent=2), encoding="utf-8")

fig, ax = plt.subplots()
image = ax.imshow(cm)
ax.set(
    title="Fraud Detection Confusion Matrix",
    xlabel="Predicted label",
    ylabel="True label",
    xticks=[0, 1],
    xticklabels=["Legitimate", "Fraud"],
    yticks=[0, 1],
    yticklabels=["Legitimate", "Fraud"],
)

for row in range(2):
    for col in range(2):
        ax.text(col, row, f"{cm[row, col]:,}", ha="center", va="center")

fig.colorbar(image, ax=ax)
fig.tight_layout()
fig.savefig(REPORT_DIR / "confusion_matrix.png", dpi=160)
plt.close(fig)

MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
joblib.dump(model, MODEL_PATH)

print(f"\nModel saved to: {MODEL_PATH}")
print(f"Metrics saved to: {metrics_path}")
print(f"Confusion matrix saved to: {REPORT_DIR / 'confusion_matrix.png'}")
