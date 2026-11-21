# Figure, table and screenshot placement register

18 November 2026. This register accompanies the separately versioned IEEE supervisor-review draft. Manuscript V2.1 is the scientific source; no live application work or experimental regeneration was performed. Page numbers refer to the 13-page PDF in this directory and will change when genuine images are integrated.

## Existing figures

| Figure | Section / PDF page | Material and caption purpose | Evidence / status |
|---|---|---|---|
| 1 | V / 5 | Source-derived application architecture; separate 431-input fraud and ten-input credit pipelines share authentication, history and reports, not a predictive target | E01–E06; newly typeset schematic from the existing V2.1 Mermaid topology; not a screenshot or live test |
| 2(a), 2(b) | VII-C / 8 | Selected-model fraud and credit confusion matrices, respectively; actual rows and predicted columns; thresholds 0.21 and 0.23 | E09/E10; both original saved PNGs embedded unchanged |
| 3(a), 3(b) | VII-C / 9 | Separate fraud and credit internal-holdout ROC curves; discrimination, not calibration | E10; both original saved PNGs embedded unchanged |
| 4(a), 4(b) | VII-C / 9 | Separate fraud and credit PR curves; legends show rounded AP; Table VIII separately reports AP and trapezoidal PR-AUC | E09/E10; both original saved PNGs embedded unchanged |
| 5(a), 5(b) | VII-D / 10 | Global impurity-importance rankings for each task; no local/SHAP/causal/stability inference | E10; both original saved PNGs embedded unchanged |

The complete existing captions and qualifications are retained in the manuscript. DOCX/PDF abbreviate “Figure” to “Fig.”; text below paired images identifies (a) and (b). Original plots were neither cropped nor regenerated. The architecture raster is new presentation material only; its editable topology is `support/system-architecture.mmd`, and its image is `assets/system-architecture.png`. It depicts implemented source paths and explicitly does not certify CSV/PDF runtime outcomes.

### Original research image identities

| Exact repository-relative path | SHA-256 |
|---|---|
| `Backend\reports\research\fraud\confusion_matrix.png` | `30e24bd7742be1f58f4ab93fc713d99adee1a9609f2b9dfb6d1142315a132ce2` |
| `Backend\reports\research\fraud\roc.png` | `fa75864f73d1d22c04f1d66f9f867f3292fcb80cbb96ea3dd35b5d0a3552ae47` |
| `Backend\reports\research\fraud\precision_recall.png` | `080191ed1944af4c7c22df161c075f4d4408b5be04a6d9002be8ea8a766b6faa` |
| `Backend\reports\research\fraud\feature_importance.png` | `290519c616018857fa0c0eacce2c4320190c99c7fb7b7762ff6395f1f3a2dc4a` |
| `Backend\reports\research\credit\confusion_matrix.png` | `3ac43d111a0cb6e8f33b5f92efd776ba9598c03f305f900488c688149643528f` |
| `Backend\reports\research\credit\roc.png` | `0541b302b66b55a1b1f17cd824de25ef1487595a25ccf1a17cc4ffe24cc0160d` |
| `Backend\reports\research\credit\precision_recall.png` | `f4cb5034bfe185fd1edfc448b308d5d74af0ec8b0b58d10ad62e6edcd83b71af` |
| `Backend\reports\research\credit\feature_importance.png` | `ed447cb90b358ec232aabad9c339fc59f92317622a1d0101634b7f8c8bf91e57` |

All eight source hashes match the preservation package and the byte-identical embedded image files. No new result plot is introduced.

## Table placement and evidence

| Table | Subject | Section / page | Source |
|---|---|---|---|
| I | Literature protocol comparison | II / 2 | V2.1 Table I; E22 and renumbered references [8]–[11] |
| II | O1–O7 with evidence status | III / 3 | V2.1 Table II; O7a/b/c explanation retained |
| III | All six partition distributions | IV / 4 | E09 `fraud/distribution.csv`, `credit/distribution.csv` |
| IV | Forest configuration and reuse/refit scope | VI / 6 | E07/E08/E15; no new estimator fitting |
| V | Selected holdout metrics and thresholds | VII / 7 | E09 both `test_metrics.csv`; selected rows and replay JSON |
| VI | Candidate validation operating points | VII / 7 | E09 both `validation_thresholds.csv`; stored selected-point rows |
| VII | Candidate holdout operating-point metrics | VII / 7 | E09 both `test_metrics.csv`; all six rows and flags |
| VIII | ROC-AUC, trapezoidal PR-AUC and AP | VII / 7 | E09 both `test_metrics.csv`; three distinct stored measures |
| IX | Six candidate confusion matrices as counts | VII / 8 | E09 both `test_metrics.csv`; TN/FP/FN/TP |
| X | Top-five feature coefficients per pipeline | VII-D / 10 | E10 both `importance.csv`; exact stored strings |

Every cell is retained from V2.1, apart from the citation-number mapping in Table I. Full precision is retained in editable tables spanning both columns; no metric was rounded, recalculated or replaced. Table inputs are checked against the preserved package.

## Pending screenshot requests to Sahej

All seven textual slots appear in Section VIII-C (PDF page 11). No screenshot file is inserted and none is numbered as an existing figure. These requests do not authorize live runs. Final figure numbers/captions depend on the genuine images and actual checks. Avoid tokens, passwords, personal account details and unapproved data values; record redaction decisions without inventing content.

| Slot | Exact required view | Proposed caption | Intended evidence and acceptance condition | Status |
|---|---|---|---|---|
| S1 | Actual dashboard for an authorized account with persisted records | FraudShield dashboard showing persisted prediction summaries for an authorized account | Match owned record totals and task scope to actual persisted records; source-level inspection alone is insufficient | Pending genuine capture and reconciliation |
| S2 | Actual transaction-fraud input interface | Transaction-fraud input interface for the independent 431-feature pipeline | Use an approved public holdout payload; check source membership, excluded target/identifier and sharing permission; visibility alone does not prove inference | Pending |
| S3 | Actual ten-input credit interface | Credit-delinquency input interface for the independent ten-feature pipeline | Verify reconstructed holdout membership, complete ten-key schema, and target/source-ID exclusion | Pending |
| S4 | Actual returned result after inference and persistence | Persisted prediction result displaying the model score, classification and interface risk band | Match returned ID to an owned row; preserve real favorable/unfavorable outcomes; bands differ from classification thresholds and calibration is unmeasured | Pending |
| S5 | Actual owner-scoped prediction history | Prediction history for the authorized demonstration account | Reconcile real returned IDs/history rows; separately test cross-user isolation without exposing another person's records | Pending |
| S6 | Actual analytics/report view and stated filters | Analytics and report summaries reconciled with persisted prediction records | Match counts to owned persisted data and filter scope; do not infer a fused financial-risk model | Pending |
| S7 | Actual report filters and CSV/print controls | Report export interface after independent inspection of CSV and printed/PDF outputs | Conditional: inspect downloaded CSV bytes/rows/headers and actual saved/opened PDF first; a visible export button proves neither | Pending; omit if not verified |

For any approved future run, use the existing reviewed manifest E16/E17 and an existing authorized account. Four representative holdout examples are demonstrations, not a new evaluation sample. Capture run date, task, approved source ID, input/artifact hash, returned record ID and reconciled counts privately. Share only permission-cleared/redacted images. Google consent, email delivery, mobile responsiveness and logout/session behavior remain separately unverified by this paper. O7c/PSQ1 cannot be completed by adding an unverified image.

## Evidence-label source register

The following E01–E22 namespace is carried from the protected V2 crosswalk, not newly relabeled or newly reproduced. Repository paths are relative to the Fraud-Shield root. The old crosswalk's RQ4/current-O7 completion wording is superseded by V2.1: formal questions are RQ1–RQ3, O7a is source inspection, O7b is prior recorded-check review, O7c/PSQ1 remain pending, and O8–O10 are future objectives.

| ID | Actual source files / records |
|---|---|
| E01 | `Frontend/src/App.jsx`, `Frontend/src/Dashboard.jsx`, `Frontend/src/components/Sidebar.jsx` |
| E02 | `Frontend/src/pages/PredictionForm.jsx`, `HistoryReport.jsx`, `DashboardHome.jsx` |
| E03 | `Frontend/src/services/api.js`, `reports.js`; `Frontend/src/components/TransactionTable.jsx` |
| E04 | `Backend/app/main.py` |
| E05 | `Backend/app/auth.py`, `security.py`, `email_service.py` |
| E06 | `Backend/app/database.py`, `database_models.py`; `Backend/alembic/versions/*.py` |
| E07 | `Backend/app/models/fraud_selected.joblib`, `credit_selected.joblib`, `ieee_cis_model.joblib`, `credit_risk_model.joblib` |
| E08 | `Backend/training/prepare_fraud_dataset.py`, `create_temporal_splits.py`, `train_ieee_cis.py`, `train_credit_risk.py`, `evaluate_research.py`, `verify_serving_holdout.py` |
| E09 | `Backend/reports/research/fraud/{distribution.csv,validation_thresholds.csv,test_metrics.csv}`, corresponding `credit/` files; `Backend/reports/research/serving_holdout.json` |
| E10 | Each `Backend/reports/research/{fraud,credit}/` folder's `importance.csv`, `confusion_matrix.png`, `roc.png`, `precision_recall.png`, `feature_importance.png` |
| E11 | `Backend/reports/research/api_workflow.json`, `Final-audit.md`; `Backend/tests/test_api.py`, `test_migrations.py`; `Frontend/tests/reports.test.js` |
| E12 | `Backend/reports/ieee_cis_metrics.json`, `credit_risk_metrics.json`, `metrics.json`; legacy root `Performance graph.jpeg`, `Initial Prototype.mp4` |
| E13 | `Backend/data/processed/{ieee_cis_train_merged,train,validation,holdout}.parquet`; preserved `public_datasets/IEEE-CIS/` and `public_datasets/GiveMeSomeCredit/` source files |
| E14 | Preservation package `preservation/inventory.json`, `summary.json`, `exception-review.json`; package identifier `2026-11-18_205620_IST` |
| E15 | `research-paper/revision-review-2026-11-18/methodology-provenance.md` |
| E16 | `research-paper/2026-11-18-v1/demo-selection-manifest.json`, `prepare_demo_manifest.py`, four `demo-*.json` payloads |
| E17 | `research-paper/2026-11-18-v1/demo-execution-plan.md`, `tables-and-figures.md` |
| E18 | `Backend/requirements.txt`, `Frontend/package.json`, `Frontend/package-lock.json`, `README.md` |
| E19 | `research-paper/revision-review-2026-11-18/system-environment-evidence.json` |
| E20 | `research-paper/2026-11-18-v1/verification-register.md`; revision-review `review-report.md`, `v2-change-plan.md`, approved `manuscript-v2-revision-specification.md` |
| E21 | `research-paper/2026-11-18-v1/manuscript.md`, `evidence-map.md`, `literature-review.md`, `references.bib` |
| E22 | `research-paper/revision-review-2026-11-18/expanded-literature-matrix.md` |

Multiple filenames in a cell retain the explicitly stated parent directory. The full preservation-package path is private operational provenance, not a blanket public-data release instruction. All E09 table inputs for V2 are read from the preserved package and compared with repository copies; other claims rely on the indicated source/earlier checks with their qualifications.
