# Manuscript V2 Validation Report

Date: 18 November 2026. Validated deliverables are `manuscript-v2.md`, `v2-evidence-crosswalk.md` and `remaining-publication-gaps.md`, with this report completing the four-file V2 package. Validation consists of document/source comparisons, checksum checks and limited visual inspection of existing plots. It is not training, model inference, performance recomputation, an application test run or an independent experimental replication.

## 1. Outcome

The manuscript is content-complete and consistent with the approved revision specification at the reviewed scope. It contains an Abstract, Sections I–XI, ten tables, one source-derived architecture schematic, eight references to original experimental plots arranged under four paired captions, and seventeen bibliography entries. All fourteen approved section plans are mapped in the crosswalk. This does not certify publication readiness, complete historical lineage, dataset-sharing rights, external-paper reproducibility or live application correctness.

The manuscript has **6,781 whitespace-delimited words**, including tables and references. Its validated SHA-256 is `e2b6b2d36804775c7a70c86fa9f078ce16387fbca01d7d7a6c4dc972c50c1267`.

## 2. Numerical and table validation

All quantitative table values below were read from the preserved package's existing CSV strings, rather than calculated from predictions or labels. The numerical checker also requires corresponding repository CSVs to match the preserved copies by SHA-256. Matching a saved number verifies transcription, not whether the original experiment was correctly executed.

| Check | Result | Scope |
|---|---|---|
| Table III distributions | Passed | All six rows and all stored count/prevalence strings |
| Table V selected metrics | Passed | Both selected thresholds and seven metrics each; full stored strings |
| Table VI validation points | Passed | Six existing candidate/threshold rows, precision/recall/F1 and selection flags; no threshold optimization rerun |
| Table VII operating metrics | Passed | Six candidate identities, thresholds, accuracy/precision/recall/F1 and selection flags |
| Table VIII ranking metrics | Passed | Six candidate ROC-AUC, trapezoidal PR-AUC and AP rows |
| Table IX confusion counts | Passed | All six TN/FP/FN/TP rows |
| Table X feature coefficients | Passed | Five existing ranks per task, exact feature names and coefficient strings |
| Selected CSV versus replay JSON | Passed | Thresholds, seven metrics and four confusion counts for each task |
| Numeric table cells checked exactly | **146** | Includes distributions, operating/ranking metrics, thresholds, confusion counts and feature coefficients; rank indices excluded from this count |
| Selection flags checked | **12** | Six repeated flags in each of Tables VI and VII |
| Numbering / Markdown row widths | Passed | Tables I–X appear once, in order; each table has consistent column counts |

The Abstract's selected precision/recall/F1 values were checked as six-decimal renderings of the saved rows. Narrative interpretation preserves fraud validation F1 0.480839 unweighted versus 0.444778 weighted, and holdout F1 0.372383 versus 0.444087. Full precision remains in the tables. No candidate, threshold, metric or artifact was replaced. Legacy validation/prototype metrics were not used as final-holdout results.

## 3. Factual and methodology review

| Claim group | Reviewed source | Outcome and limitation |
|---|---|---|
| Task definitions, feature counts and partitions | E07–E09, E13, E15 | Separate fraud/credit targets and 431/10 inputs retained; exact credit dictionary wording remains pending |
| Fraud fit provenance | E08, E15 | Weighted reference reuse and unweighted refit disclosed; matching preprocessing/sample dimensions do not prove historical row identity |
| Training-only boundaries | Original trainer/evaluator and E15 | Source-enforced boundaries reported; historical execution not certified |
| Temporal structure | E15 prior read-only split check | Exact relative-time boundaries retained; not converted to calendar dates or promoted to drift evidence |
| Credit membership | E16 reconstruction record | Source/algorithm/count agreement qualified by absence of a historical membership manifest |
| Threshold/metric definitions | E08, E09 | Grid, tie rules, forest-only selection and separate AP/trapezoidal-area computations retained |
| Runtime integration | E01–E06 | Described as inspected implementation; no new runtime-success claim |
| Replay scope | E08, E09, E11 | Direct holdout pipeline/classifier replay distinguished from temporary-SQLite TestClient examples |
| Environment | E18, E19 and E11 | Current installed/lockfile versions and prior PostgreSQL audit separated from unknown historical training environment; no hardware invented |
| Historical tests/database checks | E11 | Labeled as earlier reported outcomes, not rerun or browser evidence |
| Research gap and contributions | Approved specification; E20, E22 | Project-specific empirical/application contribution, not algorithmic novelty or an unfilled universal gap |

The available academic review is cited without claiming that a separately identifiable independently authored audit was supplied. Dataset release authenticity and redistribution completeness are not silently filled in. No author, affiliation, funding declaration or institutional outcome was invented.

## 4. Citation and evidence-reference checks

The bibliography contains **17 sequential entries**, all cited in the manuscript, with no unresolved numeric citation. **Twelve DOI strings** match previously verified reference material. The source material used for that check is V1's references/literature notes and the expanded literature matrix, not a newly claimed live verification of every publisher link.

Lipton et al. is explicitly the verified arXiv preprint, not a mislabeled conference entry. Matsubara et al. uses verified UAI/PMLR metadata and separately identifies its related arXiv record without inventing a publisher DOI. Three bibliography entries are official data/rules sources, not peer-reviewed experiments. Published works and preprints are distinguished; no acceptance claim is made for unverified leads.

All manuscript E-identifiers use the consolidated **E01–E22** namespace and resolve to the crosswalk's 22-entry register. No old one-digit E1–E12 marker remains. The crosswalk reconciles V2 numeric citations to earlier L/R labels so that identical numbers in different documents are not silently assumed equivalent.

Metadata consistency is not a certification of external research quality. The literature synthesis is targeted, not systematic; external numerical scores are not used as a matched leaderboard. Dataset attribution/rights and final source-link checks remain listed in the publication gaps.

## 5. Figure and cross-reference checks

| Figure check | Result |
|---|---|
| Eight original plot links | All resolve to existing repository PNGs |
| Original-image integrity | PNG integrity checks pass; image SHA-256 values match preservation inventory |
| Experimental plots regenerated | None |
| PR legend interpretation | Both original PR images visually inspected; legends report rounded **AP**, consistent with Figure 4 caption and separate PR-AUC/AP table |
| Figure caption groups | Five: source-derived Figure 1 plus four paired groups for eight saved images |
| Architecture diagram | Mermaid schematic inspected against independent inference/auth/history/report code paths; not represented as a screenshot |
| Pending application screenshots | No images inserted, no invented outcomes and no completed figure numbers assigned |
| Final column-width/layout review | Not performed; remains venue-dependent |

Table/figure references identify distinct objects. ROC/PR/confusion/importance groups use the correct files, and the figure inventory records both task-specific source paths. No legacy prototype graphic is substituted. The manuscript remains Markdown; no rendered IEEE two-column layout or PDF-quality claim is made.

## 6. Approved-specification and safeguard checks

The crosswalk maps all **14 approved section plans** to V2 destinations. O1–O7 appear in the current-study objective table with actual completion qualifications. RQ1–RQ4 are explicit, and RQ4 remains pending. O8–O10 appear only as prospective objectives in Future Work, not as completed achievements.

Manual content review and text checks confirmed retention of the required boundaries: class imbalance is not solved; no SHAP/local-XAI claim; shared architecture is not fused modeling; exact historical weighted-fraud training rows remain unproven; current versions are not historical versions; no drift detector/adaptive retraining is claimed; no live screenshot, CSV/PDF success or publication readiness is asserted. False positive/negative interpretations remain dataset classifications rather than measured losses or loan decisions.

## 7. Preservation and Git checks

A pre-drafting checksum snapshot covered **394 existing files**: preserved repository originals, all pre-existing research-paper documents and the preservation package files. Post-drafting checks found **zero changed or missing protected files**. In particular, V1, the approved specification, the consolidated study, model files, datasets, saved metrics and plots retained their hashes.

The Git diff against HEAD, Git index hash and existing porcelain status matched the pre-drafting snapshot. The existing untracked `research-paper/` directory contains the new V2 files; no staging, committing or pushing occurred. Only the new V2 package and temporary validation helpers outside the project were written. No database, application runtime or browser was operated.

## 8. Unresolved claims and decisions

`remaining-publication-gaps.md` records only unresolved evidence, permission or author/venue decisions. The principal limits remain historical fit/environment provenance, official dataset identity/rights, exact credit dictionary wording, genuine live integration evidence and final typesetting/figure readability. Independent reproduction and stronger uncertainty/calibration/external-validity results are not established. They may remain honest scope limits or require separately authorized work; they are not supplied through invented claims.

**Validation conclusion:** the V2 content and mappings satisfy the approved revision scope at the existing-evidence level. This conclusion concerns internal documentary consistency and preservation, not experimental replication, live-system validation or publication acceptance.
