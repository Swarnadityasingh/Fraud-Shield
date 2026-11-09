from pathlib import Path
import pandas as pd

REPORT_DIR = Path(__file__).resolve().parents[1] / "reports"

FILE = REPORT_DIR / "missingness_correlation.csv"

correlation = pd.read_csv(FILE, index_col=0)

threshold = 0.999999

features = correlation.columns.tolist()
visited = set()
groups = []

for feature in features:
    if feature in visited:
        continue

    group = [
        other
        for other in features
        if other != feature
        and correlation.loc[feature, other] >= threshold
    ]

    if group:
        full_group = [feature] + group
        visited.update(full_group)
        groups.append(full_group)

print("\n========== REDUNDANT MISSINGNESS GROUPS ==========")

for index, group in enumerate(groups, start=1):
    print(f"\nGroup {index}:")
    print(", ".join(group))

print("\nTotal groups:", len(groups))

output_file = REPORT_DIR / "missingness_groups.txt"

with open(output_file, "w", encoding="utf-8") as file:
    for index, group in enumerate(groups, start=1):
        file.write(f"Group {index}: {', '.join(group)}\n")

print("\nSaved:", output_file)
