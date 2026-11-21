# Final editorial cleanup and supervisor-review freeze

Date: 18 November 2026. Status: **frozen supervisor-review editorial baseline**. This is a narrowly scoped cleanup of `../2026-11-18-ieee-final-draft/`, not a new research revision. Scientific authority remains `../2026-11-18-v2.1/manuscript-v2.1.md`. All prior versions remain unchanged.

## Changes made

| Requested item | Final action | Check |
|---|---|---|
| Abstract typography | Retained bold only on the “Abstract—” label; explicitly set the entire abstract body to regular weight at its existing size | DOCX run properties and rendered page 1 checked; Markdown uses bold label with otherwise unchanged plain body |
| Orphan [17] on page 11 | Moved the paragraph-ending citation next to “Publication permissions [17]” in the same permissions sentence | No standalone [17] line in the exported PDF; dataset-licensing citations in IV-C and IX-D retained |
| Reference [14] | Standardized the conference proceedings entry, PMLR series name, volume, pages, year and online destination; separately labeled the related arXiv:2306.14343 preprint | Same authors, title, venue, volume 216, pages 1390–1400, year 2023, proceedings URL and arXiv identifier; no invented DOI or new publication claim |
| Pagination and whitespace | Allowed regular-weight abstract reflow and kept the architecture-introduction paragraph together; retained existing paired figures, table flow and balanced final references | All 13 pages visually checked; architecture heading/preface now stays together on page 5; no forced reduction of text, plot size or page count |
| Cross-format consistency | Compared DOCX/PDF/Markdown under only the named editorial changes | All ten tables identical; original media bytes retained; exact Markdown delta contract passed |

Only `word/document.xml` differs inside the new DOCX package: four body paragraphs change (abstract typography, architecture paragraph pagination, citation placement and reference [14]). All other DOCX package parts, styles, relationships, embedded media and section geometry remain byte-identical to the approved IEEE draft. Table content and XML are untouched. The architecture paragraph's text is unchanged. The abstract's words are unchanged; Markdown's added label is typography only. Reference [14] is the sole changed bibliography entry. The IEEE numbering of all 17 entries is unchanged.

## Validation outcome

| Verification | Result |
|---|---|
| Existing files protected by before/after SHA-256 | **338 checked; zero changed or missing** |
| Git diff and index | Unchanged; new paths confined to the editorial-cleanup directory |
| Manuscript tables | **10/10 identical** in Markdown and DOCX versus the approved IEEE draft |
| Saved numerical evidence | **146 numerical CSV cells and 12 selection flags checked**, with no recomputation of experimental results |
| Numeric table strings in PDF | **155 numeric cell-string occurrences present**, including configuration/rank cells |
| Original research plots | **8/8 hash-identical** to preservation evidence and embedded DOCX media |
| Architecture figure | Existing raster preserved unchanged |
| Pending application screenshot slots | **7/7 unchanged**, still pending; no screenshot created |
| Bibliography | **17 entries**; only [14] formatting changed; all 12 DOI identifiers retained |
| Page-11 citation | No standalone [17]; permission discussion retains the citation inline |
| Final PDF | **13 US Letter pages**, matched to the new DOCX and visually reviewed |

The numerical checks compare saved strings and artifacts; no experiment, model evaluation, calibration or independent reproduction was run. The validation also checks that the Markdown differs from the approved IEEE source only by the explicit abstract label, citation relocation and reference [14] formatting. Full source wording for research questions, methodology, results, conclusions, qualifications and screenshot requests is otherwise unchanged. In particular, the unfavorable fraud validation-to-holdout reversal, historical fit uncertainty, O7a/O7b/pending O7c, unanswered PSQ1 and future O8–O10 retain their previous status.

The packaged `render_docx.py` was attempted and again reported that LibreOffice `soffice.exe` was unavailable on Windows. As in the approved draft workflow, hidden native Microsoft Word opened only the new DOCX read-only and exported the PDF; bundled Poppler rasterized it for visual inspection. No desktop LibreOffice, live application, production database or browser workflow was used. No retraining, application changes, staging, commit or push occurred.

## Freeze record and remaining boundaries

`freeze-manifest.json` records SHA-256 and sizes for the final manuscript files, this report, carried-forward screenshot/evidence register, publication-blockers checklist and unchanged architecture image. Freeze here means a versioned content baseline with verifiable hashes; the DOCX remains editable, as requested. It does not impose filesystem read-only flags or silently freeze/remove pending evidence requirements. Any subsequent authorized screenshots, author/venue decisions or factual amendments should be a separately controlled change rather than a broad rewrite of this baseline.

The carried-forward register's page assignments remain valid: tables I–X on pages 2, 3, 4, 6, 7, 7, 7, 7, 8 and 10; architecture on page 5, confusion matrices on page 8, ROC/PR pairs on page 9, importance plots on page 10 and screenshot slots on page 11. The original IEEE verification report remains historical and untouched; this report supersedes its abstract-weight description and reference [14] presentation for this new version only.

Unresolved author/venue decisions, dataset attribution/permissions, historical provenance limits and genuine application evidence remain in `remaining-publication-blockers.md`. This baseline is frozen for supervisor review, not asserted submission-ready. No further broad rewrite was performed.

## Primary manuscript SHA-256 identities

- `FraudShield-IEEE-editorial-cleanup.docx`: `e7d71a68e1ca9e121e2e514611b8ed5bc6fdab302d44ec75319f6dc168b5803d`.
- `FraudShield-IEEE-editorial-cleanup.pdf`: `57d8a40bd44ac3894071c9b2e402b3a15e80f109e336c053e074b46b12f5e714`.
- `manuscript-ieee-editorial-cleanup.md`: `11265f4d0f44091d8ade2c8fb212b324145ac6767f6aa2abe9fbdd3a3edd0121`.
