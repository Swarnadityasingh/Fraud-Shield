from pathlib import Path
import pandas as pd

REPORT_DIR = Path(__file__).resolve().parents[1] / "reports"

correlation = pd.read_csv(
    REPORT_DIR / "missingness_correlation.csv",
    index_col=0
)

threshold = 0.999999

features = correlation.columns.tolist()
visited = set()
verified_groups = []
unverified_groups = []

for feature in features:
    if feature in visited:
        continue

    members = [
        other for other in features
        if other != feature
        and correlation.loc[feature, other] >= threshold
    ]

    if not members:
        continue

    group = [feature] + members
    visited.update(group)

    # Check every pair inside the group.
    submatrix = correlation.loc[group, group]

    pair_values = submatrix.values[
        ~pd.DataFrame(
            False,
            index=group,
            columns=group
        ).values
    ]

    # Exclude diagonal.
    pair_values = submatrix.values[
        ~__import__("numpy").eye(len(group), dtype=bool)
    ]

    minimum_corr = pair_values.min()

    result = {
        "representative": feature,
        "feature_count": len(group),
        "minimum_pairwise_correlation": minimum_corr,
        "features": ", ".join(group)
    }

    if minimum_corr >= threshold:
        verified_groups.append(result)
    else:
        unverified_groups.append(result)

print("\n========== GROUP VERIFICATION ==========")

print("\nVerified groups:", len(verified_groups))
for group in verified_groups:
    print(
        group["representative"],
        "| Features:", group["feature_count"],
        "| Minimum correlation:",
        group["minimum_pairwise_correlation"]
    )

print("\nUnverified groups:", len(unverified_groups))
for group in unverified_groups:
    print(group)

print("\nVerification completed.")
