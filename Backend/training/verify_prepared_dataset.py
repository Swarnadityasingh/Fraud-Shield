from pathlib import Path
import pandas as pd

BACKEND_DIR = Path(__file__).resolve().parents[1]

FILE = (
    BACKEND_DIR
    / "data"
    / "processed"
    / "ieee_cis_train_merged.parquet"
)

print("\n========== PARQUET INTEGRITY CHECK ==========")

df = pd.read_parquet(FILE, engine="pyarrow")

print("Rows:", len(df))
print("Columns:", len(df.columns))

print("\n--- TARGET DISTRIBUTION ---")
print(df["isFraud"].value_counts())

print("\n--- ID CHECK ---")
print("TransactionID unique:", df["TransactionID"].is_unique)
print("TransactionID missing:", df["TransactionID"].isna().sum())

print("\n--- IDENTITY CHECK ---")
print("id_01 present:", "id_01" in df.columns)
print("DeviceType present:", "DeviceType" in df.columns)
print("DeviceInfo present:", "DeviceInfo" in df.columns)

print("\n--- IDENTITY COVERAGE ---")
identity_available = df["id_01"].notna().sum()

print("Identity records available:", identity_available)
print(
    "Identity coverage:",
    round(identity_available / len(df) * 100, 2),
    "%"
)

print("\n--- DATASET SIZE ---")
print(
    "File size:",
    round(FILE.stat().st_size / (1024 ** 2), 2),
    "MB"
)

print("\n========== VERIFICATION COMPLETE ==========")
