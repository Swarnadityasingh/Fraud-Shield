# Research tables and figure placement plan

No original figure or metric is regenerated, edited or copied into the draft directory. Figures remain at the preserved paths. Manuscript Markdown contains tables transcribed from the frozen evidence. A venue-specific two-column typesetting pass is deferred until content review and venue selection.

## Tables already drafted

| Table | Placement | Source | Review |
|---|---|---|---|
| I Dataset partition distributions | Section III after dataset descriptions | Both `distribution.csv` files | Preserve train/validation/holdout distinction and positive class |
| II Selected-model holdout metrics | Section V-A | Selected rows in both `test_metrics.csv` files; replay JSON cross-check | Six decimals; distinguish PR-AUC and AP |
| III Holdout confusion counts | Section V-A | Both selected rows | Define TN/FP/FN/TP and include sample/positive counts |
| IV Validation selection and candidate comparison | Section V-B | `validation_thresholds.csv` plus `test_metrics.csv` | Include weighted, unweighted and prior; label selected by validation |

The compact configuration paragraph in Section IV can become a small table if venue space permits. Full-precision data remain supplementary evidence rather than unnecessarily wide paper tables.

## Existing research figures

All source paths below are relative to `C:/Users/Arpit Srivastava/FraudShield-Backups/2026-11-18_205620_IST/repository/Backend/reports/research`.

| Figure | Existing files | Placement and draft caption |
|---|---|---|
| 1a–b | `fraud/confusion_matrix.png`; `credit/confusion_matrix.png` | Section V-A: Selected-model final internal-holdout confusion matrices. Rows are actual classes and columns predicted classes; thresholds are 0.21 and 0.23. |
| 2a–b | `fraud/roc.png`; `credit/roc.png` | Section V-A: ROC curves of the selected pipelines on their respective internal holdouts. These describe ranking, not calibrated risk. |
| 3a–b | `fraud/precision_recall.png`; `credit/precision_recall.png` | Section V-A/B: Precision–recall curves of selected pipelines. State AP and trapezoidal PR-AUC separately in the associated table. |
| 4a–b | `fraud/feature_importance.png`; `credit/feature_importance.png` | Section V-C: Global mean-decrease-in-impurity rankings. These are not case explanations or causal effects. |

Before submission, visually inspect all eight originals at final IEEE column width, verify axis labels against table definitions, and check any legend's use of AP versus area. Do not silently change or regenerate a plot if its annotation differs; document the issue and request approval. No plot readability approval is claimed by this draft.

## Planned application figures — not captured

- Figure 5: dashboard with actual persisted demonstration records and matching counts.
- Figure 6a–b: fraud input/result and credit input/result, including saved IDs.
- Figure 7a–b: Analytics and filtered Reports with reconciled owner-scoped records.
- Supplementary evidence: history, CSV file contents, print preview and opened saved PDF; include in main paper only if venue space allows.

Caption every application figure as an integration demonstration using identified public holdout records. Include both true class and actual model outcome in the demonstration log; screenshots do not constitute a new evaluation. No architecture illustration is generated in this stage.
