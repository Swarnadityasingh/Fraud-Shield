from pathlib import Path
import json
import time

import pandas as pd

DATA_ROOT = Path(r"D:\FraudShield-Datasets")

IEEE_DIR = DATA_ROOT / "IEEE-CIS"
CREDIT_DIR = DATA_ROOT / "GiveMeSomeCredit"

REPORT_DIR = Path(__file__).resolve().parents[1] / "reports"
REPORT_DIR.mkdir(parents=True, exist_ok=True)

CHUNK_SIZE = 5_000

def audit_csv(file_path, target_column=None, identity_ids=None):
    file_path = Path(file_path)

    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    print(f"\nAuditing: {file_path.name}")

    start_time = time.time()

    total_rows = 0
    total_missing = {}
    target_counts = {}
    columns = None

    transaction_ids = set()
    duplicate_ids = 0
    identity_matches = 0

    reader = pd.read_csv(
        file_path,
        chunksize=CHUNK_SIZE,
        low_memory=False,
    )

    for chunk_number, chunk in enumerate(reader, start=1):

        if columns is None:
            columns = chunk.columns.tolist()
            total_missing = {col: 0 for col in columns}

        total_rows += len(chunk)

        missing = chunk.isna().sum()

        for col, count in missing.items():
            total_missing[col] += int(count)

        if target_column and target_column in chunk.columns:
            counts = chunk[target_column].value_counts(dropna=False)

            for label, count in counts.items():
                key = str(label)
                target_counts[key] = (
                    target_counts.get(key, 0) + int(count)
                )

        if "TransactionID" in chunk.columns:

            ids = chunk["TransactionID"].dropna()

            if identity_ids is not None:
                identity_matches += int(ids.isin(identity_ids).sum())

            duplicate_ids += int(ids.duplicated().sum())

            transaction_ids.update(ids.tolist())

        print(
            f"  Processed chunk {chunk_number} | "
            f"Rows: {total_rows:,}"
        )

        del chunk

    missing_summary = {
        col: {
            "count": count,
            "percentage": round(
                (count / total_rows) * 100, 2
            ) if total_rows else 0,
        }
        for col, count in total_missing.items()
    }

    top_missing = sorted(
        missing_summary.items(),
        key=lambda item: item[1]["percentage"],
        reverse=True,
    )[:20]

    elapsed = round(time.time() - start_time, 2)

    result = {
        "file": file_path.name,
        "rows": total_rows,
        "columns_count": len(columns) if columns else 0,
        "columns": columns,
        "target_distribution": target_counts,
        "missing_values_top_20": dict(top_missing),
        "duplicate_transaction_ids_within_chunks": duplicate_ids,
        "unique_transaction_ids": len(transaction_ids),
        "identity_matches": identity_matches,
        "identity_match_percentage": (
            round(identity_matches / total_rows * 100, 2)
            if identity_ids is not None and total_rows else None
        ),
        "processing_seconds": elapsed,
    }

    print(f"  Completed: {total_rows:,} rows in {elapsed}s")

    del transaction_ids

    return result

def load_identity_ids(file_path):

    print(f"\nLoading identity IDs: {file_path.name}")

    if not file_path.exists():
        raise FileNotFoundError(file_path)

    identity_df = pd.read_csv(
        file_path,
        usecols=["TransactionID"],
        dtype={"TransactionID": "int64"},
    )

    ids = set(identity_df["TransactionID"].tolist())

    print(f"  Unique identity IDs: {len(ids):,}")

    return ids

def main():

    report = {
        "project": "FraudShield",
        "chunk_size": CHUNK_SIZE,
        "datasets": {},
    }

    print("=" * 65)
    print("FRAUDSHIELD DATASET AUDIT")
    print("=" * 65)

    print("\n[1] IEEE-CIS FRAUD DETECTION")

    train_identity_path = IEEE_DIR / "train_identity.csv"
    test_identity_path = IEEE_DIR / "test_identity.csv"

    train_transaction_path = IEEE_DIR / "train_transaction.csv"
    test_transaction_path = IEEE_DIR / "test_transaction.csv"

    train_identity_ids = load_identity_ids(train_identity_path)
    test_identity_ids = load_identity_ids(test_identity_path)

    report["datasets"]["ieee_cis"] = {}

    report["datasets"]["ieee_cis"]["train_transaction"] = (
        audit_csv(
            train_transaction_path,
            target_column="isFraud",
            identity_ids=train_identity_ids,
        )
    )

    report["datasets"]["ieee_cis"]["test_transaction"] = (
        audit_csv(
            test_transaction_path,
            identity_ids=test_identity_ids,
        )
    )

    report["datasets"]["ieee_cis"]["train_identity"] = (
        audit_csv(train_identity_path)
    )

    report["datasets"]["ieee_cis"]["test_identity"] = (
        audit_csv(test_identity_path)
    )

    del train_identity_ids
    del test_identity_ids

    print("\n[2] GIVE ME SOME CREDIT")

    credit_path = CREDIT_DIR / "cs-training.csv"

    report["datasets"]["give_me_some_credit"] = audit_csv(
        credit_path,
        target_column="SeriousDlqin2yrs",
    )

    output_path = REPORT_DIR / "dataset_audit.json"

    output_path.write_text(
        json.dumps(report, indent=2),
        encoding="utf-8",
    )

    print("\n" + "=" * 65)
    print("AUDIT COMPLETED")
    print(f"Report saved at: {output_path}")
    print("=" * 65)


if __name__ == "__main__":
    main()
