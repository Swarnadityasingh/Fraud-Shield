from pathlib import Path
import pandas as pd

BACKEND_DIR = Path(__file__).resolve().parents[1]

INPUT_FILE = (
    BACKEND_DIR
    / "data"
    / "processed"
    / "ieee_cis_train_merged.parquet"
)

OUTPUT_DIR = BACKEND_DIR / "data" / "processed"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("Loading merged dataset...")

df = pd.read_parquet(INPUT_FILE)

print("Sorting transactions chronologically...")

df = df.sort_values(
    ["TransactionDT", "TransactionID"]
).reset_index(drop=True)

total_rows = len(df)

train_end = int(total_rows * 0.70)
validation_end = int(total_rows * 0.85)

splits = {
    "train": df.iloc[:train_end].copy(),
    "validation": df.iloc[train_end:validation_end].copy(),
    "holdout": df.iloc[validation_end:].copy()
}

print("\n========== CREATING SPLITS ==========")

previous_max_time = None

for name, part in splits.items():

    # Verify chronological ordering.
    if not part["TransactionDT"].is_monotonic_increasing:
        raise ValueError(f"{name} is not chronologically sorted.")

    current_min = part["TransactionDT"].min()
    current_max = part["TransactionDT"].max()

    # Ensure time boundaries do not overlap.
    if previous_max_time is not None:
        if current_min <= previous_max_time:
            raise ValueError("Temporal boundary overlap detected.")

    if part["TransactionID"].duplicated().any():
        raise ValueError(f"Duplicate TransactionID in {name}.")

    output_file = OUTPUT_DIR / f"{name}.parquet"

    part.to_parquet(
        output_file,
        engine="pyarrow",
        index=False
    )

    fraud_count = int(part["isFraud"].sum())

    print(f"\n{name.upper()}")
    print("Rows:", len(part))
    print("Fraud:", fraud_count)
    print("Fraud rate:", round(part["isFraud"].mean() * 100, 3), "%")
    print("Start time:", current_min)
    print("End time:", current_max)
    print("Saved:", output_file)

    previous_max_time = current_max

# Final integrity check.
if sum(len(part) for part in splits.values()) != total_rows:
    raise ValueError("Split row counts do not match original dataset.")

print("\nAll chronological splits created successfully.")
