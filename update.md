# Update Log

## Automated test suite
`test.md` was a manual/exploratory test plan only — nothing in it actually ran automatically. It's now implemented as real, runnable tests under `tests/`, converting all 20 documented cases (B01–B10 basic, A01–A09 advanced) except A10, which `test.md` itself flags as needing a network-fault-injection harness and recommends leaving manual.

**`tests/api/`** — 9 files, run via `tsx --test` (Node's built-in test runner, no new dependency):
- `upload-validation.test.ts` — A01 oversized file rejected, A02 unsupported type rejected
- `resume-cascade.test.ts` — A03 delete cascades through every child table
- `users-patch.test.ts` — A04 targeted PATCH doesn't clobber other columns, 409 on duplicate email
- `ai-fallback.test.ts` — A05 Groq failure genuinely falls back to Gemini (spawns an isolated server process with a broken key)
- `sanitization-unit.test.ts` — A06 rate-limit flag logic, A08 match-batch tampering guard, as fast deterministic unit tests
- `prompt-injection.test.ts` — A07 a job description trying to force `matchRate: 100` via embedded instructions gets scored on real content instead
- `ssrf-guard.test.ts` — A09 the LinkedIn description endpoint rejects non-`linkedin.com/jobs/view/` URLs before ever making a request
- `saved-job-notes.test.ts` — B07, moved here because the notes-editing UI it describes doesn't exist in the app

**`tests/e2e/`** — Playwright specs against a real browser + live backend:
- `resume-upload.spec.ts` — B01–B03, PDF/DOCX/TXT upload through to a scored report
- `profile-switching.spec.ts` — B04
- `job-search.spec.ts` — B05 (scoped to the filter controls that actually exist) + B06 save/unsave
- `settings.spec.ts` — B08 account update, B09 dark mode + OS sync, B10 sandbox reset

Real fixtures were generated and verified against the app's actual parsers (a real PDF via `pdfkit`, a real DOCX via Python's `zipfile`, both confirmed readable by `pdf-parse`/`mammoth` before use). Every test that creates data cleans it up in a `finally` block — none of this leaves anything behind in the real `talentai.db`.

Run with `npm run test:api` / `npm run test:e2e` (see `tests/README.md` for prerequisites and the full coverage table). Last real run: 11–12 of 13 API tests pass; the 1–2 failures are the pre-existing invalid Gemini key / exhausted Groq quota noted below, not code bugs — confirmed by the same tests passing earlier in the session with a live AI call.

## Bug fix
`insertResumeDetails.js`/`insertResumeCore.js` used `.forEach(async ...)` for per-row inserts inside a DB transaction — it doesn't await its callback, so `COMMIT` could fire before all rows were written and a failed insert could skip `ROLLBACK` silently. Replaced with `Promise.all(list.map(...))`.

## Performance
- Added indexes on every foreign-key column (`resume_id`, `user_id`) — previously unindexed.
- Parallelized the 8 independent queries behind `GET /api/resumes/:id`.
- Deduplicated 21 repeated `if (!response.ok)` blocks across `src/api/*.ts` into one `fetchOrThrow()` helper.

## Structure
- Split the ~1150-line `server.js` monolith into per-resource modules (`routes/`, `ai/`, `resumeParsing/`, `pdf/`, `upload/`) — every backend file now under 100 lines, same rule the frontend already followed.
- Split `database.js` into `database/` (schema, migrations, seed, connection).
- Consolidated all backend code under `server/`, mirroring `src/` for the frontend.
- Moved reference docs into `docs/`; removed dead scaffolding and stale scratch files.

## Known environment issue (not a code bug)
`GEMINI_API_KEY` in `.env` is not a valid Gemini key (wrong format) — the documented Groq→Gemini fallback can't complete end-to-end until it's replaced. Groq's free-tier daily quota was also exhausted by test runs during this work; it resets daily.
