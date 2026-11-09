from pathlib import Path
import pandas as pd

DATA_DIR = Path(r"D:\FraudShield-Datasets\IEEE-CIS")
REPORT_DIR = Path(__file__).resolve().parents[1] / "reports"

FILE = DATA_DIR / "train_transaction.csv"
CHUNK_SIZE = 50_000

missing_fraud = None
missing_legitimate = None

fraud_rows = 0
legitimate_rows = 0

print("Analyzing feature missingness by fraud class...")

for chunk_number, chunk in enumerate(
    pd.read_csv(FILE, chunksize=CHUNK_SIZE),
    start=1
):
    fraud_mask = chunk["isFraud"].eq(1)
    legitimate_mask = chunk["isFraud"].eq(0)

    fraud_missing = chunk.loc[fraud_mask].isna().sum()
    legitimate_missing = chunk.loc[legitimate_mask].isna().sum()

    if missing_fraud is None:
        missing_fraud = fraud_missing
        missing_legitimate = legitimate_missing
    else:
        missing_fraud += fraud_missing
        missing_legitimate += legitimate_missing

    fraud_rows += int(fraud_mask.sum())
    legitimate_rows += int(legitimate_mask.sum())

    print(f"Processed chunk {chunk_number}")

fraud_rate = missing_fraud / fraud_rows * 100
legitimate_rate = missing_legitimate / legitimate_rows * 100

report = pd.DataFrame({
    "fraud_missing_pct": fraud_rate,
    "legitimate_missing_pct": legitimate_rate,
})

report["difference_percentage_points"] = (
    report["fraud_missing_pct"]
    - report["legitimate_missing_pct"]
)

report = report.drop(index="isFraud", errors="ignore")

report["absolute_difference"] = (
    report["difference_percentage_points"].abs()
)

report = report.sort_values(
    "absolute_difference",
    ascending=False
)

REPORT_DIR.mkdir(parents=True, exist_ok=True)

output_file = REPORT_DIR / "missingness_by_fraud_class.csv"
report.to_csv(output_file)

print("\n========== CLASS-WISE MISSINGNESS ==========")
print("Fraud rows:", fraud_rows)
print("Legitimate rows:", legitimate_rows)

print("\n--- TOP 30 FEATURES WITH DIFFERENT MISSINGNESS ---")
print(report.head(30).to_string())

print(f"\nFull report saved at: {output_file}")
