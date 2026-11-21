# Expanded verified literature matrix

Search/verification date: 18 November 2026. This is a targeted expansion covering 2023–2026, not a systematic review. Metadata were checked on primary publisher/proceedings or original arXiv pages. “Published / peer-reviewed venue” distinguishes a journal/conference publication from a preprint; it is not an independent audit of referee quality, code, reported experiments or absence of errors. No external numerical result is imported into FraudShield's performance tables.

## Published journal and conference works

### L1 — Give Me Some Credit, imbalance and explanations

**Seongil Han and Haemin Jung.** “NATE: Non-pArameTric approach for Explainable credit scoring on imbalanced class.” *PLOS ONE*, 19(12), e0316454, 31 December 2024. **Published / peer-reviewed journal. DOI:** [10.1371/journal.pone.0316454](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0316454).

Publisher page identifies GMSC and reports five-fold cross-validation for original and resampled data, plus grid-search tuning. Relevant to explaining how preprocessing, imbalance treatment and explanation methods affect study design. It is not a matched 70/15/15 holdout comparison, and nested tuning/resampling boundaries would need further scrutiny before drawing methodological equivalence. Use in Related Work and protocol-comparability discussion, not as a directly comparable F1 benchmark. This provides task-specific recent literature absent from v1.

### L2 — Credit holdout protocols and threshold selection

**Kazım Soylu, Büşra Emek Soylu and Mehmet Serdar Güzel.** “An Explainable Hybrid Learning Framework for Cost-Sensitive Credit-Risk Modeling.” *Electronics*, 15(20), 4622, 10 October 2026. **Published / peer-reviewed journal. DOI:** [10.3390/electronics15204622](https://www.mdpi.com/2079-9292/15/20/4622).

The article includes GMSC, stratified 60/20/20 partitions across three split seeds, validation-selected thresholds and final development-set refitting. It describes an F2 operating-point objective and model-specific preprocessing. Its protocol therefore differs from FraudShield's 70/15/15, one-seed, F1 selection and retained training-only final fits. Use to motivate reporting exact split/threshold/refit policies and repeated-split limitations. Do not call F2 a measured financial cost function or compare performance as though test records were identical.

### L3 — IEEE-CIS temporal validation

**Jiaying Chen, Yiwen Liang, Jingyi Liu and Mengjie Zhou.** “Temporal Transformer with Conditional Tabular GAN for Credit Card Fraud Detection: A Sequential Deep Learning Approach.” *Mathematics*, 14(7), 1183, 1 April 2026. **Published / peer-reviewed journal. DOI:** [10.3390/math14071183](https://www.mdpi.com/2227-7390/14/7/1183).

The paper reports a chronological 70/10/20 IEEE-CIS split and temporal-sequence modeling with synthetic training examples. It is relevant to temporal evaluation and sequence-level assumptions. Its synthetic-data process, sequence construction and different holdout fraction prevent direct score comparison with FraudShield. Cite as an example of a temporal protocol, not evidence that FraudShield diagnoses drift or that this external method's reported gains have been independently replicated. Full leakage/sequence-boundary auditing of that paper is outside this review.

### L4 — Interpretable fraud, out-of-time and entity separation

**Jeongtae Kang and Keecheon Kim.** “Deployment-Oriented Interpretable Fraud Detection via Hybrid Explainable Boosting Machines with Concept–Raw Fusion on the IEEE-CIS Benchmark.” *Applied Sciences*, 16(12), 5809, 9 June 2026. **Published / peer-reviewed journal. DOI:** [10.3390/app16125809](https://www.mdpi.com/2076-3417/16/12/5809).

Publisher abstract identifies out-of-time and pseudo-entity-disjoint evaluations, multi-seed reporting and interpretable additive models. Useful for showing that temporal separation, entity separation and interpretability are distinct design choices. FraudShield has no verified entity-disjoint experiment, no matched concept features and no equivalent explanation evaluation. Do not adopt the word “causal” from the external feature-bank terminology as a claim about FraudShield's V-features. Use in Related Work and limitations.

### L5 — Class weighting

**Marina Lukashevich and Sergei Bairak.** “Weighting Strategies for Tabular and Image Data Classification.” *IET Image Processing*, 20(1), e70365, first published 6 May 2026. **Published / peer-reviewed journal. DOI:** [10.1049/ipr2.70365](https://ietresearch.onlinelibrary.wiley.com/doi/10.1049/ipr2.70365).

The publisher describes comparisons of weighting methods and cautions that inverse-frequency weighting is not consistently optimal. Use to contextualize the limited scope of comparing `balanced_subsample` with no weighting. It does not validate FraudShield's selected threshold or establish an explanation of the observed reversal. Algorithm-specific weighting details and data protocols need deeper extraction if the paper becomes central to the revised literature discussion.

### L6 — Imbalance correction and calibration

**Alex Carriero, Kim Luijken, Anne de Hond, Karel G. M. Moons, Ben van Calster and Maarten van Smeden.** “The Harms of Class Imbalance Corrections for Machine Learning Based Prediction Models: A Simulation Study.” *Statistics in Medicine*, 44(3–4), e10320, first published 26 January 2025. **Published / peer-reviewed journal. DOI:** [10.1002/sim.10320](https://onlinelibrary.wiley.com/doi/10.1002/sim.10320).

This study separates discrimination and calibration when examining imbalance corrections. Use as motivation for distinguishing classification improvement from reliable risk estimates. Its clinical/simulation setting is not financial data and does not prove miscalibration of FraudShield. V2 should say calibration was not evaluated, rather than asserting either calibration or miscalibration. Relevant to Methods metric terminology and future-work design.

### L7 — Weighting and posterior estimation

**Feng Lin, Yifan Dai and Yufeng Liu.** “On Probability Estimation for Unbalanced Classification.” *Journal of Statistical Theory and Practice*, 20, article 57, published 20 April 2026. **Published / peer-reviewed journal. DOI:** [10.1007/s42519-026-00572-5](https://link.springer.com/article/10.1007/s42519-026-00572-5).

The article studies probability-estimation effects of balancing methods, including class weighting, and probability adjustment. It supports discussing why weighting, thresholding and probability interpretation are different questions. It does not establish a specific correction for these Random Forests or justify modifying their scores without a separate experiment. Cite in calibration discussion; preserve current metrics unchanged.

### L8 — Measuring calibration under imbalance

**Takuo Matsubara, Niek Tax, Richard Mudd and Ido Guy.** “TCE: A Test-Based Approach to Measuring Calibration Error.” *Proceedings of the Thirty-Ninth Conference on Uncertainty in Artificial Intelligence*, PMLR 216, 1390–1400, 2023. **Published / peer-reviewed conference.** [Official proceedings](https://proceedings.mlr.press/v216/matsubara23a.html); related original preprint **[arXiv:2306.14343](https://arxiv.org/abs/2306.14343)**. No separate publisher DOI was verified; none is invented.

The paper proposes a test-based calibration measure designed to avoid dependence of its scale on class imbalance. Use to frame future calibration assessment as a distinct evaluation question, rather than treating ROC-AUC, F1 or a score histogram as calibration evidence. This is methodological background, not a calibration experiment completed in FraudShield.

## Preprints — not treated as peer-reviewed publications

### L9 — IEEE-CIS graph and temporal features

**Qiuwu Sha, Tengda Tang, Xinyu Du, Jie Liu, Yixian Wang and Yuan Sheng.** “Detecting Credit Card Fraud via Heterogeneous Graph Neural Networks with Graph Attention.” 11 April 2025. **Preprint; no peer-reviewed venue verified.** [arXiv:2504.08183v1](https://arxiv.org/abs/2504.08183v1); DOI 10.48550/arXiv.2504.08183.

The abstract identifies IEEE-CIS, graph attention, temporal decay, SMOTE and cost-sensitive learning. A temporal component is not proof of a leakage-controlled temporal train/test split. Treat as a candidate for critical related-work discussion only after checking its graph construction and evaluation boundaries. No external performance claim is accepted as a reproduced finding here.

### L10 — Behavioral fidelity and temporal fraud data

**Bhavana Sajja.** “Synthetic Tabular Generators Fail to Preserve Behavioral Fraud Patterns: A Benchmark on Temporal, Velocity, and Multi-Account Signals.” 13 April 2026. **Preprint; arXiv comments say submitted to DMLR, which is not acceptance.** [arXiv:2604.13125v1](https://arxiv.org/abs/2604.13125v1); DOI 10.48550/arXiv.2604.13125.

The abstract identifies IEEE-CIS and behavioral fidelity of synthetic temporal/structural signals. Useful as a research direction or counterpoint to synthetic-data claims, not a direct Random Forest benchmark. Theoretical and empirical claims require full critical reading before adoption. Do not infer that FraudShield has evaluated synthetic-data fidelity or uses synthetic training data.

## Retained foundations and coverage limits

Keep Breiman (2001), Lessmann et al. (2015), Dal Pozzolo et al. (2018 issue / 2017 online), Saito and Rehmsmeier (2015), Davis and Goadrich (2006), and the explicitly labeled Lipton et al. (2014) preprint from v1. In particular, recent empirical threshold papers do not replace Lipton's foundational theoretical role. The combination of L2, L5, L6 and L7 expands weighting/threshold/calibration context without asserting that any recent paper proves the exact cause of FraudShield's results.

Eight newly inspected works are published in peer-reviewed venues; two are verified original preprints. Distribution shift is covered through temporal/out-of-time protocol literature and the retained operational fraud study; none establishes drift in the local data. Explainability is covered by financial tasks in L1, L2 and L4, whereas L6–L8 are methodological calibration background with different experimental domains.

Some retrieved results were excluded: an IEEE streaming-ensemble lead lacked sufficiently checked publisher metadata in this session; an OpenReview PDF returned a browser-verification barrier; broader credit-review and practical-XAI leads had inaccessible primary text/metadata. News, generic repositories, unrelated competition rules and third-party summaries were not promoted into verified academic entries.

## Comparison-extraction requirements before citing results

For each selected paper, record target definition, dataset version, whether labels are released, split units/fractions/time boundaries, entity overlap, tuning nesting, resampling boundaries, final refit policy, threshold objective, metric implementation, uncertainty and code availability. Matching dataset names are insufficient. No cross-paper ranking or numerical comparison is proposed in v2 on the current extraction alone.
