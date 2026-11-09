from pathlib import Path
import pandas as pd

REPORT_DIR = Path(__file__).resolve().parents[1] / "reports"

CORRELATION_FILE = REPORT_DIR / "missingness_correlation.csv"
CLASS_FILE = REPORT_DIR / "missingness_by_fraud_class.csv"

correlation = pd.read_csv(CORRELATION_FILE, index_col=0)
class_report = pd.read_csv(CLASS_FILE, index_col=0)

threshold = 0.999999
features = correlation.columns.tolist()

visited = set()
groups = []

for feature in features:
    if feature in visited:
        continue

    members = [
        other for other in features
        if other != feature
        and correlation.loc[feature, other] >= threshold
    ]

    if members:
        group = [feature] + members
        visited.update(group)
        groups.append(group)

rows = []

for index, group in enumerate(groups, start=1):
    representative = group[0]

    rows.append({
        "group": index,
        "representative": representative,
        "feature_count": len(group),
        "features": ", ".join(group),
        "fraud_missing_pct":
            class_report.loc[representative, "fraud_missing_pct"],
        "legitimate_missing_pct":
            class_report.loc[representative, "legitimate_missing_pct"],
        "difference_percentage_points":
            class_report.loc[
                representative,
                "difference_percentage_points"
            ]
    })

summary = pd.DataFrame(rows)

summary = summary.sort_values(
    "difference_percentage_points",
    key=lambda x: x.abs(),
    ascending=False
)

output = REPORT_DIR / "missingness_group_summary.csv"
summary.to_csv(output, index=False)

print("\n========== GROUP SUMMARY ==========")
print(summary.to_string(index=False))

print("\nTotal groups:", len(summary))
print("Saved:", output)
