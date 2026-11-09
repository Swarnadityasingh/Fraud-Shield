from pathlib import Path
import pandas as pd

DATA_DIR = Path(r"D:\FraudShield-Datasets\IEEE-CIS")
REPORT_DIR = Path(__file__).resolve().parents[1] / "reports"

FILE = DATA_DIR / "train_transaction.csv"
REPORT_DIR.mkdir(parents=True, exist_ok=True)

CHUNK_SIZE = 50_000

missing_counts = None
total_rows = 0

print("Starting feature-level missing value analysis...")

for chunk_number, chunk in enumerate(
    pd.read_csv(FILE, chunksize=CHUNK_SIZE),
    start=1
):
    if missing_counts is None:
        missing_counts = chunk.isna().sum()
    else:
        missing_counts += chunk.isna().sum()

    total_rows += len(chunk)
    print(f"Processed chunk {chunk_number}: {total_rows:,} rows")

report = pd.DataFrame({
    "missing_count": missing_counts,
    "missing_percentage": (
        missing_counts / total_rows * 100
    )
})

report = report.sort_values(
    "missing_percentage",
    ascending=False
)

output_file = REPORT_DIR / "ieee_missing_values.csv"
report.to_csv(output_file)

print("\n========== MISSING VALUE SUMMARY ==========")
print("Total rows:", total_rows)
print("Total columns:", len(report))
print("Columns with missing values:", (report["missing_count"] > 0).sum())
print("Columns with no missing values:", (report["missing_count"] == 0).sum())
print("100% missing columns:", (report["missing_percentage"] == 100).sum())
print("Above 90% missing:", (report["missing_percentage"] > 90).sum())
print("Above 70% missing:", (report["missing_percentage"] > 70).sum())

print("\n--- TOP 30 COLUMNS BY MISSINGNESS ---")
print(report.head(30).to_string())

print(f"\nFull report saved at: {output_file}")
