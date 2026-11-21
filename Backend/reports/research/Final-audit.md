# FraudShield stabilization audit — 18 November 2026

This checkpoint covers PostgreSQL, migrations, the complete backend test suite,
the available frontend tests, and the frontend production build. Browser testing,
screenshots, real Google consent, SMTP delivery, and print behavior remain outside
this checkpoint. Previously completed research training and holdout replay were
not repeated.

## PostgreSQL and existing database

- The application-configured SQLAlchemy engine connected to PostgreSQL **18.6**.
  The first sandboxed check returned `OperationalError`; the identical check
  succeeded outside the sandbox. No credentials or connection URL were printed.
- Initial Alembic revision: `7d7f41e47961`. Final revision: `9ab32e041a67`.
- All six application tables already existed. Alembic metadata comparison,
  including types, found **zero schema differences** before and after the upgrade.
- The reviewed head migration skips existing token tables. In this database it
  advanced the revision marker without changing the application tables. All six
  table row counts were unchanged. No downgrade, reset, or deletion was run on
  the existing database.
- `app/database.py` constructs its engine from `DATABASE_URL` and fails when the
  setting is absent. There is no exception-driven SQLite fallback. The app's
  `create_all` startup branch is limited to explicitly configured SQLite engines;
  PostgreSQL uses Alembic. The unit-test configuration deliberately selects SQLite
  unless the PostgreSQL integration flag is set.

## Complete migration history

| Revision | Parent | Behavior |
|---|---|---|
| `b7c35aeda05d` | base | Creates history on fresh installations; adopts an existing history table. Downgrade retains it. |
| `4dd039e39259` | `b7c35aeda05d` | Creates/adopts account, identity, refresh tables; adds history ownership if absent. Downgrade drops ownership and retains account tables. |
| `7d7f41e47961` | `4dd039e39259` | Historical no-op in both directions. |
| `9ab32e041a67` | `7d7f41e47961` | Creates missing reset and verification token tables. Downgrade retains them. |

One linear chain, one head, no broken revision references were found. Existing
table adoption uses existence checks rather than repairing arbitrary legacy
column/constraint drift. The inspected local database does match the ORM metadata.

## Fresh database, constraints, and rollback

The audit created a separate PostgreSQL database with a generated `fs_audit_`
name. It did not substitute a schema in the existing database for this fresh
installation test. Only that newly created database was dropped after testing.

Passed checks:

1. Empty database upgrade from base to head.
2. Repeated upgrade to head and zero metadata differences.
3. An invalid history owner is rejected by PostgreSQL's foreign key.
4. Deleting a synthetic account cascades to its identity, refresh session, reset
   token and verification token; its history survives with a NULL owner.
5. Head-to-former-head downgrade retains token tables; re-upgrade succeeds.
6. Full downgrade/re-upgrade completes and returns to matching metadata, but
   **loses previously populated history ownership**.
7. The opt-in PostgreSQL integration test initializes its isolated schema inside
   the disposable database, signs in two synthetic users, scores both models,
   verifies the owner's two saved records, verifies the other user's empty list,
   and verifies cross-user individual-record access returns 404.

Existing schema inspection confirmed unique user-email and token-hash indexes,
the unique `(provider, provider_user_id)` identity constraint, account foreign
keys with `ON DELETE CASCADE`, and nullable history ownership with `ON DELETE
SET NULL`. Personal history authorization is enforced by application queries;
the foreign key enforces owner validity. Nullable ownership supports legacy and
detached rows.

**Rollback finding:** the migration chain is not a lossless schema/data reversal.
Crossing `4dd039e39259` removes the `user_id` column and permanently discards its
values. Re-upgrade restores the column with NULL values. Retained tables also
mean a downgrade to base does not produce an empty schema. No migration source
was changed during this audit. Do not interpret the successful scratch rollback
as evidence that rolling back the existing database preserves ownership.

## Commands and results

From the repository root, using PowerShell:

```powershell
.\.venv\Scripts\python.exe Backend/test_db_connection.py
.\.venv\Scripts\python.exe -m alembic -c Backend/alembic.ini history --verbose
.\.venv\Scripts\python.exe Backend/audit_postgres.py
.\.venv\Scripts\python.exe Backend/audit_postgres.py --exercise
```

The first connection attempt failed inside the sandbox and passed when repeated
outside it. Inspection and exercise also ran outside the sandbox for PostgreSQL
access. Inspection is read-only. `--exercise` is intentionally stateful: it
requires the configured database to match metadata at the former head or head,
upgrades it to head, then creates a separate database for the remaining checks.
No URL or password appears in the command arguments.

Exercise mode runs the complete backend suite with the exact subprocess command
below from `Backend`, setting `DATABASE_URL` in the child environment to the
disposable database and `FRAUDSHIELD_TEST_POSTGRES=1`:

```powershell
..\.venv\Scripts\python.exe -m pytest -q
```

Result: **32 passed, 0 failed, 0 skipped, 1 warning**, in **9.98 seconds**.
This includes the PostgreSQL integration test; most API regression tests still
use their own SQLite fixtures. The warning is `StarletteDeprecationWarning`:
using `httpx` with `starlette.testclient` is deprecated and the installed library
recommends `httpx2`. Dependency changes were not made in this audit.

From `Frontend`:

```powershell
node --test tests/reports.test.js
npm run build
```

- Frontend tests: **2 passed, 0 failed, 0 skipped**. These cover report filtering,
  CSV output, zero values, record ordering and empty-history headers.
- Production build: **passed**, Vite **6.4.5**, **2,044 modules**, **5.94 seconds**.
- No lint or type-check script is configured in `Frontend/package.json`.
- No test or build errors occurred. These results do not establish browser E2E
  coverage or external authentication/email delivery.

## Working-tree preservation

Added `Backend/audit_postgres.py` and this report. Existing source changes,
migration files, model artifacts and research evidence were preserved. Nothing
was staged or committed. The build regenerated ignored frontend build artifacts.

## Final live browser verification attempt — 18 November 2026

**Status: BLOCKED; no live browser workflow is marked passed.** The automated
results above remain separate evidence and do not establish browser success.

Both actual development servers were started from the current working tree:

```powershell
# Backend
..\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
# Frontend, separate terminal
npm run dev -- --host localhost --port 5173 --strictPort
```

Uvicorn reported application startup complete and listening at
`http://127.0.0.1:8000`. Vite 6.4.5 reported ready at
`http://localhost:5173/`. Server startup is not an HTTP/browser workflow check.
The servers were left running for manual verification.

### Exact browser blockers

1. Browser inventory returned the in-app browser and a native Brave window.
   Inventory also emitted `Timed out waiting for Statsig values.`
2. Opening `http://localhost:5173` in the in-app browser returned:
   `js execution timed out; kernel reset, rerun your request` after approximately
   30 seconds. No FraudShield page state or screenshot was returned.
3. Native fallback imported `@oai/sky` successfully and listed the Brave window.
   Selecting/activating that returned window and requesting its state returned:
   **“Computer Use has been stopped for this turn because it could not determine
   the current browser URL on Windows with enough confidence to enforce policy.
   Stop your work and send a final message noting why Computer Use ended.”**

UI automation stopped at that point. No alternate driver, URL-policy workaround,
mock component, injected browser session, or simulated screenshot was used.
**Genuine workflow screenshots captured: 0.** No CSV was downloaded and no PDF
was saved. No new application bug was established by this blocked attempt.

### Manual verification checklist

Use `http://localhost:5173` with the real API and PostgreSQL database. Use two
dedicated verified test accounts, A and B, and synthetic records. Never put
passwords, tokens, cookies, or `.env` contents into screenshots or this report.
Record actual outcomes and browser errors beside each item; all items below
remain **NOT VERIFIED IN THE BROWSER**.

| Workflow | Manual steps and evidence required |
|---|---|
| 1. Password login and Google Sign-In | Capture the login page without entered credentials. Sign in as A using the normal form and confirm the dashboard. Separately complete real Google consent using an eligible linked test account; record success or the exact provider/app error. A visible Google button alone is insufficient. |
| 2. Fraud prediction, 431 features | Open Fraud detection and verify the displayed schema count is 431. Paste `Backend/fraud_test_payload.json` into the JSON form and submit. Capture the actual result. The current UI uses one JSON editor for the complete feature record, rather than 431 separate input controls. |
| 3. Credit prediction, 10 features | Open Credit risk, confirm 10 inputs, and enter the corresponding values from `Backend/credit_risk_test_payload.json`. Submit and capture the result. |
| 4. Output, probability, risk | Compare the real network response and displayed class, rounded percentage, risk band and saved history ID for both submissions. Archived sample references are fraud score 0.2279069186761751 (22.79%, positive, Low risk) and credit score 0.04155259649156278 (4.16%, negative, Low risk). These are reference expectations, not results observed in this attempt. Classification thresholds differ from the display risk bands. |
| 5. History and individual record | Confirm both newly saved IDs, timestamps, scores and classes in A's history. Using browser developer tools with A's bearer token, verify authenticated `GET /history/{history_id}` returns the matching record. Keep the token private. If there is no record-detail UI, record that limitation separately. |
| 6. Cross-user isolation | Log out A, sign in B, and confirm neither A record appears in B's history, reports or analytics. In B's authenticated browser request, request each A record ID and require 404. Also verify a request without authentication returns 401. |
| 7. Analytics consistency | For A, count all owned records and flagged results by model and risk band. Compare dashboard and Analytics totals against the complete paginated `/history` responses. Account for pre-existing test records; do not assume exactly two total rows. Capture Analytics. |
| 8. Reports filtering | Capture Reports with Both models, Transaction fraud and Credit delinquency. Confirm each filtered view contains only the selected model and that counts match A's history. |
| 9. Actual CSV contents | Download each report filter. Open the downloaded `fraudshield-predictions.csv`; verify header, row count, model values, record order and IDs/scores against the selected view and API. Confirm zero values are preserved and B/unowned records are absent. Retain the genuine downloaded files as evidence. |
| 10. Print / Save PDF | With a selected Reports filter, click Print / Save PDF. Inspect the actual browser print preview for clipping, blank pages and filter consistency; save a PDF and open it to verify its contents. Capture preview and retain the PDF. A button click alone does not pass this check. |
| 11. Desktop and mobile | Capture dashboard, both prediction results, Analytics and Reports at a desktop viewport (e.g. 1440×900) and mobile emulation (e.g. 390×844). Check navigation, overflow, form labels, result readability, tables, dropdowns and report buttons. Record actual viewport dimensions and any clipping. |
| 12. Logout and sessions | Reload while signed in and verify cookie-based session restoration. Log out, reload, and use browser Back; protected data must remain inaccessible. Confirm the revoked refresh session cannot restore access. Sign in as B after A and check that no stale A data is visible. Record separately whether already-issued access tokens remain valid until expiry. |

Store genuine captures under `Backend/reports/research/browser/` with descriptive
names such as `login-desktop.png`, `dashboard-desktop.png`,
`fraud-result-desktop.png`, `credit-result-desktop.png`, `analytics-desktop.png`,
`reports-filtered-desktop.png`, `reports-print-preview.png`, and corresponding
mobile captures. This directory and these files were **not generated** during the
blocked attempt. Finish with browser/version, viewport sizes, account aliases,
record IDs, CSV/PDF filenames, outcomes and unresolved errors; omit secrets.

### Unresolved findings at this checkpoint

- Live browser verification and all screenshot/download/print evidence remain
  pending because of the browser-control blockers above.
- The previously confirmed migration rollback ownership-loss limitation remains
  unresolved. No migration or application logic was changed in this phase.
- This attempt did not rerun completed ML alignment, holdout replay or automated
  tests, and did not stage, commit, reset or discard existing changes.
