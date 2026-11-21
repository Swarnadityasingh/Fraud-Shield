# FraudShield manuscript v1 academic revision assessment

Date: 18 November 2026. This is a revision assessment, not a modified manuscript or a new evaluation. Read alongside `methodology-provenance.md`, `expanded-literature-matrix.md` and `v2-change-plan.md`. No experiments, model scoring, live demonstrations, original-evidence edits or Git staging/committing were performed.

## Overall assessment

The draft is a credible starting point for a bounded empirical/application paper, but is not submission-ready. Its strongest material is the explicit validation-versus-holdout reversal, transparent metric definitions and traceable serving artifacts. Its weakest points are the narrow comparison, incomplete historical fit provenance, limited uncertainty evidence, and unfinished application demonstration. A collection of standard models and dashboard pages is not by itself a research novelty claim.

The present evidence supports a conditional methodological comparison: both artifacts have equal sample counts and identical fitted preprocessing state, and their source scripts specify equivalent training partitions. It does not establish historical row-by-row fit identity. V2 should make that distinction visible in Methods rather than hiding it solely in limitations.

## A. Methodology and internal validity

### A1. Original weighted fraud artifact

The original `Backend/app/models/ieee_cis_model.joblib` is unchanged from its Git HEAD blob. Its SHA-256 is `c3fbdd379bc809462f03fa6baa7255d5bcaa337c9983dceb1252e957abac6059`. Its last relevant Git history entry is commit `ecc09a9f96f0d8e0d45eaed79c6c586240ec17d1`, dated 9 November 2026. This demonstrates versioned artifact continuity, not a certificate of which process trained it.

The original trainer reads `train.parquet` and `validation.parquet`, derives constants and column types from training only, and calls `Pipeline.fit(X_train, y_train)`. Validation is used for prediction afterward. The research evaluator loads this fitted pipeline and reuses its weighted classifier, while fitting the unweighted clone on transformed training arrays. It does not fit both forests afresh in one run. Describe it as a reused weighted reference versus a newly fitted unweighted comparator, not a symmetric refit.

### A2. What the new inspection establishes

- Both forests record `_n_samples=413378`, `_n_samples_bootstrap=413378`, and `n_features_in_=431`.
- Fitted preprocessors have the identical `joblib.hash` value `b02953abb4a8db12cf7ffc37baae54e5`. Feature order is identical.
- Estimator parameters differ only in `class_weight` (`balanced_subsample` versus None) and `n_jobs` (-1 versus 4). Parallelism is an implementation difference, not a tuned predictive hyperparameter.
- Current processed partitions exactly match the source-ID sequences obtained by sorting the merged file and taking the split script's 70/15/15 row slices. Their time ranges are strictly separated.
- V107 has one unique training value, counting missingness as a possible value, supporting its constant-column exclusion.

These checks materially strengthen the claim of consistent preprocessing and intended training boundaries. They do not recover historical training IDs, original process logs, the exact training environment or a cryptographically bound fit manifest. File timestamps and bootstrap-root sample counts are corroboration, not historical proof.

### A3. Selection interpretation

Keep all three candidates and every final metric unchanged. The unweighted fraud forest was selected at validation F1 0.480839 versus weighted 0.444778; weighted holdout F1 was 0.444087 versus selected unweighted 0.372383. Selection and final comparison are different questions. Do not call the selected model the strongest holdout performer and do not retrospectively replace it. Distribution shift is a plausible research question, not a demonstrated explanation of this reversal.

### A4. Claims to soften

Replace a broad claim that preprocessing leakage was conclusively excluded with: the inspected scripts enforce training-only fitting, and the stored fitted preprocessors match; historical execution lineage is incomplete. Replace a claim that the holdout replay verifies the full API with: the saved replay verifies direct pipeline/classifier inference paths; HTTP examples are separate. State that the review did not rerun the recorded evaluation.

## B. Research gap and contributions

Reframe the paper around the question: how do weighting and validation-selected operating points behave across later-period fraud and random borrower holdouts, and what evidence connects those pipelines to an application? This is an empirical question, not an assertion of an unfilled field-wide research gap.

Proposed contribution framing:

1. A precisely specified, artifact-backed comparison of two weighting variants with validation-selected thresholds on two separate tasks.
2. An explicit report of the fraud selection reversal and the distinction between threshold-dependent and ranking measures.
3. A traceable implementation demonstration, only after genuine persistence and screenshots are completed.

Do not claim unified risk modeling, algorithmic novelty, SOTA, calibrated risk or validated real-world financial decisions. Until the live demonstration is complete, the third item is implementation scope rather than completed empirical evidence. Recent work already addresses interpretable financial models and temporal evaluation; the manuscript must explain its narrower contribution without claiming those themes are novel.

## C. False positives, false negatives and operating implications

The saved fraud confusion matrix contains 2,398 false alerts and 1,829 missed fraud observations, with 1,254 detected positives. The credit matrix contains 1,037 false positive labels and 792 missed positive outcomes, with 712 detected positives. Explain these concretely in the results discussion, not just as metric abbreviations. In credit, the positive target is serious delinquency; it should not silently become a broader definition of default.

False fraud alerts could impose review burden and missed fraud could leave suspicious events unidentified, but this study measures neither labor nor monetary loss. Credit false positives are incorrect delinquency classifications in this dataset; they are not observed loan denials, and false negatives are not observed financial losses. No utility or policy conclusion follows without costs, interventions and operational data.

F1 weights precision and recall symmetrically but does not encode institution-specific costs. Thresholds should be called validation-selected F1 operating points, not economically optimal thresholds. The display bands remain unvalidated UI conventions. An API score displayed as a probability is not evidence of calibration.

## D. Dataset provenance and licensing

Preserved raw-file hashes establish the exact local inputs. They do not establish authenticity against a separately obtained official release. Cite each competition and distinguish its labeled source training set from the internal holdout and competition test set. Credit's exact XLS target wording still needs a read-only dictionary check.

The retrieved [IEEE-CIS competition rules](https://www.kaggle.com/c/ieee-fraud-detection/rules), section 7, permit noncommercial academic use while also imposing restrictions on onward sharing of competition data. Public availability is not a blanket redistribution license. Before distributing full demo payloads, input screenshots or raw/processed data with a paper, verify the applicable specific terms and permission. This is an identified publication-permission question, not a finding that the present private backup is unlawful. No deletion or change is proposed here. Give Me Some Credit-specific rules were not verified; generic rules returned by search for other competitions must not be substituted.

A public reproducibility package can describe hashes, selection rules, schema and authorized acquisition instructions while the raw-data-sharing position is resolved. Do not automatically publish the existing private backup or its real-record payloads.

## E. Reproducibility and evidential presentation

Retain the evidence hierarchy: saved CSV rows for results; fitted artifacts for configuration; scripts for procedural claims; audit narratives for earlier verification outcomes. Put local absolute machine paths in private provenance rather than the final paper. In the paper, use stable artifact identifiers, relative paths, source versions and checksums. Clearly distinguish SHA-256 file hashes from the version-dependent `joblib.hash` object fingerprint.

V2 should include the actual temporal ranges, feature counts, reuse/refit asymmetry, dtype/container differences, threshold grid and tie rules. Separate a read-only source/structure audit from independent experimental reproduction. Do not imply that a present-day requirements file fully reconstructs the historical environment. No per-record frozen holdout score export, historical fit-row manifest or full environment lock has been established.

Keep PR-AUC and AP separate. The prior baseline's large trapezoidal PR area is an integration artifact, not useful ranking. Add a direct note beside its comparison table. Global impurity importance is not a substitute for individual explanations, stability analysis or fairness assessment.

## F. Discussion and future work

Organize discussion around the selection reversal, minority-class errors, protocol differences and the gap between a deployed prototype and validated operational utility. Group future work into uncertainty, calibration, stronger matched baselines, external/temporal validation, explanation stability and operational evidence. Do not list these as completed contributions or promise they are needed for every conceivable venue.

Calibration and uncertainty studies would require separately authorized analysis on suitable partitions. Do not repeatedly tune on the exposed holdout or overwrite frozen results. Keep versioned follow-up experiments separate if approved later. Stronger baselines and repeated-seed studies could improve a research submission, but are recommendations only, not authorized actions in this review.

## G. Publication readiness

My assessment is that v1 is not ready for an IEEE conference or journal submission. After revision it may be suitable for consideration as a limited empirical/application contribution at a venue whose scope matches the work; no venue has been selected and no acceptance prediction is made. Journal suitability is especially uncertain without a stronger original contribution, broader controlled comparisons or deeper analysis. A workshop or application-oriented conference is not automatically suitable merely because requirements may differ.

IEEE's [peer-review guidance](https://conferences.ieeeauthorcenter.ieee.org/understand-peer-review/) explicitly includes originality and advancement. Its [submission guidance](https://conferences.ieeeauthorcenter.ieee.org/author-ethics/guidelines-and-policies/submission-policies/) distinguishes stages of research maturity; venue-specific instructions still govern scope and format. Author identity, affiliation, contributions, funding/conflict declarations, publication originality, target scope, page limit, anonymization, template, figure readability and data permissions remain unconfirmed. Relevant [journal checklist](https://journals.ieeeauthorcenter.ieee.org/create-your-ieee-journal-article/authoring-tools-and-templates/checklist-for-creating-your-article/) items should be assessed after venue selection.

## Decision requested

Approve or revise the text-only v2 plan before `manuscript.md` is edited. Live evidence collection and any new experiment remain separately gated. The priority is more precise claims and stronger literature positioning using existing evidence, not cosmetic application work.
