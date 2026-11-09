from pathlib import Path
import numpy as np
import pandas as pd

DATA_DIR = Path(r"D:\FraudShield-Datasets\IEEE-CIS")
REPORT_DIR = Path(__file__).resolve().parents[1] / "reports"

FILE = DATA_DIR / "train_transaction.csv"

CHUNK_SIZE = 10_000

print("Starting optimized missingness correlation analysis...")

missing_counts = None
total_rows = 0

for chunk in pd.read_csv(FILE, chunksize=CHUNK_SIZE):
    counts = chunk.isna().sum()

    if missing_counts is None:
        missing_counts = counts
    else:
        missing_counts += counts

    total_rows += len(chunk)

print("First pass completed:", total_rows, "rows")

missing_rates = missing_counts / total_rows

selected_columns = missing_rates[
    (missing_rates >= 0.10) &
    (missing_rates <= 0.95)
].index.tolist()

n_features = len(selected_columns)

print("Selected features:", n_features)

sum_x = np.zeros(n_features, dtype=np.float64)
sum_xx = np.zeros((n_features, n_features), dtype=np.float64)

processed_rows = 0

for chunk_number, chunk in enumerate(
    pd.read_csv(
        FILE,
        usecols=selected_columns,
        chunksize=CHUNK_SIZE
    ),
    start=1
):

    indicators = chunk.isna().to_numpy(dtype=np.float64)

    sum_x += indicators.sum(axis=0)
    sum_xx += indicators.T @ indicators

    processed_rows += len(indicators)

    print(
        f"Correlation pass: {processed_rows:,}/{total_rows:,}"
    )

means = sum_x / processed_rows

covariance = (
    sum_xx / processed_rows
    - np.outer(means, means)
)

variances = np.diag(covariance)
std = np.sqrt(np.maximum(variances, 0))

denominator = np.outer(std, std)

correlation = np.divide(
    covariance,
    denominator,
    out=np.zeros_like(covariance),
    where=denominator > 0
)

correlation = np.clip(correlation, -1, 1)

correlation_df = pd.DataFrame(
    correlation,
    index=selected_columns,
    columns=selected_columns
)

REPORT_DIR.mkdir(parents=True, exist_ok=True)

output_file = REPORT_DIR / "missingness_correlation.csv"
correlation_df.to_csv(output_file)

upper_indices = np.triu_indices(n_features, k=1)

pairs = pd.DataFrame({
    "feature_1": np.array(selected_columns)[upper_indices[0]],
    "feature_2": np.array(selected_columns)[upper_indices[1]],
    "correlation": correlation[upper_indices]
})

pairs["absolute_correlation"] = pairs["correlation"].abs()

pairs = pairs.sort_values(
    "absolute_correlation",
    ascending=False
)

print("\n========== CORRELATION RESULTS ==========")
print("Rows processed:", processed_rows)
print("Features analyzed:", n_features)
print("\nTop 20 correlated missingness pairs:")
print(pairs.head(20).to_string(index=False))

pairs.to_csv(
    REPORT_DIR / "missingness_correlation_pairs.csv",
    index=False
)

print("\nReports saved successfully.")
