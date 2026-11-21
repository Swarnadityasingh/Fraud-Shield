# Manuscript evidence map

Baseline: `C:/Users/Arpit Srivastava/FraudShield-Backups/2026-11-18_205620_IST`.
Paths below are relative to that package. The baseline `preservation/inventory.json` supplies original SHA-256 hashes. Evidence identifiers are editorial provenance markers, not academic citations, and should be moved to supplementary material in a submission version.

| ID | Authoritative evidence | Manuscript claims |
|---|---|---|
| E1 | `repository/Backend/reports/research/fraud/distribution.csv`; `credit/distribution.csv` in the same research directory | All partition sizes, positive/negative counts and prevalences; Table I |
| E2 | `repository/Backend/training/evaluate_research.py` | Research split algorithm, threshold grid, candidate selection, baseline and metric definitions |
| E3 | `repository/Backend/training/prepare_fraud_dataset.py`; `create_temporal_splits.py`; `train_ieee_cis.py` in the same training directory | Left join, exclusions, chronological ordering, imputers and encoder; original weighted fraud provenance |
| E4 | `repository/Backend/app/models/fraud_selected.joblib`; `credit_selected.joblib` in the same models directory | 431/10 inputs, 400/31 fraud numeric/categorical treatment, 100 trees, depth 16, minimum leaf 2, seed 42, Gini, bootstrap, sqrt and selected thresholds |
| E5 | `repository/Backend/reports/research/fraud/validation_thresholds.csv`; `credit/validation_thresholds.csv` | Validation F1, precision and threshold values; 297 operating points per dataset; Table IV validation columns |
| E6 | `repository/Backend/reports/research/serving_holdout.json`; `repository/Backend/training/verify_serving_holdout.py` | Saved full-holdout pipeline replay, hashes and scope; not full-holdout HTTP verification |
| E7 | `repository/Backend/reports/research/api_workflow.json`; `repository/Backend/training/demo_workflow.py` | Recorded example workflow explicitly using temporary SQLite and in-process TestClient |
| E8 | `repository/Backend/reports/research/fraud/test_metrics.csv`; `credit/test_metrics.csv` | All final holdout metrics, confusion counts, candidate comparisons and selected flags; Tables II–IV |
| E9 | Both dataset folders' `importance.csv`, `feature_importance.png`, `confusion_matrix.png`, `roc.png`, `precision_recall.png` under `repository/Backend/reports/research` | Global impurity ranks and existing Figures 1–4 |
| E10 | `repository/Backend/app/main.py`, `database_models.py`, `auth.py`, `security.py`; `repository/Frontend/src/Dashboard.jsx`, `pages/PredictionForm.jsx`, `pages/HistoryReport.jsx`, `services/reports.js` | Implemented inference, authorization, persistence, response fields, risk bands, forms, reports and history schema |
| E11 | `repository/Backend/reports/research/Final-audit.md` | Prior reported PostgreSQL/test outcomes and blocked browser phase; not rerun in manuscript preparation |
| E12 | `public_datasets/IEEE-CIS/train_transaction.csv`, `train_identity.csv`; `public_datasets/GiveMeSomeCredit/cs-training.csv`, `Data Dictionary.xls`; `repository/Backend/reports/dataset_audit.json` | Public source data, targets and schemas; source attribution/terms and exact dictionary wording require final checks |

## Legacy boundary

`repository/Backend/reports/ieee_cis_metrics.json` describes original fraud validation, `credit_risk_metrics.json` describes the old credit 80/20 validation, and `metrics.json` describes the older transactions prototype. `repository/Performance graph.jpeg` and the root report confusion matrix are legacy graphics. None supplies final holdout manuscript values.

## Verification performed for this draft

In Phase 2, selected artifacts, original model files, all 20 research evidence files and the evaluation/replay scripts matched both preserved inventory hashes and current counterparts. The new selection helper additionally verifies hashes of its dataset, partition and selected-model inputs against that inventory. It does not fit or score models. Reading saved metric values and selecting maximum validation rows does not independently reproduce the experiments.

## Supported inference and prohibited overstatement

- Higher holdout F1 than the prior baseline: supported descriptively by saved rows; no significance claim.
- Validation-selected unweighted fraud forest is best on holdout: contradicted by the saved comparison.
- IEEE-CIS generalizes to a later internal period: protocol intent; not external validity or proven concept-drift diagnosis.
- Probabilities calibrated, risk bands validated, SHAP explanations, production readiness or SOTA: not established.
- Unified Risk is a learned fusion model: not implemented in the inspected wiring.
- Four future UI examples estimate generalization performance: invalid interpretation; they are demonstrations.
