from pathlib import Path
import pandas as pd

BACKEND_DIR = Path(__file__).resolve().parents[1]

FILE = (
    BACKEND_DIR
    / "data"
    / "processed"
    / "train.parquet"
)

REPORT_DIR = BACKEND_DIR / "reports"
REPORT_DIR.mkdir(parents=True, exist_ok=True)

print("Loading training dataset...")

df = pd.read_parquet(FILE)

# Exclude identifiers and target from model features.
excluded = ["TransactionID", "isFraud"]

features = df.drop(columns=excluded)

numeric_columns = features.select_dtypes(
    include=["number"]
).columns.tolist()

categorical_columns = features.select_dtypes(
    exclude=["number"]
).columns.tolist()

constant_columns = [
    col for col in features.columns
    if features[col].nunique(dropna=False) <= 1
]

high_cardinality = [
    col for col in categorical_columns
    if features[col].nunique(dropna=True) > 100
]

inventory = pd.DataFrame({
    "column": features.columns,
    "dtype": features.dtypes.astype(str).values,
    "unique_values": [
        features[col].nunique(dropna=True)
        for col in features.columns
    ],
    "missing_percentage": [
        features[col].isna().mean() * 100
        for col in features.columns
    ]
})

output = REPORT_DIR / "feature_inventory.csv"
inventory.to_csv(output, index=False)

print("\n========== FEATURE INVENTORY ==========")
print("Total model features:", features.shape[1])
print("Numerical features:", len(numeric_columns))
print("Categorical features:", len(categorical_columns))
print("Constant features:", len(constant_columns))
print("High-cardinality categorical features:", len(high_cardinality))

print("\n--- CONSTANT FEATURES ---")
print(constant_columns)

print("\n--- HIGH-CARDINALITY CATEGORICAL FEATURES ---")
print(high_cardinality)

print("\n--- NUMERICAL EXAMPLES ---")
print(numeric_columns[:20])

print("\n--- CATEGORICAL EXAMPLES ---")
print(categorical_columns[:20])

print("\nFull inventory saved:", output)
