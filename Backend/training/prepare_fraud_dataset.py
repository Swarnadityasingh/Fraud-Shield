from pathlib import Path
import pandas as pd

DATA_DIR = Path(r"D:\FraudShield-Datasets\IEEE-CIS")

BACKEND_DIR = Path(__file__).resolve().parents[1]
OUTPUT_DIR = BACKEND_DIR / "data" / "processed"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

TRAIN_TRANSACTION = DATA_DIR / "train_transaction.csv"
TRAIN_IDENTITY = DATA_DIR / "train_identity.csv"

OUTPUT_FILE = OUTPUT_DIR / "ieee_cis_train_merged.parquet"


def normalize_identity_columns(df):
    df.columns = [
        col.replace("id-", "id_") if col.startswith("id-") else col
        for col in df.columns
    ]

    if df.columns.duplicated().any():
        raise ValueError("Duplicate columns found after normalization.")

    return df


def main():

    print("\n========== FRAUDSHIELD DATA PREPARATION ==========")

    print("\n[1/4] Loading transaction dataset...")

    transactions = pd.read_csv(TRAIN_TRANSACTION)

    print("Transaction rows:", len(transactions))
    print("Transaction columns:", len(transactions.columns))

    print("\n[2/4] Loading identity dataset...")

    identity = pd.read_csv(TRAIN_IDENTITY)

    identity = normalize_identity_columns(identity)

    print("Identity rows:", len(identity))
    print("Identity columns:", len(identity.columns))

    if transactions["TransactionID"].duplicated().any():
        raise ValueError("Duplicate TransactionID in transactions.")

    if identity["TransactionID"].duplicated().any():
        raise ValueError("Duplicate TransactionID in identity.")

    if transactions["TransactionID"].isna().any():
        raise ValueError("Missing TransactionID in transactions.")

    if identity["TransactionID"].isna().any():
        raise ValueError("Missing TransactionID in identity.")

    print("\n[3/4] Performing LEFT JOIN...")

    merged = transactions.merge(
        identity,
        on="TransactionID",
        how="left",
        validate="one_to_one",
        indicator=True
    )

    matched = int((merged["_merge"] == "both").sum())
    unmatched = int((merged["_merge"] == "left_only").sum())

    merged.drop(columns=["_merge"], inplace=True)

    if len(merged) != len(transactions):
        raise ValueError("Transaction row count changed after merge.")

    if merged["TransactionID"].duplicated().any():
        raise ValueError("Duplicate TransactionID after merge.")

    if merged["isFraud"].isna().any():
        raise ValueError("Missing target labels after merge.")

    print("\n[4/4] Saving merged dataset...")

    merged.to_parquet(
        OUTPUT_FILE,
        engine="pyarrow",
        index=False
    )

    print("\n========== PREPARATION SUMMARY ==========")
    print("Original transactions:", len(transactions))
    print("Identity records:", len(identity))
    print("Matched transactions:", matched)
    print("Unmatched transactions:", unmatched)
    print("Final rows:", len(merged))
    print("Final columns:", len(merged.columns))
    print("Fraud distribution:")
    print(merged["isFraud"].value_counts())
    print("\nSaved successfully:")
    print(OUTPUT_FILE)


if __name__ == "__main__":
    main()
