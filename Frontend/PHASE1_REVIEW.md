# Dashboard Phase 1 review

Date: 19 November 2026. Scope: dashboard design system, executive overview and shared shell. This is a visual-review checkpoint, not completion of the remaining page redesigns or live end-to-end verification.

## Implemented

- Scoped Graphite / Charcoal / Copper light and dark tokens, with independently chosen text, surface, border and semantic colours.
- Consolidated shell CSS and sidebar CSS ownership; removed the previous competing sidebar selectors, hidden activity/quick-action overrides and inconsistent collapsed widths. Five rewritten presentation stylesheets were formatted with unchanged PostCSS syntax-tree semantics.
- Sidebar navigation, collapsed state, profile/settings, upgrade and logout handlers retained. Header theme persistence, notification controls and outside-click handling retained; Escape also closes notifications.
- Theme bootstrap before first paint, respecting the stored workspace theme. Public/auth screens retain their separate styling.
- Welcome panel, session-notification activity, navigation shortcuts, four scoped statistics and a print-overview action.
- History-derived prediction activity, pipeline-volume donut, separate fraud and credit classifications, separate pipeline risk distributions, and prediction-volume comparison with available classification counts.
- Recent eight records, with full records still accessible in Reports; model score, classification and saved risk band displayed separately. The shared table also supplies Reports, so its presentation changes apply there without redesigning that page.
- Explicit loading, failure/retry, confirmed-empty and populated states. Statistics and charts do not render until all history pages load successfully. Token changes gate the previous account's history while the new load starts.

The fraud-only legitimate/fraud counts never incorporate credit labels. Model comparison reports usage and available classification counts, not accuracy or evaluated performance. Scores are not labeled calibrated probabilities. Risk bands use the saved values and are explicitly described as unvalidated display categories.

No runtime sample records, users, trends or percentages were fabricated. The chart input is the existing authenticated `loadHistory` result. Synthetic inputs exist only in automated tests and are not imported by application code.

## Activity window

Daily activity uses UTC days and a labeled 30-day window ending on the latest valid saved timestamp. Zero-count days mean no returned records occurred on those days, not an assumed trend. Older records remain included in lifetime totals but are outside that chart window. Missing/invalid timestamps are omitted from activity with their count disclosed. Unknown model types, classifications and risk values are not silently relabeled as credit, legitimate or Low risk.

## Checks completed

Run from `Frontend`:

```powershell
node --test tests/*.test.js
npm run build
```

Results: **10 tests passed, 0 failed**. Four server-rendering checks cover loading, API failure, confirmed empty history and populated rendering. Four aggregation tests cover pipeline isolation, UTC activity/window boundaries, unknown values and immutability. The two existing CSV/filter tests also pass.

Final production build: **passed**, 2,665 modules transformed, completed in 7.90 seconds. Output: JavaScript 867.25 kB / 254.39 kB gzip; CSS 145.31 kB / 29.37 kB gzip. Vite emits a non-fatal warning for the JavaScript chunk exceeding 500 kB. Chart code splitting is a possible subsequent optimization, not a completed performance claim.

`git diff --check` passed, with existing Windows line-ending normalization warnings. The other 41 pre-existing frontend source files match the pre-implementation copy. Backend/API/model/research content was not edited. All seven files listed in the frozen supervisor-review manifest still match their hashes. Existing uncommitted authentication, prediction and report work remains preserved. No staging or commit occurred.

## Browser verification boundary

The local frontend development server is running at **http://localhost:5173**. The in-app browser reached the existing sign-in page. Authenticated desktop/light/dark/mobile verification did not complete: Computer Use stopped because it could not reliably determine the current URL in the native Windows browser. No authentication bypass, mock session, direct database insertion or prediction submission was used. No dashboard screenshot, actual CSV download or print/PDF output was verified or manufactured. Server-rendering tests do not establish browser chart layout or authenticated API success.

## Visual review checklist

1. Sign in through the existing application at http://localhost:5173/dashboard.
2. Review the overview in light and dark mode; reload to confirm persistence.
3. Check all displayed totals against your existing owned history. Fraud classifications should remain separate from credit delinquency classifications.
4. Hover chart series/slices and distribution segments; review labels, colours, tooltips and UTC date range.
5. Collapse and expand the sidebar. At mobile widths, verify horizontally scrollable navigation, available account/logout controls, readable cards and horizontal table overflow.
6. Open notifications; check marking read, outside-click and Escape. Do not expect a live event stream: the activity panel explicitly describes session notifications.
7. Navigate to both prediction forms, Reports and Settings to check existing entry points. Their dedicated redesigns are intentionally deferred. There is no requirement to submit new records for this visual review.
8. Review Print overview and existing Reports exports if desired; downloaded bytes and print layout still need genuine browser checks.

Further page redesigns await review of this Phase 1 result. No research manuscript changes or new evaluation claims are part of this work.
