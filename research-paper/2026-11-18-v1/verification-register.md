# Outstanding verification and limitation register

No item is resolved by assertion. Saved experimental outputs are not independently reproduced findings. This register is separate from the frozen audit report.

| ID | Item | Status and effect | Minimum next step |
|---|---|---|---|
| V01 | Author identities, affiliations, funding, venue and page limit | Missing; draft intentionally leaves these unassigned | User supplies details before typesetting |
| V02 | Independent training/evaluation reproduction | Not performed; hash agreement is not reproduction | Retain qualification; request separate permission if reproduction becomes necessary |
| V03 | Original weighted fraud training lineage | Current code reuses an existing fit | Review original training provenance and training-only preprocessing; do not retrain by default |
| V04 | Historical holdout non-use | Code implements validation selection but analyst chronology is not proven | Inspect surviving logs/records if available; avoid an absolute audit claim |
| V05 | IEEE-CIS selection reversal | Saved weighted holdout F1 exceeds selected unweighted F1 | Keep explicit result; no post-hoc model replacement or unproven drift explanation |
| V06 | Metrics and legacy separation | Final CSVs/JSON identified; original JSON `pr_auc` means AP | Review every manuscript number/caption against evidence map |
| V07 | Dataset provenance and redistribution | Local public-source files and hashes preserved; release equivalence and exact terms unresolved | Verify official release/competition attribution and applicable sharing terms |
| V08 | Exact credit target dictionary wording | Existing project documentation says serious delinquency within two years | Read original XLS dictionary and cite wording before final submission |
| V09 | Credit historical split membership | New reconstruction matches algorithm, source hash and distribution; no prior ID manifest | Preserve caveat; compare historical membership if ever found |
| V10 | AP versus PR-AUC plot labels | Computation definitions verified; final-size graphics not visually signed off | Inspect eight frozen plots without regeneration |
| V11 | Statistical uncertainty | No repeated seeds, CIs or significance test | State descriptive comparison only; any new experiment requires approval |
| V12 | Probability calibration and risk-band validity | Not evaluated | Use score terminology; label bands as application conventions |
| V13 | External and temporal validity | Fraud is later same-dataset period; credit random same-dataset split | Avoid external-deployment claims |
| V14 | Fairness, subgroup performance and business cost | Not measured | Explicit limitations; do not infer lending suitability |
| V15 | Feature importance interpretation | Impurity importance only | No causal, SHAP or per-record explanation claim |
| V16 | Runtime parity | Saved full-holdout evidence tests Python inference paths, not HTTP on every row | Describe saved checks accurately; bounded live demo remains pending |
| V17 | Browser screenshots, CSV and PDF | Not performed in this stage | Review manifest/plan then authorize bounded execution |
| V18 | PostgreSQL and current regression checks | Previous outcomes documented, not rerun here | Preserve date/scope and distinguish source wiring from live results |
| V19 | History traceability | Stored rows lack model version and threshold | Log them externally during approved demonstration; no schema change |
| V20 | Migration rollback ownership loss | Documented unresolved issue | State operational limitation; no downgrade in this workstream |
| V21 | Literature completeness | Six verified foundational publications; not a systematic or current comprehensive review | Search recent primary literature and extract protocol comparability before final submission |
| V22 | Environment reproducibility | Some requirements not fully pinned | Record actual experiment environment if evidence exists; new environment is not assumed identical |
| V23 | IEEE presentation quality | Markdown content draft, no two-column DOCX/PDF/LaTeX export | Choose venue then typeset and visually verify without altering frozen artifacts |

## Review boundaries

The manuscript intentionally omits claimed latency, throughput, user-study outcomes, independent replication, state-of-the-art comparisons, causal explanations and screenshot success. No screenshots or model predictions are produced by the demonstration selection step. A separate approval is needed for live submissions and captures.
