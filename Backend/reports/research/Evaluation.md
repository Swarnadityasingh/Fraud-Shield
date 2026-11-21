# FraudShield evaluation

## Final holdout results

Positive class 1 denotes fraudulent transactions for IEEE-CIS and serious delinquency within two years for Give Me Some Credit. Each row below uses a model and threshold chosen on validation F1 before scoring the final holdout.

| Dataset | Test rows | Threshold | Accuracy | Precision | Recall | F1 | ROC-AUC | PR-AUC | Average precision |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| IEEE-CIS | 88,581 | 0.21 | 0.9523 | 0.3434 | 0.4067 | 0.3724 | 0.8669 | 0.4383 | 0.4383 |
| Give Me Some Credit | 22,500 | 0.23 | 0.9187 | 0.4071 | 0.4734 | 0.4377 | 0.8573 | 0.3952 | 0.3955 |

| Positive target | True negatives | False positives | False negatives | True positives |
|---|---:|---:|---:|---:|
| Transaction fraud | 83,100 | 2,398 | 1,829 | 1,254 |
| Credit delinquency | 19,959 | 1,037 | 792 | 712 |

The fraud classifier flagged 3,652 transactions, of which 1,254 were fraudulent. Credit screening flagged 1,749 borrowers, of whom 712 had the positive outcome. An always-negative prediction would achieve 96.52% accuracy on the fraud test set and 93.32% on credit, with zero positive recall in both.

## Data and split methodology

| Dataset | Partition | Rows | Negative | Positive |
|---|---|---:|---:|---:|
| IEEE-CIS | Train | 413,378 | 398,840 | 14,538 |
| IEEE-CIS | Validation | 88,581 | 85,539 | 3,042 |
| IEEE-CIS | Final test | 88,581 | 85,498 | 3,083 |
| Give Me Some Credit | Train | 105,000 | 97,982 | 7,018 |
| Give Me Some Credit | Validation | 22,500 | 20,996 | 1,504 |
| Give Me Some Credit | Final test | 22,500 | 20,996 | 1,504 |

IEEE-CIS contains 590,540 labeled transactions. The project joins identity attributes by TransactionID, orders transactions by TransactionDT and TransactionID, and reserves the latest 15% for final testing. The evaluation checks chronological ordering and unique transaction IDs across all three partitions. The fitted project preprocessor uses 431 features following removal of one constant training column. The experiment reuses its training-fitted median and categorical imputers and ordinal encoder. It reuses the weighted forest trained on the chronological training partition and fits the unweighted comparison on that same partition.

Give Me Some Credit contains 150,000 labeled rows. We exclude the row identifier and target. A stratified 70/15/15 split (seed 42) preserves delinquency prevalence. Preprocessing and both forests were fitted again on the new training partition. The original credit model had an 80/20 split. The new experiment measures same-dataset generalization with a random holdout. The IEEE-CIS chronological experiment measures generalization to a later period within its dataset.

## Model selection and additional experiments

The two random forests used 100 trees, maximum depth 16, minimum leaf size 2 and seed 42. The tuned hyperparameter was class weighting. Each forest and the constant training-prior baseline received a validation threshold sweep from 0.01 through 0.99 in steps of 0.01. Selection maximized validation F1, breaking threshold ties by higher precision then higher threshold. Only the two forests competed for the selected research model. Individual model comparisons below use each model's own validation-selected threshold.

| Dataset | Weighting or baseline | Threshold | Validation F1 | Test precision | Test recall | Test F1 | Test average precision |
|---|---|---:|---:|---:|---:|---:|---:|
| Fraud | Unweighted (selected) | 0.21 | 0.4808 | 0.3434 | 0.4067 | 0.3724 | 0.4383 |
| Fraud | balanced_subsample | 0.62 | 0.4448 | 0.4942 | 0.4032 | 0.4441 | 0.4460 |
| Fraud | Constant prior | 0.03 | 0.0664 | 0.0348 | 1.0000 | 0.0673 | 0.0348 |
| Credit | Unweighted (selected) | 0.23 | 0.4506 | 0.4071 | 0.4734 | 0.4377 | 0.3955 |
| Credit | balanced_subsample | 0.54 | 0.4128 | 0.3604 | 0.4661 | 0.4065 | 0.3415 |
| Credit | Constant prior | 0.06 | 0.1253 | 0.0668 | 1.0000 | 0.1253 | 0.0668 |

Weighting improved final-test precision for fraud while producing similar recall. The selected fraud model's precision fell from 0.6221 on validation to 0.3434 on the later holdout. The data establish this drop but do not identify its cause. For credit, the unweighted forest achieved higher final-test precision and recall.

At validation thresholds 0.10 and 0.50, fraud precision rose from 0.3573 to 0.8519 while recall fell from 0.5233 to 0.2495. Credit precision rose from 0.2717 to 0.5699 while recall fell from 0.6961 to 0.1735.

The top three impurity importance features were V257, V246 and C1 for fraud, and revolving utilization, number of times 90 days late and debt ratio for credit. These are global model-level rankings. Per-case explanations and SHAP remain future work.

## Reading the metrics

Accuracy is the fraction of all predictions that are correct. Precision measures how often a flagged case is positive. Recall measures the fraction of actual positives detected. F1 is the harmonic mean of precision and recall. ROC-AUC summarizes ranking across decision thresholds. PR-AUC here uses trapezoidal integration. Average precision weights precision by successive recall increments and is exported separately. The constant-score baseline produces a single operating point, so trapezoidal interpolation can give a misleadingly high PR-AUC. Its average precision equals positive prevalence.

## Reproduction and evidence

From the Backend directory, run the following with the project Python environment. The fraud command expects the parquet files produced by the existing preparation and temporal-split scripts and their matching saved pipeline.

```powershell
python training/evaluate_research.py fraud --fraud-splits data/processed
python training/evaluate_research.py credit --credit-csv D:/FraudShield-Datasets/GiveMeSomeCredit/cs-training.csv
python training/verify_serving_holdout.py
python training/demo_workflow.py
python -m pytest tests -q
```

Each model folder contains distribution.csv, validation_thresholds.csv, test_metrics.csv, importance.csv and four PNG figures covering the confusion matrix, ROC curve, precision-recall curve and feature importance.

## Serving artifacts and parity checks

Both experiments were rerun using scikit-learn 1.9.1. The reproduced split distributions, all 297 validation operating points per dataset and all three holdout comparison rows per dataset matched the saved CSVs to a numerical tolerance of 1e-12. The exported pipelines contain the exact fitted preprocessor, selected forest and decision threshold from each rerun. The API flags a case when its full-precision positive-class score is at least the stored threshold. The separate Low, Medium and High display bands use cutoffs of 0.30 and 0.70.

| Dataset | Serving file in app/models | Threshold | SHA-256 returned as model_version |
|---|---|---:|---|
| IEEE-CIS | fraud_selected.joblib | 0.21 | d8c98d26d7458b13d79e6328c2f1ddd9c75dcdd175bc3cc12923732665f17f00 |
| Give Me Some Credit | credit_selected.joblib | 0.23 | 607e7f0ba9ecfefa342ea25311c2e021123e5727d2459964fc45b0cf4778c90c |

To stage another export, append `--export PATH` to the evaluation command and set `--output` to a new evidence directory. Compare its CSVs and example predictions before replacing either serving file. The original weighted artifacts remain inputs to the reproducible comparison.

The API regression tests submit the repository examples and a credit example with one 90-day delinquency. They compare full-precision probabilities, cutoffs and persisted labels against fixed values from the offline pipelines. The fraud example (0.227907) and modified credit example (0.310205) exercise positive decisions below 0.50. The original credit example (0.041553) exercises a negative decision. API workflow evidence uses a temporary SQLite database, password login, bearer authentication and the repository's example input records. These examples contribute no observations to the evaluation.

The frozen-artifact replay in [serving_holdout.json](serving_holdout.json) verifies the exported pipelines on every raw holdout record. IEEE-CIS contributed 88,581 records and Give Me Some Credit contributed 22,500. Confusion counts matched exactly. All reported metrics matched the archived selected rows to an absolute tolerance of 1e-12. The fraud API uses the training-fitted IEEE-CIS ColumnTransformer and unweighted 100-tree forest. The credit API uses the preprocessor fitted on its stratified 105,000-row training partition and a separate unweighted 100-tree forest. The two original weighted forests used the sklearn classification default. The earlier credit forest was fitted on the older 80/20 split.

The service accumulates tree scores in a fixed order by setting n_jobs=1 after loading each artifact. During verification, changing the parallel summation order moved individual probabilities by up to 2.22e-16 and reordered tied scores in the fraud ranking. Fixed-order replay reproduced the archived ranking metrics across batch sizes. The original model weights, split assignments and validation thresholds were retained. The HTTP regression covers three known input records, while full-holdout evidence exercises the pipelines directly. Historical prediction rows store their score, class and risk band. Their schema does not record the model version or threshold.
