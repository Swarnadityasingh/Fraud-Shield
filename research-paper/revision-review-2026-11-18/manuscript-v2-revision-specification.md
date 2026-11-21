# FraudShield Manuscript V2 Revision Specification

**Planning document — 18 November 2026. No manuscript revision is applied by this specification.** The target for a future approved revision is `research-paper/2026-11-18-v1/manuscript.md`; that file, the consolidated study, existing review files, application, datasets and frozen results remain unchanged.

## Basis, identifiers and claim-status rules

The principal inputs are `consolidated-research-study.md`, `review-report.md`, `methodology-provenance.md`, `expanded-literature-matrix.md`, `v2-change-plan.md` and manuscript v1. These review documents are in the current revision-review directory unless specified otherwise. The repository search found the available academic assessment `review-report.md`, but no separately identifiable external or independently authored academic quality audit. This specification uses the available assessment without asserting independent authorship. If a separate audit is supplied, its recommendations require an explicit crosswalk before they are represented as incorporated.

**Evidence namespace:** E01–E22 and R1–R13 below refer exclusively to Section 11 and Section 12 of `consolidated-research-study.md`. They are not the older, differently numbered E1–E12 markers in manuscript v1. L1–L10 refer to `expanded-literature-matrix.md`. A future v2 must use one unambiguous namespace and update every cross-reference consistently.

**Statuses:** **Implemented** denotes inspected source or artifact configuration. **Experimentally evaluated (saved)** denotes a result in frozen experimental outputs; it does not mean rerun in this revision pass. **Previously verified** denotes a documented earlier check with its scope/date. **Pending** denotes missing evidence or an incomplete check. **Future work** denotes an unimplemented or unevaluated extension. A single claim may require more than one status.

**New-evidence column:** “No” means the correction can be made from existing evidence. “Yes, before asserting” means the current draft must omit or qualify that stronger claim until evidence exists. “Separate authorization” means this plan does not approve the associated experiment or live action. An unresolved historical fact can remain a limitation; it need not be manufactured or repaired through an unauthorized rerun.

Many mandatory safeguards are already present in v1. The issues below therefore distinguish **retain/strengthen** from **correct/restructure**, rather than alleging that every forbidden claim currently appears in the manuscript.

## A. Section-by-section revision plan

### 1. Abstract

| ID | Current issue | Recommended correction / acceptance criterion | Exact evidence | New evidence required? | Claim status |
|---|---|---|---|---|---|
| A1 | The abstract mixes empirical findings, artifact checks and implementation status | State concisely that results are preserved experimental outputs, followed by the implemented application scope. Do not describe this document audit as independent reproduction | E07, E09, E11, E15 | No; independent reproduction would require separate work | Experimentally evaluated (saved); previously verified |
| A2 | The unfavorable fraud result is essential but could be lost during shortening | Retain selected fraud F1 0.372383 and weighted comparator F1 0.444087, explicitly distinguishing validation selection from holdout comparison | E09: fraud `validation_thresholds.csv` and `test_metrics.csv` | No | Experimentally evaluated (saved) |
| A3 | Application integration could be read as a completed live demonstration | Retain “live application demonstration pending” until approved evidence exists; do not report screenshots, real-user outcomes or operational reliability | E11, E16, E17 | Yes, before asserting live success; separate authorization | Implemented; pending |
| A4 | Broad terms such as unified, explainable or adaptive could overstate the title/abstract scope | Describe two independent pipelines and global feature rankings, with no fused risk, local XAI or drift adaptation claim | E02, E04, E10; R3, R9–R12 | No for accurate scope | Implemented; future work for absent extensions |

### 2. Introduction and research problem

| ID | Current issue | Recommended correction / acceptance criterion | Exact evidence | New evidence required? | Claim status |
|---|---|---|---|---|---|
| I1 | The motivation spans financial monitoring broadly, while evidence concerns two specific binary targets | Define transaction fraud and serious delinquency separately; distinguish transaction-level and borrower-level units, feature spaces and protocols | E07–E09, E13; R2, R3 | No | Implemented; experimentally evaluated (saved) |
| I2 | A standard-model implementation can be mistaken for a novel algorithm contribution | Frame the problem as transparent weighting/threshold evaluation and artifact-connected application integration; avoid an unverified universal literature gap | E08, E09, E22; R1, R2 | No; a stronger novelty assertion needs literature evidence | Experimentally evaluated (saved); implemented |
| I3 | Positive-class performance needs concrete motivation without invented financial impact | Explain why false alerts and missed positive cases matter, but do not quantify losses, review time, loan denials or business utility | E09; R3–R6 | No for qualitative interpretation; yes for measured costs | Experimentally evaluated (saved); pending for utility |

### 3. Related work and literature positioning

| ID | Current issue | Recommended correction / acceptance criterion | Exact evidence | New evidence required? | Claim status |
|---|---|---|---|---|---|
| LIT1 | V1 is mainly a foundational review | Add a selective synthesis of recent weighting, calibration, financial explanations and temporal validation using verified L1–L8. Organize by methodological question rather than one paragraph per citation | E22; R7–R12; L1–L8 | No for verified scope; deeper extraction for detailed claims | Previously verified bibliographic sources |
| LIT2 | Shared dataset names can suggest numerical comparability | Add a protocol table distinguishing NATE five-fold evaluation, Soylu et al. 60/20/20/F2/development-refit design, and this study's 70/15/15/F1 design; note temporal versus random evaluation | E08, E09; L1, L2, L3, L4 | No for extracted facts; yes before asserting matched comparisons | Previously verified external protocols; saved local evaluation |
| LIT3 | A recent preprint may be mistaken for peer-reviewed support | If L9/L10 are used, identify them as preprints. Submission to a journal is not acceptance. Retain the explicit preprint identity of Lipton et al. | E21, E22; R6; L9, L10 | No for labeling; verify any later publication before changing status | Previously verified metadata; pending later publication status |
| LIT4 | The review is targeted, not systematic, and metadata does not certify external experiments | State review scope, avoid “comprehensive systematic review,” and do not import external scores as a leaderboard. Exclude unverifiable leads | E21, E22 | No | Previously verified sources; pending broader coverage |

### 4. Research gap

| ID | Current issue | Recommended correction / acceptance criterion | Exact evidence | New evidence required? | Claim status |
|---|---|---|---|---|---|
| G1 | The four project limitations could be presented as unsolved problems across the whole field | Use the bounded gap statement in Section B. Acknowledge established literature on weighting, calibration, explanations and temporal evaluation | E20, E22; R2–R12 | No | Project limitation assessment |
| G2 | “Addressing imbalance” can become “solving imbalance” | State partial treatment through weighting comparisons, validation thresholds and positive-class metrics, with substantial remaining FN/FP | E08–E10 | No | Experimentally evaluated (saved); partially addressed |
| G3 | Explainability, fusion and drift are different gaps | Keep separate: global rankings implemented; local XAI absent; shared architecture implemented; fused modeling absent; chronological fraud evaluation present; drift detection/adaptation absent | E02, E04, E10, E15; R3, R9–R12 | No; stronger claims need separately authorized evidence | Implemented limited components; future work for extensions |

### 5. Research aim, objectives and research questions

| ID | Current issue | Recommended correction / acceptance criterion | Exact evidence | New evidence required? | Claim status |
|---|---|---|---|---|---|
| O1 | V1's contribution narrative lacks a compact aim/objective/RQ hierarchy | Adopt the aim, O1–O7 and RQ1–RQ4 in Sections C/D; explicitly map them to results or implementation | E07–E11, E15–E17; consolidated Sections 9–10 | No | Mixed: saved evaluation, implemented, pending |
| O2 | Completed procedural design can be confused with certified historical execution | Distinguish implemented validation-selection rules from unproven historical analyst non-use of holdout; distinguish source inspection from reproduction | E08, E15, E20 | No; historical certification needs surviving records | Implemented; pending historical proof |
| O3 | O8–O10 could incorrectly enter the completed research scope | Keep numbering, but place local explanation, fused score and drift adaptation explicitly in prospective objectives/future work only | E04, E10, E20; consolidated Table 12 | No to label correctly; separate authorization to pursue | Future work |

### 6. Dataset description

| ID | Current issue | Recommended correction / acceptance criterion | Exact evidence | New evidence required? | Claim status |
|---|---|---|---|---|---|
| D1 | “Test set” can refer to either competition test data or the internal labeled holdout | Use “internal holdout” consistently and name the actual labeled source files. Preserve all partition counts and target definitions | E08, E09, E13 | No | Experimentally evaluated (saved); previously checked data structure |
| D2 | V1 predates the later independent read-only partition checks | Add the verified sorted-slice ID checks and relative-time ranges; label them structural verification, not rerun performance | E15: chronology table; E08 | No | Previously verified read-only structure |
| D3 | The exact credit dictionary wording and official-release authenticity remain unresolved | Retain project target interpretation with the dictionary check explicitly pending. Describe local hashes as identity evidence, not proof of an official download | E13, E14, E20, E22 | Yes before strengthening provenance/wording claims | Pending |
| D4 | “Public dataset” can imply unrestricted sharing | Separate authorized access/use from onward redistribution; retain IEEE-CIS rule constraints and unresolved credit terms. Do not publish raw payloads or full input captures automatically | E20, E22; R13 | Yes before public redistribution; no to state uncertainty | Previously verified rule retrieval; pending permission assessment |
| D5 | Reconstructed credit membership could be described as historically proven | State that the documented seed-42 reconstruction matches source hash, disjointness and saved counts but lacks an older membership manifest for direct comparison | E08, E16 | No; historical identity needs older records if available | Previously verified reconstruction; historical equality pending |

### 7. Proposed system and architecture

| ID | Current issue | Recommended correction / acceptance criterion | Exact evidence | New evidence required? | Claim status |
|---|---|---|---|---|---|
| SYS1 | “Unified Risk” naming can imply a joint predictive model | Present separate schema/inference/persistence paths within one frontend/auth/history architecture. Identify the shared history-summary view explicitly | E01–E07 | No | Implemented application integration; fused modeling future work |
| SYS2 | Source presence can be mistaken for verified operational behavior | Use “implemented in source” for routes and UI; attach prior audit scope to historical outcomes. Health is model-load availability, not accuracy/database certification | E04–E06, E11 | No; live behavior needs separate checks | Implemented; previously verified limited checks; pending live evidence |
| SYS3 | A schematic might be treated as a genuine application picture | Reuse the consolidated source-derived Mermaid architecture schematic as a design figure, with separate pending screenshot figures | E01–E06, E17; consolidated Figure 1 | No | Implemented architecture represented schematically |

### 8. Methodology and experimental setup

| ID | Current issue | Recommended correction / acceptance criterion | Exact evidence | New evidence required? | Claim status |
| M1 | A controlled comparison could imply both forests were freshly fitted identically in the research run | Explicitly state weighted IEEE-CIS artifact reuse versus unweighted clone fitting, sharing the original fitted preprocessor. Distinguish credit's two newly fitted research candidates | E08; E15 fitting table | No | Implemented procedure; saved fitted artifacts |
| M2 | Matching preprocessing, dimensions and Git identity could be overinterpreted | Report matching feature order, preprocessing object hash and 413,378 recorded samples, then explicitly retain that exact historical weighted-model training-row identity is unproven | E07, E15 | No for qualified statement; historical certainty requires fit manifests/logs | Previously verified metadata; historical sample identity pending |
| M3 | Training-only fitting can be asserted more strongly than source evidence permits | Explain the trainer's training-derived constants and Pipeline.fit boundary, and the evaluator's transform-only fraud path. Do not equate this with proof of every historical execution | E08, E15 | No; stronger historical guarantee requires records | Implemented boundary; previously inspected; historical proof pending |
| M4 | Fitting path and worker-count differences need disclosure | State DataFrame/Pipeline versus transformed float32 memmap paths; parameters differ in class weight and n_jobs. Do not infer material numerical equality solely from seeds | E08, E15 | No; numerical training-equivalence experiment not authorized | Previously verified metadata/procedure |
| M5 | Threshold selection needs exact reproducibility detail | Keep grid 0.01–0.99, candidate-wise F1/precision/threshold tie rules, forest-only model selection and each candidate's own operating point | E08, E09; R6 | No | Implemented; experimentally evaluated (saved) |
| M6 | Current versions may be mistaken for historical training versions; hardware minimums are unknown | Separate current environment snapshot, frontend lockfile, declared ranges and prior PostgreSQL audit. Omit unverified hardware specifications/minimums | E11, E18, E19 | No for present snapshot; yes for historical environment/hardware claims | Previously verified current metadata; historical setup pending |
| M7 | Replay JSON field naming can imply full API coverage | Explain that full-holdout replay compares direct pipeline/classifier paths; recorded HTTP examples use TestClient/temporary SQLite | E08, E09, E11 | No; broader HTTP coverage needs separate authorization | Experimentally evaluated (saved) direct replay; limited prior API verification |

### 9. Results and confusion matrices

| ID | Current issue | Recommended correction / acceptance criterion | Exact evidence | New evidence required? | Claim status |
| RES1 | Legacy validation and prototype results could re-enter final tables | Use only final selected/comparator CSV rows for holdout values. Label older 80/20 credit, fraud validation and prototype JSONs as historical if mentioned at all | E09, E12 | No | Experimentally evaluated (saved) |
| RES2 | The selection reversal is vulnerable to optimistic rewriting | Preserve fraud validation F1 0.480839 unweighted versus 0.444778 weighted; holdout F1 0.372383 versus 0.444087. Do not reselect retrospectively or diagnose drift | E09; E15 | No | Experimentally evaluated (saved); cause unproven |
| RES3 | Metric names and baseline integration can mislead | Retain separate trapezoidal PR-AUC/AP definitions and columns. Explain constant-prior AP/prevalence and degenerate PR interpolation beside the table | E08–E10; R4, R5 | No | Experimentally evaluated (saved) |
| RES4 | Confusion counts need meaningful interpretation and consistent axes | Use actual rows/predicted columns; preserve fraud TN/FP/FN/TP 83,100/2,398/1,829/1,254 and credit 19,959/1,037/792/712. Describe labels, not measured losses or denials | E09, E10; consolidated Tables 7–9 | No | Experimentally evaluated (saved) |
| RES5 | A single split cannot establish statistically significant superiority | Describe candidate differences for these partitions; retain absence of CIs, repeated-seed evidence and significance tests | E09, E20 | No for qualification; separate approval for new analyses | Saved descriptive evaluation; broader inference pending |

### 10. Feature importance and explainability limitations

| ID | Current issue | Recommended correction / acceptance criterion | Exact evidence | New evidence required? | Claim status |
| X1 | “Explainability” could imply local attribution | Call outputs global mean-decrease-in-impurity rankings. Keep actual coefficient/feature tables; explicitly state no demonstrated SHAP or local explanation | E04, E10; R9–R11 | No | Experimentally evaluated (saved) global rankings; local XAI future work |
| X2 | Important anonymized features can invite causal/semantic invention | Do not assign unsupported meanings to V257/V246 or claim causal drivers. Distinguish rank relevance from explanation fidelity and stability | E10; R9, R10 | No; new causal/fidelity claims need evidence | Saved descriptive rankings; causal/local claims unsupported |
| X3 | The two datasets have different feature spaces and importance distributions | Interpret ranks within each pipeline; do not compare raw importance values as a shared financial-risk scale | E07, E10 | No | Experimentally evaluated (saved) separate rankings |

### 11. Discussion and threats to validity

| ID | Current issue | Recommended correction / acceptance criterion | Exact evidence | New evidence required? | Claim status |
| V1 | Several distinct threats are combined in one broad limitations list | Separate internal provenance, statistical uncertainty, external/temporal validity, construct validity of scores/bands, and operational verification | E15, E20; R3, R7–R12 | No | Previously assessed limitations |
| V2 | Chronological separation may imply entity separation or implemented drift control | State that fraud uses later same-dataset observations, credit random observations, and neither establishes entity-disjoint/external deployment. No drift detector or adaptation exists | E08, E15; R3; L3, L4 | No; stronger findings require new experiments | Implemented temporal split; drift adaptation future work |
| V3 | Percentages/risk bands may sound calibrated | Use positive-class score terminology in research interpretation; explain UI percentage and independent 0.30/0.70 bands. Do not claim either good or bad calibration without measurement | E04, E20; R8, R12; L8 | No; calibration results require separate authorization | Implemented display; calibration pending/future work |
| V4 | Operational limitations may be omitted because they do not change model metrics | Retain history's missing model-version/threshold columns and documented downgrade ownership loss, without changing the application/schema | E06, E11, E20 | No | Implemented schema limitation; previously verified downgrade finding |

### 12. Application implementation and genuine demonstration

| ID | Current issue | Recommended correction / acceptance criterion | Exact evidence | New evidence required? | Claim status |
| APP1 | UI/source existence can be read as successful end-to-end execution | Keep actual JSON-editor/ten-field form and authentication/history/report descriptions, explicitly qualified by source inspection | E01–E06 | No | Implemented |
| APP2 | Planned real records can be mistaken for submitted predictions | Describe manifest IDs and membership as preparation only. No predicted label, score, saved ID or count change may be invented | E16, E17 | Yes for outcomes; separately approved live run | Previously verified data selection; submissions pending |
| APP3 | Figures may be requested before execution evidence exists | Keep screenshot slots as pending in the review plan, not fake or unlabeled figures. Capture only actual UI results after approval and reconcile counts/CSV/PDF | E11, E17 | Yes; separate authorization plus permission review | Pending |
| APP4 | Demonstration success may be promoted to generalization evidence | Identify the four examples as integration cases, not a new evaluation cohort; retain unfavorable predictions and exclude demo rows from research tables | E09, E16, E17 | No for distinction; live evidence still pending | Saved formal evaluation; pending integration demonstration |

### 13. Conclusion and future work

| ID | Current issue | Recommended correction / acceptance criterion | Exact evidence | New evidence required? | Claim status |
| C1 | Conclusions can turn partial treatments into solved research gaps | State that imbalance was evaluated, global relevance inspected and separate pipelines integrated; none establishes full-XAI, fused prediction or drift adaptation | E02, E04, E08–E10 | No | Saved evaluation; implemented limited scope |
| C2 | Future extensions could be reported as research achievements | Keep O8–O10 strictly future; distinguish optional new experiments from necessary claim corrections and publication checks | E20; Section C below | No for correct labeling; separate authorization to execute | Future work |
| C3 | Application readiness or publication readiness may be overstated | Do not predict acceptance or operational deployment. State unresolved live evidence, permissions, historical provenance and venue fit | E11, E17, E20, E22; R13 | No for limitations; new verification for stronger claims | Pending |

### 14. References and supplementary evidence

| ID | Current issue | Recommended correction / acceptance criterion | Exact evidence | New evidence required? | Claim status |
| SUP1 | Old E1–E12 and consolidated E01–E22 namespaces collide | Use a single future manuscript/supplement mapping and preserve this specification's explicit namespace definition. Check every reference and figure/table pointer | E21, consolidated Sections 11–12 | No | Editorial evidence control |
| SUP2 | Machine-specific paths and a private preservation package are unsuitable automatic public supplements | Use relative source paths, artifact/data hashes and authorized-acquisition instructions; keep private credentials/metadata and permission-sensitive inputs out of any automatic release | E14, E16, E18; R13 | Yes before release authorization; no for internal mapping | Previously verified inventory; publication pending |
| SUP3 | Verified metadata is not a claim of full critical reading or reproducibility | Preserve publication/preprint labels, bibliographic identifiers, source access limits and protocol-comparability notes | E21, E22; R1–R12 | No for existing facts; recheck before submission | Previously verified metadata; deeper review pending |
| SUP4 | Screenshot absence or research plot status can be blurred | Inventory the eight unchanged PNGs with captions and sources. Verify readability/legend definitions at final column width without regenerating evidence. Keep live screenshots separately pending | E10, E17, E20 | Visual review required; capture separately authorized | Existing saved plots; pending final presentation/live pictures |

## B. Final recommended Research Gap

**Proposed text for later adoption, not an edit to v1:**

“Financial fraud detection and borrower delinquency prediction are established but distinct imbalanced classification tasks. Existing literature provides weighting, threshold-selection, calibration and explanation methods; this study does not claim these methods are absent. The project-specific gap is an explicitly bounded empirical account connecting separate task pipelines, validation-selected operating points, final holdout errors and application-serving artifacts. FraudShield addresses this gap through a preserved comparison and shared application implementation, while retaining incomplete historical fit provenance and pending live integration evidence. Class imbalance remains only partially addressed, interpretability is limited to global impurity rankings, and no fused financial-risk model or concept-drift detection/adaptation is demonstrated.”

Evidence: E01–E10, E15–E17, E20; R1–R12. Status: saved experimental comparison plus implemented architecture; local XAI/fusion/drift are future work, and live evidence is pending. No new experiment is needed to state this bounded gap. A stronger field-wide novelty claim would require additional literature evidence and potentially new research.

## C. Final Research Aim and measurable Objectives

### Research aim

**To evaluate and document two independent Random Forest pipelines for transaction fraud and serious-delinquency prediction using explicit validation-based selection and preserved holdout evidence, and to assess their integration within an authenticated financial-monitoring application.**

This aim is intentionally narrower than solving financial risk or developing a fused adaptive explainable model. E07–E11 and E15–E17 define its scope.

| Objective | Measurable completion criterion | Exact evidence | Status | New evidence needed? |
|---|---|---|---|---|
| O1 Specify data and partitions | Identify target/input schemas; provide all six partition counts/class counts; distinguish temporal and random splitting | E08, E09, E13, E15 | Previously verified structure and saved statistics; source-release/terms checks pending | No for counts; yes for stronger official provenance |
| O2 Specify independent fitted pipelines | Report 431/10 inputs, preprocessing, parameters, artifact hashes and fraud reuse/refit asymmetry | E07, E08, E15 | Implemented and previously inspected; exact historical fraud fit rows unproven | No for qualified specification |
| O3 Compare weighting and prior baseline | Report all six saved candidate rows and candidate-wise validation operating points | E08, E09 | Experimentally evaluated (saved) | No; independent reproduction not claimed |
| O4 Document validation selection | Specify 99 thresholds, tie rules and forest-only selection; separate procedure from historical analyst conduct | E08, E09, E15 | Implemented; evaluated in saved outputs; historical non-use of holdout not certified | No for procedure; historical proof requires records |
| O5 Characterize final errors | Report selected holdout metrics, sample/positive counts and TN/FP/FN/TP; interpret errors by task | E09, E10 | Experimentally evaluated (saved) | No |
| O6 Describe global feature relevance | Provide both saved rankings/plots with explicit nonlocal/noncausal limitations | E10 | Experimentally evaluated (saved), global descriptive level | No |
| O7 Assess actual application integration | Trace reviewed real inputs through authenticated inference/persistence; reconcile owned history, analytics and report outputs | E01–E06, E11, E16, E17 | Implemented; limited prior verification; live assessment pending | Yes, separately approved live evidence |
| O8 Demonstrate validated per-case explanations | Specify/evaluate attribution or another local method, fidelity/stability and presentation | No local implementation/evaluation found; E04, E10, E20 | **Future objective only** | Yes; separate authorization |
| O9 Validate a fused financial-risk predictor | Establish justified aligned data/target, combination and independent assessment | No fused artifact or joint evaluation found; E02, E07, E20 | **Future objective only** | Yes; separate research authorization |
| O10 Evaluate drift detection and adaptation | Specify time-aware detector/controls and evaluate false alarms, delayed labels and adaptation effects | No such experiment found; E08, E15, E20; R3 | **Future objective only** | Yes; separate research authorization |

Only O1–O7 belong in the current-study objective set, with their qualifications. O8–O10 retain their identifiers in a clearly separate prospective-objectives paragraph. They must not appear in a completed-objectives list or Abstract contribution sentence.

## D. Final Research Questions

| Question | Evidence-based answer boundary | Exact evidence | Status / new evidence |
|---|---|---|---|
| RQ1: Within the saved protocols, how do weighted and unweighted forests compare at validation-selected operating points? | Report both datasets and the fraud reversal; no universal or significant-superiority conclusion | E08, E09 | Experimentally evaluated (saved); no new evidence for descriptive answer |
| RQ2: What positive-class errors and ranking performance characterize the selected models on their respective internal holdouts? | Precision/recall/F1/confusion counts, ROC-AUC, AP and separately labeled PR-AUC | E09, E10 | Experimentally evaluated (saved); no new evidence for reported values |
| RQ3: Which inputs rank highest in each fitted forest's global impurity importance, and what does that evidence not explain? | Within-pipeline ranks; no per-case, causal, fairness or stability claim | E07, E10; R9–R11 | Saved global analysis; stronger explanation questions future work |
| RQ4: Can reviewed real holdout examples pass through the actual authenticated inference, persistence and reporting workflow with consistent results? | Source/prior checks are partial; answer remains open until approved live reconciliation | E01–E06, E11, E16, E17 | Implemented pathway; pending new live evidence |

Calibration, fused prediction and drift adaptation should appear as prospective questions linked to O8–O10 or the future-work discussion, not retrospectively answered RQs. Local explanation and calibration are related but distinct; calibration is not demonstrated by adding an explanation method.

## E. Defensible research contributions

| Contribution wording | Evidence | Status | Required qualification / new evidence |
|---|---|---|---|
| A preserved two-task comparison of forest class weighting and validation-selected operating points | E07–E09, E14, E15 | Experimentally evaluated (saved) | Reused weighted fraud fit; historical exact rows unproven; not independent replication |
| A transparent report of the fraud validation-to-holdout reversal and separate operating/ranking metrics | E08, E09 | Experimentally evaluated (saved) | Empirical observation, not an explanation of its cause or a novel selection algorithm |
| Global fitted-forest relevance summaries for each separate target | E10 | Experimentally evaluated (saved) | Descriptive impurity importance only; not full XAI |
| Artifact-connected implementation of two authenticated prediction services with owner-scoped history/reporting | E01–E07, E11 | Implemented; limited previous verification | Live screenshot/download/count consistency remains pending; no fused model |

These are the maximum defensible claims on current evidence, not proof that a particular venue will judge them sufficiently original. Do not relabel backup creation, use of a standard classifier or addition of a dashboard as algorithmic novelty.

## F. Claims that must be removed or qualified

This is a guardrail for v2; items already correctly qualified in v1 should remain qualified rather than being “fixed” into stronger language.

| Disallowed or misleading claim | Required replacement/boundary | Evidence / status |
|---|---|---|
| “FraudShield solves class imbalance” | It compares two weighting choices and validation thresholds; substantial FP/FN remain | E08, E09; saved evaluation, partial treatment |
| “SMOTE/resampling improves our models” | No project class-resampling experiment is evidenced; forest bootstrapping is not a SMOTE experiment | E08; absent experiment, future work |
| “Full explainable AI,” “SHAP explains each prediction” | Global impurity rankings only; no demonstrated local explanation | E04, E10; global saved analysis, local future work |
| “A unified/fused financial-risk model” | Shared application architecture with two independent targets/pipelines | E02, E04, E07; implemented architecture, fusion absent |
| “Drift detected/handled through adaptive retraining” | Chronological fraud evaluation only; no detector or adaptation experiment | E08, E15; adaptation future work |
| “Drift caused the fraud score reversal” | Reversal observed; cause not established | E09; saved finding, causal evidence absent |
| “Both fraud candidates were refitted identically” | Weighted artifact reused; unweighted fit uses its fitted preprocessor | E08, E15; implemented procedure |
| “Exact historical training-row equality proven” | Matching dimensions/preprocessing and intended partitions do not prove fit-time IDs | E15; historical identity pending |
| “Completely leakage-free historical execution” | Current source enforces training-only fitting; historical execution not fully certified | E08, E15 |
| “Independent reproduction completed during writing” | Saved evidence and read-only checks, not new training/evaluation | E09, E14, E15 |
| “Current Python/package versions were used in every experiment” | Current snapshot/lockfile and historical environment are separate | E18, E19; historical versions pending |
| “Best model on test data is the selected fraud model” | Selected by validation; weighted comparator has higher holdout F1 | E09 |
| “PR-AUC and AP are the same metric” | State separate computations and baseline interpolation caveat | E08, E09; R5 |
| “Calibrated financial probability” or “validated High/Medium/Low risk” | Model score; UI bands unvalidated | E04; R8, R12; calibration pending |
| “False positives caused loan rejection / measured losses” | Incorrect dataset labels; no institutional intervention/cost outcomes measured | E09 |
| “Full holdout API replay passed” | Saved full-holdout direct Python-path replay; HTTP example verification is narrower | E08, E09, E11 |
| “Actual screenshots/live CSV/PDF workflow verified” | Pending actual evidence; source and planned examples are not captures | E11, E16, E17 |
| “Public data may be freely redistributed” | Verify dataset-specific sharing/attribution conditions before publication | R13; permission assessment pending |
| “O8–O10 achieved” | Prospective local explanation, fusion and drift objectives only | E20; future work |
| “Submission/acceptance ready” | Venue fit, contribution, permissions, authorship and final evidence review remain | E20, E22; pending |

## G. Remaining publication-readiness checklist

### G1. Required for an accurate text-only v2

- [ ] Approve this specification before manuscript edits. Preserve v1 and create a separate versioned v2.
- [ ] Use the bounded gap, aim, O1–O7 and RQ1–RQ4; keep O8–O10 in future work.
- [ ] Incorporate the provenance disclosure and exact temporal boundaries from E15 without claiming historical row identity.
- [ ] Preserve every saved metric, candidate identity, threshold and selected flag; review tables against E09, with no recalculation/regeneration.
- [ ] Retain selection reversal, AP distinction, legacy boundary and task-specific error interpretation.
- [ ] Separate source implementation, saved evaluation, prior verification and pending demonstration throughout captions and prose.
- [ ] Incorporate recent literature selectively, label preprints and compare protocols rather than unmatched scores.
- [ ] Resolve evidence-namespace collisions and ensure every major claim resolves to its actual file/reference.
- [ ] Review the separately mentioned independent audit if one is supplied; do not claim it was integrated before it is identifiable.

These items use existing evidence and require editorial approval, not new experiments.

### G2. Checks before asserting currently pending claims

- [ ] Confirm exact credit dictionary target wording and dataset-specific attribution/permissions, including real-input screenshots/payload release (E13, E20; R13).
- [ ] Confirm authors, affiliations, contributions, funding/conflict statements and prior dissemination; do not invent them.
- [ ] Choose a venue/category and check its actual scope, originality expectations, page limit, anonymity, template and supplementary rules (E20).
- [ ] Inspect all eight original research plots at final column width, retaining originals and documenting any label/readability issue (E10, E17).
- [ ] If application figures remain a claimed contribution, obtain separate approval, execute the bounded real workflow and verify history/analytics/CSV/PDF evidence before writing success captions (E16, E17).
- [ ] Seek surviving historical manifests/logs if available. If unavailable, retain provenance/environment limitations; a missing record must not be invented (E15, E18, E19).

### G3. Optional additional research, not authorized by this plan

Repeated-seed comparisons, confidence intervals, broader matched baselines, calibration, subgroup/external validation, local explanations, fused modeling and drift adaptation could strengthen later work. They require separate approval, appropriate non-contaminating data protocols and versioned outputs. None is silently required or executed by this revision-planning pass; no change to frozen metrics/artifacts is permitted.

### Completion and stop rule

This specification is complete when all fourteen section plans contain an issue, correction, evidence mapping, evidence requirement and claim status, and the final gap/aim/objectives/RQs remain consistent with saved evidence. The immediate next action is review/approval of the specification, not manuscript editing, live demonstration or experimentation. No staging or committing is part of this work.
