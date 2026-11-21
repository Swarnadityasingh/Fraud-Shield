# Literature verification and review notes

Reviewed on 18 November 2026. Six academic works support the current manuscript. Bibliographic entries appear in `references.bib` and the manuscript reference list. This is a foundational review with verified sources, not a claim of systematic coverage or full-text review of every cited article.

| Ref | Identity and metadata | Accessible verification source | Claim scope |
|---|---|---|---|
| 1 | Leo Breiman, Random Forests, Machine Learning 45, 5–32, 2001; DOI 10.1023/A:1010933404324 | [Publisher metadata](https://doi.org/10.1023/A:1010933404324) and [author's Berkeley manuscript](https://www.stat.berkeley.edu/~breiman/randomforest2001.pdf) | Randomized tree ensembles; no claim the present implementation is novel |
| 2 | Stefan Lessmann, Bart Baesens, Hsin-Vonn Seow, Lyn C. Thomas; EJOR 247(1), 124–136, 2015; DOI 10.1016/j.ejor.2015.05.030 | [Publisher metadata and abstract](https://www.sciencedirect.com/science/article/pii/S0377221715004208) | 41 classifiers, eight credit datasets; methodological context, not matched numerical comparison |
| 3 | Andrea Dal Pozzolo, Giacomo Boracchi, Olivier Caelen, Cesare Alippi, Gianluca Bontempi; IEEE TNNLS 29(8), 3784–3797, 2018; DOI 10.1109/TNNLS.2017.2736643 | [IEEE metadata](https://ieeexplore.ieee.org/abstract/document/8038008) verified during the preceding evidence review; [author manuscript](https://dalpozz.github.io/static/pdf/TNNLS_2017.pdf) opened in this stage | Operational imbalance, drift and delayed labels; not evidence that drift caused FraudShield's observed reversal |
| 4 | Takaya Saito, Marc Rehmsmeier; PLOS ONE 10(3), e0118432, 2015; DOI 10.1371/journal.pone.0118432 | [Publisher article](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0118432), [printable article](https://journals.plos.org/plosone/article/file?id=10.1371%2Fjournal.pone.0118432&type=printable) | PR interpretation in imbalance; do not conclude ROC-AUC is universally invalid |
| 5 | Jesse Davis, Mark Goadrich; ICML 2006, 233–240; DOI 10.1145/1143844.1143874 | [Author-hosted camera-ready paper](https://mark.goadrich.com/articles/davisgoadrichcamera2.pdf); conference/DOI metadata cross-checked during Phase 2 | PR/ROC relationship and interpolation; explicitly identify the project's trapezoidal calculation |
| 6 | Zachary Chase Lipton, Charles Elkan, Balakrishnan Narayanaswamy; Thresholding Classifiers to Maximize F1 Score; arXiv:1402.1892v2, 2014 | [Original arXiv metadata/abstract](https://arxiv.org/abs/1402.1892v2) | F1 threshold theory; calibrated-score conditions are not assumed to hold for this project |

Direct DOI/publisher opens sometimes returned 403/418/500 errors in this stage. Accessible publisher search excerpts and author-hosted original manuscripts were used as noted; an inaccessible full text is not represented as fully reviewed. Reference 3 uses the 2018 final issue year, while noting 2017 online publication. Reference 6 intentionally remains the verified arXiv preprint rather than mixing its title with the final conference version.

## Dataset references

- [IEEE-CIS official competition data page](https://www.kaggle.com/competitions/ieee-fraud-detection/data).
- [Give Me Some Credit official competition data page](https://www.kaggle.com/competitions/GiveMeSomeCredit/data).

The links are recorded, but readable official descriptions and license/redistribution text were not obtained in the preceding page-open attempt. Project-derived row counts come from frozen evidence, not from an assumed official-page quotation. Exact credit XLS dictionary wording still requires a read-only check; the installed Python environment has no `xlrd`, and no dependency was installed. Do not claim the dictionary was parsed in this stage.

## Further review before submission

Search recent primary publications on IEEE-CIS validation/leakage, temporal fraud evaluation, credit-risk tabular benchmarks, calibration, class weighting and threshold selection. Record title, authors, DOI, publication/version, dataset, target, split, leakage controls, feature processing, threshold protocol, metrics, uncertainty and code availability. Exclude unverifiable works and distinguish preprints from peer-reviewed versions. Do not copy reported benchmark scores into a comparison table unless the evaluation protocols are genuinely comparable.
