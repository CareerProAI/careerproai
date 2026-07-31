# Automated tests

This converts `test.md`'s manual/exploratory test plan into real, runnable tests, per
`test.md`'s own "Notes for automation follow-up": API-level cases (A01-A09) as fast
node:test checks, UI cases (B01-B10) as Playwright specs, A10 left manual.

## Running

```bash
npm run test:api    # tests/api/  — node's built-in test runner via tsx, no browser
npm run test:e2e     # tests/e2e/ — Playwright, drives a real Chromium against :3000/:3001
npm run fixtures:generate   # regenerates the binary fixtures (pdf/docx/jpg/oversized) if needed
```

**There is deliberately no combined `npm test` script.** CLAUDE.md's Stop hook
(`validation-gate.js`) auto-runs `npm test` on every turn if that script exists, with a
5-minute timeout and no servers/keys guaranteed available. These tests need the API
server (and for `test:e2e`, the Vite dev server too) running, plus real `GROQ_API_KEY`/
`GEMINI_API_KEY` values, plus for several cases live network access to bdjobs.com/
LinkedIn/Groq/Gemini. Wiring that into an every-turn auto-run gate would hang or fail
that gate permanently in any session without all of that in place. Run both scripts
manually.

## Prerequisites

- `npm run server` and (for `test:e2e`) `npm run dev` running — or let Playwright start
  them itself via its `webServer` config (`reuseExistingServer: true`, so it reuses
  already-running processes rather than erroring on a port conflict).
- At least one of `GROQ_API_KEY` / `GEMINI_API_KEY` set for AI-dependent cases — those
  tests call `t.skip(...)` / `test.skip(...)` with a clear reason rather than failing
  when no key is configured.

## Data hygiene

Every test that creates a resume, saved job, or user cleans it up afterward (`finally`
blocks throughout) so repeated runs never accumulate test data in the real
`talentai.db`. `tests/api/helpers/db.ts` uses direct SQLite access only for user
cleanup, since there's no `DELETE /api/users/:id` endpoint — assertions themselves
always go through the real HTTP API.

## Coverage map

| test.md ID | Where | Notes |
|---|---|---|
| B01-B03 | `e2e/specs/resume-upload.spec.ts` | PDF/DOCX/TXT upload happy path |
| B04 | `e2e/specs/profile-switching.spec.ts` | profiles seeded via API to isolate what's under test |
| B05 | `e2e/specs/job-search.spec.ts` | scoped to the filter surface that actually exists — see below |
| B06 | `e2e/specs/job-search.spec.ts` | save/unsave, verified via the API |
| B07 | `api/saved-job-notes.test.ts` | moved to the API layer — see below |
| B08-B10 | `e2e/specs/settings.spec.ts` | account update (self-restoring), dark mode + OS sync, sandbox reset |
| A01-A02 | `api/upload-validation.test.ts` | |
| A03 | `api/resume-cascade.test.ts` | |
| A04 | `api/users-patch.test.ts` | |
| A05 | `api/ai-fallback.test.ts` | spawns an isolated `server/server.js` with a broken Groq key — see below |
| A06, A08 | `api/sanitization-unit.test.ts` | unit tests against `server-utils.js`, not live 429s/tampered responses — see below |
| A07 | `api/prompt-injection.test.ts` | |
| A09 | `api/ssrf-guard.test.ts` | |
| A10 | *(not automated)* | test.md itself flags this as needing a network-fault-injection harness + browser driver and recommends staying manual until there's appetite for a proper E2E suite — that guidance is taken as-is |

## Findings from implementing this, not just running it

- **`server-utils.js` is new.** `sanitizeJobTextField`/`clampMatchRate`/
  `sanitizeMatchEntry`/`computeBothRateLimited` were extracted out of `server/server.js` (zero
  behavior change) so A06/A08 could be deterministic unit tests instead of trying to
  force two real 429s or coerce a live model into a malformed response — both slow,
  flaky, and quota-burning as written in test.md.
- **Verifying this suite for real exhausted the Groq free-tier daily token quota**
  (100,000 TPD) — each AI-dependent test parses a real resume or scores real listings,
  and running the full suite plus iterating on bugs used enough of them to trip Groq's
  daily cap (`Used 99772/100000... try again in ~1h12m`). Combined with the invalid
  Gemini key below, every AI-dependent case (A05, A07, B01-B04, B05/B06's live-scoring
  path) will fail with a real "Both AI providers failed" error until the Groq quota
  resets or a working `GEMINI_API_KEY` is set — this is expected and not a code bug;
  those cases were individually verified passing before the quota ran out. Be mindful of
  this cost when re-running `test:api`/`test:e2e` — they are not free to run repeatedly
  against a free-tier key.
- **The GEMINI_API_KEY currently in `.env` is not a valid Gemini API key** (it doesn't
  match the `AIza...` format real keys use, and Google rejects it directly, independent
  of any code here). `test:api` will show A05 failing because of this, honestly — it's
  correctly catching that the documented Groq→Gemini fallback cannot currently succeed
  end-to-end in this environment. This isn't a test bug.
- **There is no reachable "Saved Jobs" page or rich filter panel in the current UI.**
  `SavedJobTableRow.tsx` / `SavedJobNotesCell.tsx` / `SavedJobsEmptyState.tsx` and
  `ui/FilterPillGroup.tsx` all exist but are never imported anywhere — no `saved-jobs`
  entry in `navMenuItems.ts`, no matching case in `ActiveViewRouter.tsx` (same "defined
  but unused" status CLAUDE.md already documents for `mockProfiles.ts`). B05 is scoped
  to the filter surface that's actually wired up (the All Jobs/Highly Recommended
  toggle, sort mode, and the top-nav search box); B07 moved to an API-level test since
  the notes-editing UI it describes doesn't exist to drive.
