# Proposed manuscript v2 changes and readiness gates

This is a plan only. `2026-11-18-v1/manuscript.md` must remain unchanged until separately approved. No new experiment, application modification or live demonstration is authorized by this document.

## Priority 0 — Accuracy and provenance corrections using existing evidence

| Section | Proposed text-level change | Evidence / acceptance condition |
|---|---|---|
| Abstract | Keep selected scores and reversal; distinguish saved experimental findings from present review checks in one concise sentence | No suggestion that this review reproduced training |
| Introduction | Frame an empirical weighting/selection and artifact-traceability question, not a field-wide novelty gap | Claims align with measured comparison and current implementation evidence |
| Datasets | Add exact relative-time boundaries and source acquisition/hash description; distinguish internal labeled holdout from competition test files | Provenance report table; no conversion to real dates |
| Methods | State weighted artifact reuse versus unweighted refit, matching stored preprocessing and sample dimensions, and remaining historical row-ID uncertainty | Use proposed wording in methodology report |
| Methods | Disclose DataFrame/Pipeline versus float32 transformed-memmap fitting paths and parallelism; do not label the experiment a fully symmetric fresh refit | Source lines and artifact metadata |
| Results | Keep all metrics unchanged; retain explicit validation-to-holdout reversal | CSV values and validation selections unchanged |
| Results | Explain 2,398/1,829 fraud FP/FN and 1,037/792 credit FP/FN in task-specific terms | No invented business cost, loan-decision or loss figures |
| Results | Place AP/trapezoidal-area caveat beside baseline results | Metric definitions and source field names explicit |
| Discussion | Distinguish chronological row separation from entity-disjoint validation and formal drift evidence | No causal diagnosis or external-validity inference |

## Priority 1 — Literature and reproducibility

- Add a compact protocol-comparison table using the verified literature matrix. Prefer L1–L8 as appropriate; include L9/L10 only if their preprint status and actual relevance are made explicit after deeper reading. Do not add references merely to inflate the count.
- Contrast five-fold GMSC evaluation, alternative stratified holdouts and chronological fraud protocols without comparing unmatched numerical scores.
- Use calibration literature to explain what was not measured. Distinguish class weighting, decision thresholds, calibrated posterior estimates and UI risk bands.
- Retain global impurity importance terminology; contrast with financial explainability studies without claiming local explanations were implemented.
- Move machine-specific absolute paths and internal evidence IDs to a private/supplementary mapping. Retain relative reproducibility instructions and checksum identifiers.
- Keep historical dependencies, training lineage, split membership and dataset release authenticity as explicit open items where evidence is missing.

## Priority 2 — Dataset permissions and final submission package

Before public distribution, verify dataset-specific attribution and rights for raw data, processed data, real-record input screenshots and payloads. The retrieved IEEE-CIS rules contain data-sharing restrictions; credit-specific permission remains unresolved. Do not publish the private preservation package automatically. No change to existing private files is proposed by this review.

Confirm authorship, affiliations, contributions, funding/conflicts, prior dissemination, target venue and manuscript category. Then check the venue's actual scope, originality criteria, review/anonymization policy, page count, template, figures, references and artifact requirements. No venue or acceptance readiness is assumed.

## Publication-readiness gates

| Gate | Present assessment | Can be addressed without new experiments? |
|---|---|---|
| Defensible contribution and recent positioning | Major revision required | Yes, subject to honest scope; a stronger journal contribution may need more |
| Methodology clarity | Stronger source/artifact checks now available, but history incomplete | Yes for disclosure; historical facts may remain unresolved |
| Numerical consistency | Saved tables established; no changes recommended | Yes |
| Historical independence/reproduction | Not established | Cannot be solved by wording; either qualify or seek separately authorized verification |
| Uncertainty and broader baselines | Missing | New analysis/experiments would need separate approval |
| Calibration, external validation, subgroup performance | Not measured | Can remain limitations; adding results requires separate work |
| Genuine application evidence | Pending | Requires separate live-demo approval |
| Dataset permissions | Incomplete | Read-only verification/permission review first |
| Formatting and figure readability | Not venue-reviewed | After venue and content decisions |
| Authorship and declarations | Unconfirmed | User input required |

## Suggested order after approval

1. Revise prose and literature positioning into a separate v2 draft while retaining v1.
2. Review claims and tables against frozen evidence; do not regenerate results.
3. Resolve dataset attribution/permission and author/venue information.
4. Seek the separately required demonstration approval if application evidence remains in scope.
5. Decide whether venue expectations justify requesting new analyses; do not quietly add them.
6. Typeset and visually review only after content and venue requirements are settled.

**Readiness conclusion:** text revision can substantially improve v1, but it is not presently ready for conference or journal submission. A venue-matched application/empirical submission may be possible after these gates; a journal claim of substantial original research is not established by the current package. No acceptance prediction is made.
