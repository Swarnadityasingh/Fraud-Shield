from pathlib import Path
import pandas as pd

DATA_DIR = Path(r"D:\FraudShield-Datasets\IEEE-CIS")

files = [
    "train_transaction.csv",
    "train_identity.csv",
    "test_transaction.csv",
    "test_identity.csv",
]

for filename in files:
    file_path = DATA_DIR / filename

    columns = pd.read_csv(file_path, nrows=0).columns.tolist()

    print(f"\n{'=' * 60}")
    print(f"FILE: {filename}")
    print(f"Total columns: {len(columns)}")
    print(f"First 15 columns: {columns[:15]}")
    print(f"Last 10 columns: {columns[-10:]}")

    id_columns = [
        col for col in columns
        if col.lower().startswith(("id_", "id-"))
    ]

    print(f"Identity columns: {id_columns[:10]}")
    print(f"TransactionID present: {'TransactionID' in columns}")