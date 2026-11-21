# IEEE formatting and reference verification report

18 November 2026. Scope: manuscript preparation, transcription, typesetting and local document verification. This report does not certify experimental reproduction, a live application demonstration, a target venue's acceptance criteria or submission readiness.

## 1. Scientific source and editorial changes

The sole current scientific manuscript is `../2026-11-18-v2.1/manuscript-v2.1.md`, SHA-256 `14699dc3ae64abd3de86f78184c9995d560238d88ef1769b9cebb2cb51b61002`. Its V2.1 change log and validation report were consulted along with the protected V2 evidence crosswalk, publication-gap register and saved CSV/JSON/PNG evidence. V1/V2 are historical evidence sources only; neither replaces V2.1 as the current manuscript.

The final Markdown retains the complete substantive V2.1 body, with the following explicit presentation changes: author/affiliation/venue placeholders and supervisor-review note; IEEE citation-number ordering; rendering the existing architecture topology; seven textual pending screenshot slots; an evidence-availability note; and replacing the historical phrase “Neither recorded check is rerun for V2” with “Neither recorded check is rerun for this formatting draft.” The declaration that no completed screenshot is inserted now also identifies the pending editorial slots. No research meaning, saved metric, candidate, threshold or limitation is silently changed. Existing section order and Roman I–XI labels are retained because they already cover the requested structure; methodology and experimental setup remain combined in Section VI. No author, institution, funding or target venue is invented.

The editable DOCX uses the same scientific source. Markdown emphasis is typeset; long identifiers receive invisible wrap opportunities only in DOCX. Bibliographic web/preprint URLs are additionally printed in DOCX/PDF as “[Online]. Available”; existing DOI identifiers remain visible. This makes link destinations explicit without claiming new metadata. The caption prefix is abbreviated to “Fig.” in DOCX/PDF, while the Markdown retains V2.1's “Figure”.

## 2. Template provenance and formatting

IEEE's [Author Center](https://conferences.ieeeauthorcenter.ieee.org/write-your-paper/authoring-tools-and-templates/) directs authors to its conference templates. The [IEEE conference template page](https://cai.ieee.org/2025/manuscript-templates-for-conference-proceedings/) links the generic US Letter Word template. No target conference is selected by consulting that page.

The main `www.ieee.org` DOCX endpoint returned HTTP 202 with `x-amzn-waf-action: challenge` and zero content. An IEEE-hosted copy was successfully retrieved from [IEEE conference hosting](https://attend.ieee.org/e12-2025/wp-content/uploads/sites/684/conference-template-letter.docx), retained under `support/ieee-conference-template-letter.docx`, SHA-256 `4589779a1a74782dc5a7a657a9907f243c9dd54510cb6c154acaf24cc9079852`. This is the actual template used; byte identity with the blocked main download cannot be independently certified. The retained original is strict OOXML. Hidden native Microsoft Word converted a separate copy to transitional OOXML for editing; the original remains unchanged. All three reference pages were inspected. The task-local template contract and package-part inventory are in `support/artifact.md` and `support/template-package-inventory.json`.

| Layout item | Verified implementation |
|---|---|
| Page | US Letter, 612 × 792 PDF points (8.5 × 11 in), all 13 pages |
| Margins | Source body section: top 0.75 in, bottom 1 in, left/right 0.629861 in |
| Main text | Two equal columns, 0.25 in gap; full-width title and author placeholder block |
| Type | Source Times New Roman body 10 pt; title 24 pt; author 11 pt; Abstract 9 pt; caption/table/reference roles 8 pt |
| Headings | Explicit Roman I–XI major sections, lettered italic subsections; inherited auto-numbering disabled where manual labels are used |
| Tables | Ten editable tables, caption above; full width to retain exact stored precision, repeating headers |
| Figures | Caption below; explicit (a)/(b) labels for the four paired groups; eight original plots and one source-derived architecture raster |
| References | 17 bracket-numbered entries; hanging indents and first-citation ordering; bibliography identities preserved |
| Header/footer | No invented conference/copyright/funding marking or page numbering; template example footer is unlinked |
| Final proof | 13 pages, reviewed page by page; no observed clipping, overlap, split numeric strings, stranded result heading or duplicate figure number |

Source styles, numbering definitions, themes and preserve-only opaque package parts were retained byte-for-byte from the converted reference. Content/section count changes are intentional: source author-count instructions allow the placeholder block; large tables/figures span both columns, as the template permits. The final references are balanced and each bibliographic entry remains together. This is a generic template proof, not a venue-specific page-limit or anonymity check.

## 3. Numerical, factual and preservation checks

| Check | Result |
|---|---|
| CSV-string transcription | 146 numerical cells matched preserved distributions, operating/ranking metrics, confusion counts and feature coefficients |
| Selection flags | 12 flags checked against the saved candidate records |
| All manuscript tables | All ten tables matched V2.1 after citation-number mapping; DOCX cell text matched final Markdown |
| PDF numeric coverage | 155 numeric cell-string occurrences checked present in extracted PDF text, including configuration/rank cells |
| Selected rows | Existing selected CSV values agreed with saved replay JSON; no performance recalculation |
| Source text retention | 225 substantive V2.1 body lines retained under the stated citation/editorial transformations |
| Research images | Eight original hashes matched preservation package and embedded DOCX media bytes |
| Bibliography | 17 identities, 12 DOI strings and preprint/proceedings qualifications retained |
| Existing repository files | 240 protected files hashed before and after; zero changed or missing |
| Git | Starting diff and index SHA unchanged; new paths confined to the authorized final-draft directory; no staging/commit/push |

Thresholds remain 0.21/0.23. The validation-selected unweighted fraud forest remains selected despite weighted holdout F1 being higher. Full stored result strings and confusion counts remain unchanged. Class imbalance is only partially addressed; no SMOTE, local/SHAP explanation, calibrated probability, fused predictor, concept-drift detector or causal explanation is claimed. Historical weighted-fraud training-row identity remains unproven. Current environment versions remain distinct from historical training versions. RQ1–RQ3 have saved-evidence-bounded answers, while O7a, O7b and pending O7c/PSQ1 remain distinct. O8–O10 remain future only. Dataset attribution, source authenticity and redistribution qualifications remain explicit. Abstract rounding is inherited unchanged from V2.1, with full precision in the tables.

## 4. Citation and bibliographic reconciliation

Citation numbers were reordered by first appearance, not by apparent importance or date. The following mapping is required when consulting the unchanged older crosswalk. Every mapped bibliography entry retains its V2.1 text/metadata. E identifiers are internal artifact evidence, separate from numbered academic references.

| Final number | V2.1 number | Reference identity | Verification basis and qualification |
|---|---|---|---|
| [1] | [4] | Saito and Rehmsmeier; precision–recall interpretation | E21/E22 and unchanged V2.1 bibliography; previously verified publication metadata |
| [2] | [5] | Davis and Goadrich; PR/ROC relationship | E21/E22 and unchanged V2.1 bibliography; previously verified publication metadata |
| [3] | [6] | Lipton et al.; F1 thresholding | E21; explicitly arXiv:1402.1892v2 preprint, not a newly verified proceedings version |
| [4] | [1] | Breiman; Random Forests | E21/E22 and unchanged V2.1 bibliography; previously verified publication metadata |
| [5] | [2] | Lessmann et al.; credit-scoring benchmark | E21/E22 and unchanged V2.1 bibliography; previously verified publication metadata |
| [6] | [3] | Dal Pozzolo et al.; realistic fraud modeling | E21/E22 and unchanged V2.1 bibliography; previously verified publication metadata |
| [7] | [11] | Lukashevich and Bairak; weighting strategies | E21/E22 and unchanged V2.1 bibliography; previously verified publication metadata |
| [8] | [7] | Han and Jung; NATE | E21/E22 and unchanged V2.1 bibliography; previously verified publication metadata |
| [9] | [8] | Soylu et al.; hybrid credit-risk modeling | E21/E22 and unchanged V2.1 bibliography; previously verified publication metadata |
| [10] | [9] | Chen et al.; temporal Transformer/CTGAN | E21/E22 and unchanged V2.1 bibliography; previously verified publication metadata |
| [11] | [10] | Kang and Kim; interpretable fraud/EBM | E21/E22 and unchanged V2.1 bibliography; previously verified publication metadata |
| [12] | [12] | Carriero et al.; imbalance corrections | E21/E22 and unchanged V2.1 bibliography; previously verified publication metadata |
| [13] | [13] | Lin et al.; probability estimation | E21/E22 and unchanged V2.1 bibliography; previously verified publication metadata |
| [14] | [14] | Matsubara et al.; TCE | E22; official PMLR proceedings; related preprint distinct; no invented DOI |
| [15] | [15] | IEEE-CIS official data page | E13/E20/E22; official competition link; permission/attribution completeness remains qualified |
| [16] | [16] | Give Me Some Credit official data page | E13/E20/E22; official competition link; permission/attribution completeness remains qualified |
| [17] | [17] | IEEE-CIS competition rules | E13/E20/E22; official competition link; permission/attribution completeness remains qualified |

First appearances now run [1] through [17], with no undefined or uncited entry. All 12 DOI strings are unchanged. This task checks numbering, identities and transcription against the existing verified reference material; it is not a new systematic review or independent reproduction of external experiments. A limited fresh publisher check confirmed the Chen et al. title, authors, year, venue and DOI on the [Mathematics publisher page](https://www.mdpi.com/2227-7390/14/7/1183). Other attempted DOI fetches for NATE, Soylu and Kang were unavailable to the browsing tool; that limitation is recorded rather than relabeling every external page as freshly checked. No contradictory metadata was established and no entry was silently replaced. Unexamined nesting/implementation details of the external studies remain qualified in the literature synthesis. At submission, the selected venue may require title-case, abbreviation or online-resource adjustments beyond this generic proof.

## 5. Export and visual verification

The required packaged `render_docx.py` was attempted. It failed because the Windows runtime did not supply a discoverable LibreOffice `soffice.exe`; the original strict-OOXML template also required conversion. No desktop LibreOffice was installed or used. Hidden native Microsoft Word successfully performed template conversion and DOCX-to-PDF export. Bundled Python and Poppler rasterized the PDF for inspection. The export workflow therefore exists and the matching PDF is delivered. This fallback is explicitly documented rather than claiming the canonical renderer passed.

All 13 final pages were reviewed. Pages 1–4 in the last export are pixel-identical to the already inspected preceding proof; final pages 5–13 were inspected again. Corrections made during proofing were limited to title/author spacing, inherited emphasis, full-width table header spacing, explicit subfigure labels, prevention of automatic duplicate figure labels, keeping the global-importance subsection with its table, and reference balancing. Final XML checks ensure all caption numbering is explicit. Eight Times New Roman PDF font resources have embedded TrueType font streams. No IEEE PDF eXpress, accessibility conformance, external reference-assistant certification or venue compliance test is claimed.

Reproducibility records are `support/build-record.json`, `support/validation-results.json`, `support/template-package-inventory.json`, and `support/citation-number-map.json`. Build and read-only verification helpers are retained outside the repository in the task's Codex visualization workspace. Native Word opened the new DOCX read-only and exported it; it did not overwrite V2.1 or any original evidence. No model load, retraining, evaluation script, database access, browser submission or application screenshot occurred.

## 6. Delivery state

The complete DOCX/PDF are suitable for supervisor review and later genuine screenshot integration. Authorship/declarations, target venue/page limit, dataset permissions/attribution, historical provenance qualifications and O7c/PSQ1 evidence remain unresolved as recorded in `remaining-publication-blockers.md`. Pending screenshots are plain editorial requests, not fabricated figures. The 13-page length is intentional preservation of the approved full content; it is not asserted to fit an unspecified conference limit.

### Final file identities

- DOCX SHA-256: `804788a649b458dcf6261aaa53f8975496c87ed6baf29c11117666f2884db142`.
- PDF SHA-256: `6e82d6adf96dd345c68924bffda54d0d76517d6172cf65c6de87f4c9bd7991db`.
