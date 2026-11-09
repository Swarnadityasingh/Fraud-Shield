from pathlib import Path
import pandas as pd

DATA_DIR = Path(r"D:\FraudShield-Datasets\IEEE-CIS")

FILES = {
    "train_transaction": "train_transaction.csv",
    "train_identity": "train_identity.csv",
    "test_transaction": "test_transaction.csv",
    "test_identity": "test_identity.csv",
}


def load_headers(filename):
    return pd.read_csv(DATA_DIR / filename, nrows=0).columns.tolist()


def normalize_identity_columns(columns):
    normalized = [
        col.replace("id-", "id_") if col.startswith("id-") else col
        for col in columns
    ]

    if len(normalized) != len(set(normalized)):
        raise ValueError("Duplicate columns detected after normalization.")

    return normalized


def inspect_identity_schema():
    train_cols = load_headers(FILES["train_identity"])
    test_cols = load_headers(FILES["test_identity"])

    normalized_test_cols = normalize_identity_columns(test_cols)

    print("\n--- IDENTITY SCHEMA CHECK ---")
    print("Train columns:", len(train_cols))
    print("Test columns:", len(test_cols))
    print("Normalized schemas match:", set(train_cols) == set(normalized_test_cols))

    print("\n--- COLUMN DIFFERENCES ---")
    print("Missing in test:", sorted(set(train_cols) - set(normalized_test_cols)))
    print("Extra in test:", sorted(set(normalized_test_cols) - set(train_cols)))


def validate_join(transaction_file, identity_file, label):
    transactions = pd.read_csv(
        DATA_DIR / transaction_file,
        usecols=["TransactionID"]
    )

    identity = pd.read_csv(
        DATA_DIR / identity_file,
        usecols=["TransactionID"]
    )

    transaction_duplicates = transactions["TransactionID"].duplicated().sum()
    identity_duplicates = identity["TransactionID"].duplicated().sum()

    matched = transactions["TransactionID"].isin(
        identity["TransactionID"]
    ).sum()

    unmatched = len(transactions) - matched

    print(f"\n--- {label} JOIN VALIDATION ---")
    print("Transaction rows:", len(transactions))
    print("Identity rows:", len(identity))
    print("Transaction duplicate IDs:", transaction_duplicates)
    print("Identity duplicate IDs:", identity_duplicates)
    print("Matched transactions:", matched)
    print("Unmatched transactions:", unmatched)
    print("Identity coverage:", f"{matched / len(transactions) * 100:.2f}%")


if __name__ == "__main__":
    inspect_identity_schema()

    validate_join(
        FILES["train_transaction"],
        FILES["train_identity"],
        "TRAIN"
    )

    validate_join(
        FILES["test_transaction"],
        FILES["test_identity"],
        "TEST"
    )
