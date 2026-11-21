# Bounded application demonstration execution plan

**Status: planning and data preparation only. Separate approval is required before any live submissions or screenshots.** No API calls, accounts, database changes, inference, downloads or browser actions are performed by the manifest helper.

## Review gate

Review `demo-selection-manifest.json` and four accompanying payload files first. The manifest records source IDs, true labels as metadata only, partition checks, artifact hashes, source hashes, environment and payload hashes. `prepare_demo_manifest.py` is inspectable and uses only dataset reads, deterministic splitting and model metadata reads. It creates outputs exclusively, refusing to overwrite them.

Selection rule: for each true class 0 and 1 in each existing holdout, select the smallest numeric source ID. This is label-stratified illustrative selection, not random sampling or score-based cherry-picking. A true positive-class label does not promise a positive prediction. Do not replace unfavorable predictions to improve screenshots.

The credit membership reconstruction follows the preserved evaluator's two-stage stratified seed-42 split. Matching source hashes, disjointness, complete coverage and saved class counts support this reconstruction; there is no earlier persisted ID-membership manifest with which to establish direct historical equality. The new membership digests document this reconstruction only.

## Bounded run after approval

1. Verify current application source and model hashes against the reviewed baseline; report differences before proceeding. Confirm real API/frontend services, PostgreSQL target and migration revision through read-only checks. Do not run migration or test helpers that mutate the database as setup shortcuts.
2. Use an existing authorized verified account. If no suitable account/session exists, request the user's normal login or separate authorization for account setup. Do not insert fabricated users, bypass email verification or inject authentication tokens. Exclude credentials and personal account details from captures.
3. Record a consistent baseline of owner-scoped history IDs and model/class/risk counts. Use read-only database queries or authenticated API responses tied to the current user, without exposing tokens. Distinguish initial rows from demonstration additions.
4. Submit exactly the four reviewed inputs through the actual UI: two fraud JSON records and two credit forms. For credit, populate each of ten fields from its payload; leave JSON-null observations blank. Never submit target labels or source IDs as model inputs.
5. For every response, privately record returned history ID/time, score, class, display risk, threshold and artifact hash. Verify the backend's actual saved row and authenticated individual-history response match it. No manual INSERT, UPDATE or direct creation of history records is permitted.
6. Require exactly four new owned rows if all four requests succeed once. Stop if saving fails or results cannot be reconciled. Before retrying an ambiguous timeout, inspect history to avoid duplicate submissions. Do not delete unexpected rows; report them and distinguish them from the intended four.
7. Reconcile Dashboard and Analytics against all actual owned rows, including pre-existing records. Check per-model total/flagged counts and Low/Medium/High counts. If concurrent activity changes counts, take a new checkpoint and document it rather than editing records.
8. Check History and each Reports filter. Download the actual CSV and compare its header, row count, IDs, model types, scores and order with the active report. CSV columns currently are `id,created_at,model_type,prediction,probability,risk_level`.
9. Open Print / Save PDF from Reports, inspect preview, save and open the real PDF. Verify the selected filter and records are represented without clipping. Use an output directory approved for demonstration evidence; preserve all originals.
10. Capture only after actual results are visible. Store browser/version, viewport, date/time, user alias, record IDs and verification outcome. Avoid visible email addresses, tokens, passwords, developer-tool authorization headers or unrelated personal data.

## Screenshot acceptance checklist

| Capture | Evidence required |
|---|---|
| Dashboard | Persisted rows exist; totals reconcile to the current owner checkpoint |
| Fraud input/result | 431 keys verified; actual score/class/risk and saved ID visible |
| Credit input/result | Ten real inputs from selected record; actual output and saved ID visible |
| Analytics | Model, flagged and risk-band counts match persisted owned rows |
| History | All four resulting IDs reconcile to saved rows; individual API retrieval matches |
| Reports | Both/Fraud/Credit filters contain the correct record sets |
| CSV | Genuine downloaded file opened; contents match filtered records |
| Print/PDF | Genuine preview and saved/opened PDF verified |

The minimum run is four predictions and the listed checks. Additional users, cross-user browser checks, mobile captures, authentication-provider consent and SMTP testing are outside this bounded run unless separately authorized. Source inspection and previous automated isolation tests must not be relabeled as new live evidence.

## Stop conditions and interpretation

Stop for browser-policy blocks, unavailable authorized login, model hash mismatch, invalid membership/schema, failed persistence, unreconciled counts or privacy exposure. Record exact blockers; do not bypass safeguards. An incorrect model outcome is a valid demonstration result, not a reason to fabricate a replacement. Do not calculate aggregate demo accuracy or add these four rows to frozen research evaluation tables.
