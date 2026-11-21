# Manuscript V2 Evidence Crosswalk

## Scope and namespaces

This crosswalk accompanies `manuscript-v2.md`. E01–E22 retain the consolidated study's evidence namespace. Numeric references [1]–[17] are the V2 bibliography only; they do not reuse the old V1 E1–E12 or consolidated R numbering. L identifiers below refer to the existing expanded literature matrix. Paths in the source register are repository-relative, except the explicitly identified preservation package.

Evidence status distinguishes inspected implementation, saved experimental evaluation, previously documented verification, pending evidence and future work. The present drafting/validation task transcribes and checks existing evidence; it does not reproduce experiments. The available `review-report.md` is used without claiming that a separately identifiable, independently authored audit was supplied.

## Section-wise major-claim mapping

| V2 section | Major claim | Exact evidence | Publication support | Status and boundary |
|---|---|---|---|---|
| Abstract; I | Two independent tasks integrated in one application | E01–E07 | [1]–[3] for background only | Implemented; no fused prediction |
| Abstract; VII | Selected model scores, thresholds and fraud ordering reversal | E09 selected/comparator CSV rows | No external publication supplies local results | Saved experiments; no new reproduction |
| II-A; Table I | Foundations, weighting scope and different credit protocols | E22 L1/L2/L5; E08 local protocol | [1], [2], [7], [8], [11] | Previously verified metadata/protocol extraction, not matched-score comparison |
| II-B; Table I | Chronological and entity-disjoint evaluation are distinct | E22 L3/L4; E08, E15 | [3], [9], [10] | External protocol context; no local entity-disjoint/adaptation result |
| II-C | PR interpretation, thresholding and calibration are separate | E08 computation; E22 L6/L7/L8 | [4]–[6], [12]–[14] | Metric definitions and literature; local calibration absent |
| II-D; III-A | Bounded project gap, not a universal novelty claim | E20, E22 and implemented/evaluated E01–E10 | [1]–[14] as actually cited in preceding review | Defensible scoped interpretation |
| III-B; Table II | Aim and O1–O7 | Approved specification Section C; E07–E11, E15–E17 | Literature motivates, not certifies completion | O1–O6 qualified saved/implementation objectives; O7 live assessment pending |
| III-C; VII; VIII | RQ1–RQ4 and answer boundaries | Approved specification Section D; E09–E11, E16, E17 | None substituted for local answers | RQ1–RQ3 descriptive; RQ4 pending |
| IV-A | Raw files, targets, counts and feature schemas | E07, E08, E13, E15 | [15], [16] identify competitions | Local evidence; dictionary wording/release authenticity pending |
| IV-B; Table III | Partition counts/class counts/prevalence | E09 both `distribution.csv` files | None | Exact stored strings; no recomputation |
| IV-B | Time ranges, sorted-slice and membership checks | E15 methodology-provenance report; E16 manifest | None | Previously verified read-only structure; not historical fit proof |
| IV-C; IX-D | Hash identity differs from official provenance/redistribution rights | E13, E14, E20, E22 | [15]–[17] | Permissions and source authenticity qualified |
| V; Figure 1 | Source-derived architecture, authentication, owner filtering and health scope | E01–E06 | None needed for implementation facts | Source implementation; architecture schematic is not a screenshot |
| VI-A; Table IV | Preprocessing, reuse/refit asymmetry, estimator settings | E07, E08, E15 | [1] foundation only | Source/artifact evidence; no fitting in V2 |
| VI-A; IX-A | Same preprocessing/feature order/sample counts do not prove historical row identity | E15, E07 | None | Prior metadata check with explicit historical limit |
| VI-B; Table VI | Threshold grid, tie rules, candidate identity and selection flags | E08 and E09 `validation_thresholds.csv`/`test_metrics.csv` | [6] contextual theory | Saved procedure/results; analyst chronology not certified |
| VI-C; Tables V/VIII | PR-AUC versus AP and legacy naming | E08, E09, E12 | [4], [5] | Existing computation; no metric redefinition |
| VI-D | Current versions versus historical environment | E18, E19; E11 for prior PostgreSQL version | None | Current snapshot/lockfile and historical audit remain separate |
| VI-D; VIII | Direct replay versus HTTP example scope | E08 replay script, E09 replay JSON, E11 API example | None | Saved direct-path replay and temporary-SQLite TestClient example; not full HTTP holdout |
| VII-A; Tables V/VII/VIII | All selected/comparator metrics and prior baseline behavior | E09 both `test_metrics.csv` files and replay JSON | [5] supports interpolation caution | Full stored strings, unchanged candidate/threshold selection |
| VII-B | Fraud reversal and credit unweighted advantage | E09 validation and final comparison rows | No causal attribution to external research | Saved descriptive result, no significance or drift diagnosis |
| VII-C; Table IX; Figure 2 | Confusion counts, sample/positive counts and task-specific errors | E09, E10 | None needed for transcribed results | Dataset labels, not institutional decisions or measured losses |
| Figures 3/4 | ROC/PR image identities and rounded AP legends | E10 original eight plots; E09 ranking rows | [4], [5] interpretation | Existing figures referenced, not regenerated |
| VII-D; Table X; Figure 5 | Leading global impurity ranks and interpretation limits | E10 both `importance.csv` files and plots | [7], [8], [10] for alternative explanation context | Global only; no SHAP/local/causal claim |
| VIII | Forms, result fields, risk bands, report generation and placeholders | E01–E06 | None | Implemented; bands unvalidated |
| VIII | Prior PostgreSQL/tests/build versus unperformed browser work | E11 saved Final-audit.md | None | Historical verification, not rerun or relabeled as live success |
| VIII | Reviewed real examples have not been submitted | E16, E17 | [17] relevant to public sharing | Prepared membership only; no fabricated scores, users, history IDs or screenshots |
| IX | Internal, statistical, external, construct and operational limitations | E06, E08–E11, E13–E20 | [2], [3], [6]–[14] where cited | Explicit limitations, not assumed solved |
| X | O8–O10 remain prospective | E20; absent local/fused/drift evidence in E04/E07/E10 | Relevant literature does not establish implementation | Future work only |
| XI | Bounded contributions/conclusion | E01–E11, E15–E20 | No acceptance/SOTA inference | Saved findings and inspected implementation; readiness not asserted |

## Source register

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

## Bibliographic reconciliation

| V2 citation | Existing verification source | Type |
|---|---|---|
| [1]–[5] | V1 literature notes and BibTeX; consolidated R1–R5 | Published journal/conference works |
| [6] | V1 literature notes; consolidated R6 | Explicitly cited arXiv preprint |
| [7] | Expanded L1; consolidated R9 | Published journal |
| [8] | Expanded L2; consolidated R11 | Published journal |
| [9] | Expanded L3 | Published journal |
| [10] | Expanded L4; consolidated R10 | Published journal |
| [11] | Expanded L5; consolidated R7 | Published journal |
| [12] | Expanded L6; consolidated R8 | Published journal |
| [13] | Expanded L7; consolidated R12 | Published journal |
| [14] | Expanded L8 | Published UAI proceedings; related preprint separately identified |
| [15]–[17] | Consolidated R13 and revision review data-permission findings | Official competition/data/rules pages, not academic experiments |

The two newer preprints L9/L10 were not needed for V2's bounded synthesis and were not added simply to inflate citation count. No newly invented DOI, author or affiliation is introduced. Dataset attribution, exact dictionary wording and permission completeness remain qualified rather than “verified” by reference formatting.

## Approved-specification coverage

| Approved section plan | V2 destination / correction coverage |
|---|---|
| 1 Abstract, A1–A4 | Abstract: saved evidence, reversal, pending live work and separate pipelines |
| 2 Introduction, I1–I3 | I: task units, bounded contribution and positive-error motivation |
| 3 Related work, LIT1–LIT4 | II and Table I: selective recent synthesis, protocol distinctions, preprint/scope labels |
| 4 Research gap, G1–G3 | III-A; IX-C: project-specific gap and separate incomplete capabilities |
| 5 Aim/objectives/RQs, O1–O3 | III-B/C and Table II; X: O1–O7 current; O8–O10 future |
| 6 Datasets, D1–D5 | IV: internal versus competition test, time checks, provenance/permission and reconstruction limits |
| 7 Architecture, SYS1–SYS3 | V and Figure 1: source-derived schematic and independent inference |
| 8 Methods, M1–M7 | VI: reuse/refit, historical rows, training boundaries, dtype/workers, thresholds, environment and replay scope |
| 9 Results, RES1–RES5 | VII: no legacy substitution, unchanged reversal, separate AP, full confusion and no significance claim |
| 10 Importance, X1–X3 | VII-D and IX-C: global impurity only, no causal semantics/shared importance scale |
| 11 Validity, V1–V4 | IX-A–D: distinct provenance/statistical/external/construct/operational threats |
| 12 Application, APP1–APP4 | VIII: actual source features, prepared-only inputs, no screenshots and demo/evaluation separation |
| 13 Conclusion, C1–C3 | X/XI: partial treatments, future O8–O10 and no readiness claim |
| 14 Supplements, SUP1–SUP4 | This crosswalk, bibliography, original image links and companion gaps/validation reports |

## Existing figure inventory

| Caption | Exact repository source | Evidence type |
|---|---|---|
| Figure 1 | Source-derived Mermaid schematic in V2, based on E01–E06 | Architecture illustration, not screenshot |
| Figure 2(a) | `Backend/reports/research/fraud/confusion_matrix.png` | Saved experimental plot |
| Figure 2(b) | `Backend/reports/research/credit/confusion_matrix.png` | Saved experimental plot |
| Figure 3(a) | `Backend/reports/research/fraud/roc.png` | Saved experimental plot |
| Figure 3(b) | `Backend/reports/research/credit/roc.png` | Saved experimental plot |
| Figure 4(a) | `Backend/reports/research/fraud/precision_recall.png` | Saved experimental plot; AP legend |
| Figure 4(b) | `Backend/reports/research/credit/precision_recall.png` | Saved experimental plot; AP legend |
| Figure 5(a) | `Backend/reports/research/fraud/feature_importance.png` | Saved global-importance plot |
| Figure 5(b) | `Backend/reports/research/credit/feature_importance.png` | Saved global-importance plot |

No pending application asset receives a completed figure number. Final venue-scale readability, true application captures and actual export/print verification remain in `remaining-publication-gaps.md`.
