from pathlib import Path
import pandas as pd

BACKEND_DIR = Path(__file__).resolve().parents[1]

FILE = (
    BACKEND_DIR
    / "data"
    / "processed"
    / "ieee_cis_train_merged.parquet"
)

df = pd.read_parquet(
    FILE,
    columns=["TransactionID", "TransactionDT", "isFraud"]
)

df = df.sort_values(
    ["TransactionDT", "TransactionID"]
).reset_index(drop=True)

n = len(df)

train_end = int(n * 0.70)
validation_end = int(n * 0.85)

splits = {
    "TRAIN": df.iloc[:train_end],
    "VALIDATION": df.iloc[train_end:validation_end],
    "HOLDOUT": df.iloc[validation_end:]
}

print("\n========== TEMPORAL SPLIT ANALYSIS ==========")

for name, part in splits.items():
    fraud_count = int(part["isFraud"].sum())
    total = len(part)

    print(f"\n--- {name} ---")
    print("Rows:", total)
    print("Fraud:", fraud_count)
    print("Legitimate:", total - fraud_count)
    print("Fraud rate:", round(fraud_count / total * 100, 3), "%")
    print("Start TransactionDT:", part["TransactionDT"].min())
    print("End TransactionDT:", part["TransactionDT"].max())

print("\n========== ANALYSIS COMPLETE ==========")
