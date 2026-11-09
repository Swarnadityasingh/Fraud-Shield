from pathlib import Path
import pandas as pd

DATA_DIR = Path(r"D:\FraudShield-Datasets\IEEE-CIS")
FILE = DATA_DIR / "train_transaction.csv"

columns = [
    "TransactionID",
    "TransactionDT",
    "TransactionAmt",
    "isFraud",
    "ProductCD",
]

df = pd.read_csv(FILE, usecols=columns)

print("\n========== DATA QUALITY REPORT ==========")

print("\nTotal transactions:", len(df))

print("\n--- TARGET DISTRIBUTION ---")
print(df["isFraud"].value_counts(dropna=False))
print("Fraud percentage:", round(df["isFraud"].mean() * 100, 2))

print("\n--- TRANSACTION AMOUNT ---")
print("Missing:", df["TransactionAmt"].isna().sum())
print("Zero:", (df["TransactionAmt"] == 0).sum())
print("Negative:", (df["TransactionAmt"] < 0).sum())
print("Minimum:", df["TransactionAmt"].min())
print("Maximum:", df["TransactionAmt"].max())
print("Median:", df["TransactionAmt"].median())

print("\n--- TRANSACTION TIME ---")
print("Missing:", df["TransactionDT"].isna().sum())
print("Negative:", (df["TransactionDT"] < 0).sum())
print("Minimum:", df["TransactionDT"].min())
print("Maximum:", df["TransactionDT"].max())

print("\n--- PRODUCT CATEGORIES ---")
print(df["ProductCD"].value_counts(dropna=False))

print("\n--- TARGET LABEL CHECK ---")
print("Unique labels:", df["isFraud"].dropna().unique())
print("Invalid labels:", (~df["isFraud"].isin([0, 1])).sum())

print("\n========== VALIDATION COMPLETE ==========")
