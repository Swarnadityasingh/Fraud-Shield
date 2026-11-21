# Weighted IEEE-CIS provenance findings

## Evidence and scope

Inspected current and preserved source, existing model metadata and current Parquet ID/time columns. Loaded existing artifacts without fitting, predicting or importing the application. No original evaluation script was executed. Script line numbers refer to the current repository versions inspected on 18 November 2026.

| Finding | Evidence | Strength |
|---|---|---|
| Original weighted model is versioned and unchanged from HEAD | SHA-256 `c3fbdd379bc809462f03fa6baa7255d5bcaa337c9983dceb1252e957abac6059`; compared with `git show HEAD:Backend/app/models/ieee_cis_model.joblib` | Direct artifact identity |
| Relevant Git commit | `ecc09a9f96f0d8e0d45eaed79c6c586240ec17d1`, 2026-11-09 06:31:18 +0530 | Version provenance, not fit log |
| Original training inputs | `Backend/training/train_ieee_cis.py`: train/validation paths; training-derived constants at lines 87–99; X_train/X_validation at 108–112 | Direct procedural evidence |
| Original fit boundary | Same script, `model.fit(X_train, y_train)` at 147; validation predictions afterward | Training-only fit in code |
| Original preprocessing | Median numeric imputation, most-frequent categorical imputation, ordinal unknown category -1, fitted inside pipeline | Direct procedural evidence |
| Research weighted candidate | `Backend/training/evaluate_research.py:91` uses `model = base` | Existing fit reused, no symmetric refit |
| Research unweighted candidate | `evaluate_research.py:93` clones base, sets weight=None and n_jobs=4, fits on training arrays | Direct procedural evidence |
| Research preprocessing | `fraud_arrays`, lines 25–48, only transforms using the loaded preprocessor | No new fraud preprocessor fit |
| Stored preprocessing state | Same feature order and `joblib.hash` `b02953abb4a8db12cf7ffc37baae54e5` for original and selected fraud preprocessors | Direct state-equivalence check; not a SHA-256 file digest |
| Stored training dimensions | Both forests: `_n_samples=413378`, `_n_samples_bootstrap=413378`, `n_features_in_=431` | Same recorded dimensions, not row-ID identity |
| Parameter differences | Only class_weight (`balanced_subsample`, None) and n_jobs (-1, 4) differ in complete estimator parameter dictionaries | Direct metadata comparison |
| V107 exclusion | One unique value in current training V107, with missingness included in the uniqueness check | Independent narrow data check |

## Chronological split verification

`create_temporal_splits.py:22–34` sorts by TransactionDT and TransactionID, then slices at `int(N*0.70)` and `int(N*0.85)`. The strict boundary check at lines 51–53 rejects touching/overlapping timestamp ranges. The independent read-only inspection sorted just the merged ID/time columns and compared source-ID sequences against each current saved partition. All matched exactly.

| Saved partition | Rows | Minimum TransactionDT | Maximum TransactionDT | ID sequence matches prescribed merged slice |
|---|---:|---:|---:|---|
| Training | 413,378 | 86,400 | 10,437,996 | Yes |
| Validation | 88,581 | 10,438,003 | 13,151,840 | Yes |
| Holdout | 88,581 | 13,151,880 | 15,811,131 | Yes |

These are dataset-relative offsets, not calendar timestamps. Every partition has unique IDs. The earlier demonstration-preparation check also established disjoint ID sets. This review verifies partition membership/order against the merged file, not equality of every feature value across the entire merged/split dataset or external official-file authenticity.

## Fitting differences and their interpretation

The original weighted fit goes through Pipeline.fit on a DataFrame. The selected unweighted fit receives a transformed float32 memmap produced in batches of 4096 by the research evaluator. It inherits the original estimator parameters through cloning and changes class weighting and worker count. The original weighted classifier has no project `decision_threshold_`; that selected threshold is added to the exported selected pipeline. The comparison applies validation-selected thresholds externally for each candidate.

The current [RandomForestClassifier documentation](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html) documents float32 conversion for fit inputs. Thus the explicit float32 memmap is not, by itself, proof of a materially different training representation. Nevertheless, the container/dtype path and reuse/refit asymmetry should be disclosed. Exact numerical training equivalence and historical library behavior have not been experimentally demonstrated here.

Both first trees have 261,113 distinct bootstrap-root samples; their weighted root sample totals differ in floating-point accumulation as expected for weighting. These values are corroborative only: neither reconstructs the original source IDs or proves the training labels were identical.

## What can and cannot be concluded

**Established:** current script boundaries are training-only; present split membership follows the specified chronology; stored preprocessing state and feature order match; fit dimensions and predictive hyperparameters agree except weighting. The original artifact matches Git HEAD and is the input the current research code names.

**Supported but not historically proven:** weighted and unweighted fits used the exact same historical rows/labels and raw training version. Artifacts do not bind a dataset hash or row-ID manifest, and no contemporaneous fit log was established by this review. Same counts, seeds and preprocessing do not logically prove row identity.

**Not performed:** preprocessing refitting, training, metric recomputation, held-out inference, original-script execution or regeneration of plots/JSON. There is no evidence in the inspected code of validation/holdout fitting of the fraud preprocessor, but historical absence of leakage cannot be certified from source alone.

## Proposed wording for v2, not yet applied

“The weighted IEEE-CIS reference was reused from the versioned fitted pipeline. The unweighted comparator was fitted on transformed training data using that pipeline's fitted preprocessor. Artifact inspection confirmed identical preprocessing state, feature order and recorded training sample counts, with estimator parameters differing in class weighting and parallelism. Read-only checks verified that current saved partitions follow the prescribed chronological row slices. Because historical fit-time row identifiers and dataset hashes were not stored with the original forest, exact historical sample identity remains a provenance limitation.”
