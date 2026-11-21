# FraudShield: Validation-Selected Random Forest Pipelines for Transaction Fraud Detection and Credit Delinquency Assessment

**Review draft v1 — 18 November 2026.** Author names, affiliations, target venue and funding declarations are awaiting confirmation. Numerical results describe preserved experimental outputs, not experiments independently rerun during manuscript preparation. Application screenshots and live demonstration results are pending. Evidence identifiers E1–E12 resolve in `evidence-map.md`.

## Abstract

Transaction fraud detection and credit delinquency assessment involve imbalanced binary outcomes, but their evaluation protocols and operational interpretations differ. This study describes FraudShield, an educational application integrating separate Random Forest pipelines for IEEE-CIS transactions and Give Me Some Credit borrower records. Preserved experiments compare weighted and unweighted forests with a constant-prior baseline. IEEE-CIS uses chronological 70/15/15 partitions, whereas credit uses stratified random partitions with the same proportions. Forest and operating-point selection use validation F1. The selected unweighted pipelines use 431 and 10 features and decision thresholds of 0.21 and 0.23, respectively. Saved holdout results report fraud precision 0.3434, recall 0.4067, F1 0.3724 and Average Precision 0.4383 on 88,581 transactions. Credit precision is 0.4071, recall 0.4734, F1 0.4377 and Average Precision 0.3955 on 22,500 borrowers. Although the unweighted fraud forest achieved higher validation F1, the weighted comparator achieved higher holdout F1, 0.4441. This reversal limits conclusions about the stability of validation-based selection. Artifact hashes connect the saved replay evidence to the application-serving files. Full live-browser demonstration remains pending. The work supports a documented comparison and application prototype, without establishing calibrated probabilities, external validity or superiority over contemporary benchmark systems.

**Index Terms—** Fraud detection, credit delinquency, random forests, imbalanced classification, threshold selection, research reproducibility.

## I. Introduction

Financial monitoring applications may assess suspicious transactions and adverse borrower outcomes within a common interface. These tasks nevertheless involve different targets, feature spaces and evidence requirements. FraudShield treats them as separate binary classification problems. Its fraud pipeline operates on IEEE-CIS transactions, while its credit pipeline estimates the positive serious-delinquency outcome in Give Me Some Credit. The application does not combine these outputs into a validated joint risk score.

Class imbalance complicates evaluation because a high proportion of correct predictions can coexist with failure to identify the positive class. Precision indicates the reliability of generated alerts, while recall measures the share of positive cases detected. A decision threshold determines the operating point and must be reported alongside threshold-dependent metrics. Studies of precision–recall evaluation and F1 threshold selection motivate examining these quantities explicitly [4]–[6]. Their relevance does not make ROC-AUC unnecessary; this study reports both ranking and operating-point measures.

Random Forests combine randomized trees and provide a practical reference method for tabular prediction [1]. Their availability does not remove the need to separate training, selection and testing. In particular, chronological fraud evaluation addresses a different generalization question from a random borrower split. Prior operational fraud research identifies changing transaction distributions, delayed labels and investigator feedback as important considerations [3]. FraudShield's static experiments address only part of this setting.

This paper documents three contributions within that limited scope. First, it specifies preprocessing and dataset partitions for two distinct prediction tasks. Second, it reports a controlled comparison of forest class weighting and validation-selected thresholds against a constant-prior baseline. Third, it describes how selected fitted pipelines are connected to authenticated inference and prediction history in an application. These are experimental and implementation contributions; no new learning algorithm is proposed.

The paper also reports an unfavorable result: the validation-selected unweighted fraud forest does not retain its F1 advantage on the later holdout. Rather than selecting a replacement on the test results, the analysis retains the documented selection and discusses the discrepancy. All numerical findings in this draft are drawn from a preserved evidence package. The preparation audit checked file identity and consistency of saved results but did not retrain or independently reproduce them.

## II. Literature Review

### A. Random Forests and credit scoring

Breiman introduced Random Forests as ensembles whose tree construction incorporates random variation [1]. This provides the methodological basis for the classifier family examined here. FraudShield compares class weighting within a fixed forest configuration; it does not test whether forests outperform all other tabular methods.

Lessmann et al. compared 41 classifiers across eight credit-scoring datasets using multiple assessment measures [2]. Their study illustrates the breadth needed for claims about algorithm superiority. FraudShield has a narrower scope: one credit dataset, two weighting variants of the same model family and a prior baseline. Because datasets and protocols differ, their numerical results are not used as a directly comparable leaderboard.

### B. Operational fraud evaluation

Dal Pozzolo et al. examine fraud detection under class imbalance, distribution change and delayed verification [3]. Their work motivates explicitly documenting temporal ordering and limits of static evaluation. FraudShield reserves a later IEEE-CIS partition for testing but does not simulate streaming updates, investigator capacity or delayed feedback. A chronological split alone is therefore insufficient evidence of an operational fraud-detection system.

### C. Precision–recall measures and thresholds

Saito and Rehmsmeier discuss the value of precision–recall plots for interpreting minority-class performance [4]. Davis and Goadrich analyze the relationship between ROC and PR spaces and the complications of PR interpolation [5]. These publications motivate reporting the positive-class operating point, ROC-AUC, a precisely labeled trapezoidal PR-AUC and Average Precision separately. They do not establish that a single scalar metric captures every deployment objective.

Lipton et al. study threshold selection for F1 and show that the optimal decision rule depends on properties of the scores and evaluation setting [6]. Their calibrated-probability special case should not be assumed for FraudShield, whose calibration has not been tested. The project uses an empirical validation threshold grid instead. This optimizes validation F1 rather than business cost or investigator workload.

### D. Position and scope

The reviewed literature supports evaluating imbalance, selection and temporal validity explicitly. It does not establish a literature gap for a novel classifier or a state-of-the-art claim for this project. The current contribution is a transparent two-task study with preserved artifacts and application integration. A broader recent-literature search remains necessary before journal submission; the present section is a verified foundational review, not a systematic review.

## III. Datasets and Problem Formulation

### A. Targets and inputs

For each task, an input vector x is associated with a binary label y. The fraud target is `isFraud`; the credit target is `SeriousDlqin2yrs`, interpreted in the dataset documentation as serious delinquency within two years [7], [8]. The pipeline produces a positive-class score s(x), and the classifier outputs 1 when s(x) is at least a selected threshold t. The score is displayed as a probability by the application, but calibration has not been established. It is described here as a model score.

### B. IEEE-CIS

The preparation script left-joins labeled transaction and identity files using `TransactionID`, with one-to-one join validation. Transactions lacking identity matches retain missing identity values. The merged file contains 590,540 rows and 434 columns. `TransactionID` and `isFraud` are excluded from prediction inputs. Training-based constant-feature removal excludes V107, leaving 431 inputs: 400 numeric and 31 categorical columns in the fitted preprocessor [E3, E4]. The counts describe the project pipeline's treatment of columns, not a universal semantic classification of IEEE-CIS fields.

The split script sorts by `TransactionDT` and `TransactionID` and assigns the first 70% to training, the next 15% to validation and the final 15% to holdout. These are internal partitions of the labeled competition training data; they are not the competition's unlabeled test data. Partition distributions are shown in Table I. The evaluation code includes cross-partition identifier and chronological-order checks. The current preparation review did not execute the full evaluation to independently certify the original split-generation process.

### C. Give Me Some Credit

The labeled source contains 150,000 borrower rows. The row identifier `Unnamed: 0` and target are excluded, leaving ten predictors. The research evaluator performs a stratified 70/30 split with seed 42 and then divides the held-out portion equally into validation and holdout using the same seed and stratification. This yields a 70/15/15 design [E2]. The original credit-training script used an older 80/20 split; its validation metrics are not final research test results.

**Table I. Saved partition distributions [E1].**

| Dataset | Partition | Rows | Negative | Positive |
|---|---|---:|---:|---:|
| IEEE-CIS | Training | 413,378 | 398,840 | 14,538 |
| IEEE-CIS | Validation | 88,581 | 85,539 | 3,042 |
| IEEE-CIS | Holdout | 88,581 | 85,498 | 3,083 |
| Credit | Training | 105,000 | 97,982 | 7,018 |
| Credit | Validation | 22,500 | 20,996 | 1,504 |
| Credit | Holdout | 22,500 | 20,996 | 1,504 |

The fraud partition evaluates later observations within one dataset; the credit partition evaluates randomly held-out observations from one dataset. Neither establishes external-population validity. Dataset source pages are cited separately from project-derived counts. Source-file hashes are preserved, but equivalence to an independently downloaded official release and redistribution permissions remain to be checked.

## IV. Methodology

### A. Preprocessing and candidate construction

Numeric variables use median imputation. Categorical variables use most-frequent imputation followed by ordinal encoding with unknown categories encoded as -1. Preprocessing is fitted on training data. For fraud, the evaluator reuses the original training-fitted preprocessor and the original weighted forest; it fits the unweighted comparator on the corresponding transformed chronological training partition. For credit, it clones and refits the preprocessor and fits both forest variants on the new stratified training partition [E2–E4]. This reuse makes the fraud comparison depend on the provenance of the original weighted artifact, an explicit reproducibility limitation.

Both forest configurations have 100 trees, maximum depth 16, minimum leaf size 2, square-root feature sampling, Gini splitting, bootstrap sampling and seed 42. The comparison changes class weighting between `balanced_subsample` and no class weighting. There is no broad hyperparameter search. A `DummyClassifier(strategy="prior")` fitted on training labels supplies constant positive-class scores as the baseline.

### B. Validation selection

For each candidate, the evaluator examines thresholds 0.01 through 0.99 in increments of 0.01. Within a candidate, maximum validation F1 determines the threshold; ties are resolved by higher precision and then higher threshold. Only the weighted and unweighted forests compete for model selection, using their best validation F1. The baseline receives its own validation-selected threshold for reporting but cannot become the serving model. Each dataset's threshold CSV contains 297 operating points: 99 for each of three candidates [E5].

The selected fraud and credit thresholds are 0.21 and 0.23. The documented procedure retains these thresholds for holdout assessment. Current code supports this validation-based design, but the preserved outputs alone do not independently establish the full historical chronology of analyst decisions.

### C. Evaluation measures

For the positive class, precision is TP/(TP+FP), recall is TP/(TP+FN), and F1 is 2PR/(P+R). Accuracy is (TP+TN)/N. ROC-AUC measures score ranking across positive and negative observations. Thresholded measures are reported at the selected operating point.

The research field `pr_auc` is computed by trapezoidal integration, `auc(recall, precision)`, over `precision_recall_curve` output. Average Precision is separately computed by `average_precision_score` and weights precision by recall increments. These definitions are not interchangeable. In particular, trapezoidal interpolation of constant-score PR points can produce a large area without useful discrimination. Both quantities are retained to describe the frozen evidence faithfully, with AP emphasized for the prior baseline. Earlier training JSONs used `pr_auc` to name AP; those legacy values are not substituted here.

### D. Artifact identity and replay scope

Selected fitted preprocessors, forests and thresholds are serialized as `fraud_selected.joblib` and `credit_selected.joblib`. Their hashes match the frozen replay JSON and the current corresponding repository files [E6]. The backend loads those paths and sets `n_jobs=1` for fixed-order tree-score accumulation. Serialized artifacts retain `n_jobs=4`; the runtime override does not constitute retraining.

The saved replay script compares pipeline scoring against classifier scoring on transformed holdout inputs and checks metrics against selected CSV rows. It records a maximum score difference of zero. Despite the field name containing `api_path`, this is a direct Python-path comparison, not an HTTP request across every holdout observation. An additional recorded TestClient workflow covers example inputs with temporary SQLite [E7]. These are saved checks, not independently rerun experiments during manuscript drafting.

## V. Experimental Results

### A. Selected-model holdout performance

Table II transcribes saved selected-model rows. Values are rounded to six decimals for presentation; original precision remains in the frozen tables and replay JSON. No metric was recomputed for this manuscript.

**Table II. Saved selected-model holdout results [E8].**

| Measure | IEEE-CIS | Credit |
|---|---:|---:|
| Threshold | 0.21 | 0.23 |
| Accuracy | 0.952281 | 0.918711 |
| Precision | 0.343373 | 0.407090 |
| Recall | 0.406747 | 0.473404 |
| F1 | 0.372383 | 0.437750 |
| ROC-AUC | 0.866884 | 0.857274 |
| Trapezoidal PR-AUC | 0.438250 | 0.395205 |
| Average Precision | 0.438290 | 0.395532 |

**Table III. Saved confusion counts at selected thresholds [E8].**

| Dataset | N | Actual positives | TN | FP | FN | TP |
|---|---:|---:|---:|---:|---:|---:|
| IEEE-CIS | 88,581 | 3,083 | 83,100 | 2,398 | 1,829 | 1,254 |
| Credit | 22,500 | 1,504 | 19,959 | 1,037 | 792 | 712 |

Fraud detection therefore identifies 1,254 positive observations while missing 1,829, and credit identifies 712 while missing 792. These results indicate substantial positive-class errors despite comparatively high accuracy. They do not support a claim of reliable autonomous screening. The existing confusion matrices and ranking curves belong here as Figs. 1–3; exact placements are specified in `tables-and-figures.md`.

### B. Weighting and selection

**Table IV. Validation selection and holdout comparison [E5, E8].**

| Dataset | Candidate | Threshold | Validation F1 | Holdout precision | Holdout recall | Holdout F1 | Holdout AP |
|---|---|---:|---:|---:|---:|---:|---:|
| Fraud | Weighted | 0.62 | 0.444778 | 0.494235 | 0.403179 | 0.444087 | 0.445964 |
| Fraud | Unweighted, selected | 0.21 | 0.480839 | 0.343373 | 0.406747 | 0.372383 | 0.438290 |
| Fraud | Constant prior | 0.03 | 0.066403 | 0.034804 | 1.000000 | 0.067267 | 0.034804 |
| Credit | Weighted | 0.54 | 0.412781 | 0.360411 | 0.466090 | 0.406495 | 0.341536 |
| Credit | Unweighted, selected | 0.23 | 0.450610 | 0.407090 | 0.473404 | 0.437750 | 0.395532 |
| Credit | Constant prior | 0.06 | 0.125312 | 0.066844 | 1.000000 | 0.125312 | 0.066844 |

For IEEE-CIS, the unweighted model's validation F1 exceeds the weighted model's, yet the weighted model achieves higher holdout F1 and precision with similar recall. The unweighted model's validation precision is 0.622129, compared with holdout precision 0.343373. The results establish a validation-to-holdout change but do not identify whether distribution change, sample variation or another factor explains it. Selecting the weighted forest retrospectively on holdout F1 would change the documented protocol; this paper instead reports both candidates and retains the validation-selected result.

For credit, the unweighted forest achieves higher validation F1 and higher holdout F1 than its weighted comparator. This result is restricted to the recorded split and configuration. A single seed without uncertainty estimates does not establish a general advantage for unweighted learning.

The prior baseline predicts all observations positive at its selected threshold, yielding recall one and precision equal to holdout prevalence. Its recorded trapezoidal PR-AUC is 0.517402 for fraud and 0.533422 for credit, whereas its AP is 0.034804 and 0.066844. Those trapezoidal values illustrate why the integration definition and constant-score behavior must be stated rather than interpreted as evidence of useful ranking.

### C. Feature rankings

The saved impurity rankings place V257, V246 and C1 first for fraud, and revolving utilization, number of times 90 days late and debt ratio first for credit [E9]. Figure 4 presents the existing top-feature plots. These are global fitted-forest rankings. They do not establish causal drivers, individual explanations or stable rankings across alternative samples. No SHAP experiment is reported.

## VI. FraudShield Implementation and Demonstration

The implemented application connects a React interface to FastAPI inference and SQLAlchemy/PostgreSQL history storage. The backend loads the selected pipelines and returns a class, full-precision positive-class score, decision threshold, artifact hash, risk label and saved history identifier. Authenticated predictions commit a history row owned by the requesting user; history-list and individual-record queries filter by ownership [E10]. The history schema retains class, score, risk and time but not the artifact hash or threshold.

The fraud page accepts a complete 431-feature JSON record rather than 431 separate input widgets. The credit page renders ten numeric inputs. Analytics and Reports aggregate the authenticated user's loaded history. Reports filters by model, generates CSV client-side and opens the browser print dialog. The Unified Risk page uses the shared history-summary component; there is no independently validated fusion model. File management remains a placeholder.

The application labels scores below 0.30 Low, from 0.30 to below 0.70 Medium, and at least 0.70 High. These display bands differ from classification thresholds, so a positive classification may receive a Low label. They are application conventions without demonstrated risk calibration.

**Live demonstration evidence is pending and is not represented as completed.** The separate manifest selects real public holdout records and preserves input/source provenance for review. After approval, they are to be submitted through the actual application, using authorized accounts and normal database persistence. Screenshots must record actual results even when incorrect. Demo records will not be treated as an additional evaluation sample or used to revise frozen metrics.

## VII. Discussion and Threats to Validity

### A. Experimental scope

The comparison tests class weighting within one forest family and one fixed seed, not algorithm superiority across broad benchmarks. No confidence intervals, repeated-seed stability, significance tests, calibration assessment, subgroup evaluation or external-dataset validation are provided. The fraud holdout is later data from the same dataset, while credit uses a random same-dataset holdout. Their results should not be interpreted as equivalent temporal or external generalization tests.

### B. Provenance and reproducibility

The preserved package supplies raw data, processed IEEE-CIS partitions, scripts, artifacts, numerical outputs and checksums. This establishes file identity and availability, not independent experimental reproduction. Several dependencies are not fully version-pinned. Credit partition memberships are reconstructed by code rather than stored in the original evidence as a standalone manifest. The original weighted fraud fit is reused, so verifying its training-only lineage remains important. Current selection code cannot by itself prove historical absence of holdout-guided analyst decisions.

### C. Operational and interpretation limits

The study does not evaluate latency, throughput, concept-drift adaptation, investigator budgets, business cost, actual lending outcomes or production security. Probability calibration and risk-band validity are unresolved. Impurity rankings are not individual explanations. Previous PostgreSQL and automated-test outcomes are documented in the audit report, but this manuscript preparation did not rerun them. Full browser, real Google consent, SMTP delivery and downloaded CSV/PDF verification remain pending. The documented migration downgrade can remove history ownership; this remains an operational limitation, not a research result.

### D. Research and demonstration separation

The saved API demonstration uses repository example payloads with temporary SQLite and is not dataset-level performance evidence. The planned public-holdout demonstration is an integration check, not a replacement for formal evaluation. No screenshots, live submissions or demonstration outcomes were generated for this draft. Existing prototype images and legacy validation JSONs are excluded from final-result tables.

## VIII. Conclusion

FraudShield's preserved experiments document validation-selected Random Forest pipelines for separate transaction-fraud and serious-delinquency tasks. Both selected models exceed the constant-prior baseline on recorded holdout F1 and AP, but miss substantial fractions of positive cases. The IEEE-CIS weighting comparison shows that the higher-validation-F1 candidate need not retain its advantage on a later partition. This finding, the distinction between trapezoidal PR-AUC and AP, and the limited evaluation scope are central to interpreting the results. Future work should address reproducibility, uncertainty, calibration, external validity and operational demonstration before stronger claims are made.

## References

[1] L. Breiman, “Random Forests,” *Machine Learning*, vol. 45, pp. 5–32, 2001, doi: [10.1023/A:1010933404324](https://doi.org/10.1023/A:1010933404324).

[2] S. Lessmann, B. Baesens, H.-V. Seow, and L. C. Thomas, “Benchmarking state-of-the-art classification algorithms for credit scoring: An update of research,” *European Journal of Operational Research*, vol. 247, no. 1, pp. 124–136, 2015, doi: [10.1016/j.ejor.2015.05.030](https://doi.org/10.1016/j.ejor.2015.05.030).

[3] A. Dal Pozzolo, G. Boracchi, O. Caelen, C. Alippi, and G. Bontempi, “Credit Card Fraud Detection: A Realistic Modeling and a Novel Learning Strategy,” *IEEE Transactions on Neural Networks and Learning Systems*, vol. 29, no. 8, pp. 3784–3797, 2018, doi: [10.1109/TNNLS.2017.2736643](https://doi.org/10.1109/TNNLS.2017.2736643). Published online in 2017; final issue year is 2018.

[4] T. Saito and M. Rehmsmeier, “The Precision-Recall Plot Is More Informative than the ROC Plot When Evaluating Binary Classifiers on Imbalanced Datasets,” *PLOS ONE*, vol. 10, no. 3, e0118432, 2015, doi: [10.1371/journal.pone.0118432](https://doi.org/10.1371/journal.pone.0118432).

[5] J. Davis and M. Goadrich, “The Relationship Between Precision-Recall and ROC Curves,” in *Proceedings of the 23rd International Conference on Machine Learning*, pp. 233–240, 2006, doi: [10.1145/1143844.1143874](https://doi.org/10.1145/1143844.1143874).

[6] Z. C. Lipton, C. Elkan, and B. Narayanaswamy, “Thresholding Classifiers to Maximize F1 Score,” arXiv:1402.1892v2, 2014, [original preprint](https://arxiv.org/abs/1402.1892v2). This reference deliberately cites the verified preprint, not an unverified conference-format substitution.

[7] “IEEE-CIS Fraud Detection,” Kaggle competition dataset, [dataset page](https://www.kaggle.com/competitions/ieee-fraud-detection/data), accessed Nov. 18, 2026. Exact attribution and redistribution terms require final verification.

[8] “Give Me Some Credit,” Kaggle competition dataset, [dataset page](https://www.kaggle.com/competitions/GiveMeSomeCredit/data), accessed Nov. 18, 2026. Target wording is supported by the local data dictionary; source-page attribution/terms remain to be checked.
