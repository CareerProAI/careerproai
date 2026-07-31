# TalentAI — Enterprise Suite

> AI-powered resume scanning, ATS compliance analysis, and job-match discovery.
> Upload a resume → Groq (with an automatic Gemini fallback) parses and scores it → live job listings from bdjobs.com and LinkedIn are AI-matched against it → track saved opportunities and generate a tailored application package — all inside a Material Design 3 dashboard.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-local-003B57?logo=sqlite&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Llama%203.3%2070B-F54703)
![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash%20(fallback)-8E75B2)

---

## Table of contents

- [Features](#features)
- [Sidebar navigation](#sidebar-navigation)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Database schema](#database-schema)
- [Project structure](#project-structure)

---

## Features

### Resume intelligence
- **Drag-and-drop upload** of PDF, DOCX, or TXT files (5 MB cap) with live progress animation and retry on failure
- **AI parsing** via Groq Llama 3.3 70B (automatic Gemini 2.5 Flash fallback on any Groq failure) — extracts candidate info, experience, education, skills, certifications, projects, and social links from raw resume text
- **ATS compatibility score** (0–100) with badge rating and a circular SVG health gauge
- **Strengths & improvements** — structured AI-generated insight cards
- **Target-role gap analysis** — missing skills highlighted with one-click "Add to resume" shortcut
- **Multi-profile support** — multiple uploaded resumes per user, switchable from the top navigation bar
- **Upload history table** inside the Resume view

### Job matching
- **Live job listings**, merged from two real external sources — no mock data:
  - **bdjobs.com** (Bangladesh's largest job board) — rich per-listing data: salary, employment type, experience, education, description
  - **LinkedIn** — public, no-login "guest" search endpoint (deliberately not authenticated scraping, to avoid any account-ban risk); thinner data (title/company/location/date/URL only), full description fetched lazily
  - Feed is split into two columns (BDJOBS / LinkedIn) so a slow or failing source never blanks the other (`Promise.allSettled` end-to-end)
- **One AI call scores every listing on the page** against the active resume (Groq, Gemini fallback) — match percentage, a "why it matches" explanation, and extracted skill keywords per job. If scoring fails entirely (both providers down), listings still render — marked "Not AI-Scored" — instead of the whole feed going blank
- **Global job search** from the top navigation bar (filters by title, company, and skill)
- **Rich filter panel:** location, company, experience level, workplace type, employment type, date posted, salary
- **Sort modes:** Relevance, Latest, Salary, Best Match
- **AI Matching tab** — pre-filtered to the app's "recommended" match threshold
- **Job details modal** with full description (fetched on demand for LinkedIn), required skills, and metadata
- **Match Matrix** — overlay with a skills breakdown table and a live Groq-powered experience-alignment paragraph (`POST /api/jobs/compare`)
- **Save / unsave** jobs with bookmark; notes editable inline in Saved Jobs view (persisted to SQLite)
- **Quick Apply** generates a real AI-tailored resume + cover letter for that specific job (`POST /api/jobs/generate-application`), previewed in-app and downloadable as PDF — not a placeholder/toast-only action

### Dashboard
- Bento-grid KPI cards: Resume Health score (animated SVG gauge), active applications, new matches, skills tracked
- Top recommended jobs with Quick Apply
- Active resume summary with a link to the Resume Analysis tab
- AI improvement recommendations card
- Recent activity timeline
- Skills and education sidebar cards

### Analytics
- **Score progression chart** — every uploaded resume version plotted over time (each profile's `res-<timestamp>` id doubles as its version snapshot; no separate history table needed)
- **Skills distribution** — breakdown of frameworks, tools, and soft skills for the active profile
- **Applications per month** bar chart (mock pipeline data — see "What's real vs. mock" below)
- **Recruiting rates card** and **Top Skills chart**
- **Skill Gaps card** — overlaps gap-analysis data with market demand
- Progress and target snapshot panels

### Settings
- Account name and email update (persisted to SQLite, 409 on duplicate email)
- Notification preferences: job matches, resume analysis alerts, weekly summary (persisted)
- AI provider status indicator — shows whether at least one of Groq/Gemini is configured server-side (key itself never sent to the browser)
- API key label (custom display name, for the user's own reference)
- Resume management: delete any uploaded profile (cascades to all child tables)
- Dark mode toggle (also auto-syncs with OS preference on mount)
- Sandbox reset — restores mock applications and activity logs to seed state only (resume profiles and saved jobs, being real DB-backed data, are untouched)

---

## Sidebar navigation

| Tab | Label | Component | Notes |
|-----|-------|-----------|-------|
| `dashboard` | Dashboard | `DashboardView` | Default landing view |
| `resume` | Resume | `ResumeView` | Upload + report sub-views |
| `jobs` | Job Search | `JobSearchView` | All jobs, full filter panel |
| `ai-matching` | AI Matching | `JobSearchView` | Reuses `JobSearchView` seeded to the "recommended" filter — rendered with a distinct `key` so React remounts instead of treating navigation as a prop update |
| `saved-jobs` | Saved Jobs | `SavedJobsView` | API-backed, per-resume scope |
| `applications` | Applications | `ApplicationsView` | Pipeline tracker (in-memory) |
| `analytics` | Analytics | `AnalyticsView` | Charts using real + mock data |
| `settings` | Settings | `SettingsView` | Account, API, notifications |

The sidebar collapses on mobile with an overlay and a hamburger toggle in `TopNavBar`.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript 5.8 |
| Build | Vite 6 + `@vitejs/plugin-react` |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`), no config file — CSS-based `@theme` |
| Design tokens | Material Design 3 CSS custom properties in `src/index.css` (`--color-primary`, `--color-surface-container`, etc.) with light/dark overrides |
| Icons | Material Symbols Outlined (Google Fonts CDN), Lucide React |
| Animation | Tailwind `animate-in` utilities + `motion` library |
| Backend | Express 4 (single-file, ES modules) |
| Database | SQLite via `sqlite` + `sqlite3` packages |
| AI | Groq (`llama-3.3-70b-versatile`, primary) with an automatic Gemini (`gemini-3.6-flash`) fallback on any Groq failure |
| External job sources | bdjobs.com (reverse-engineered JSON API, proxied), LinkedIn (public "guest" HTML endpoint, parsed server-side with `cheerio`) |
| File parsing | `pdf-parse` v2 class-based API (PDF), `mammoth` (DOCX), raw buffer (TXT) |
| File upload | `multer` (in-memory, 5 MB cap) |
| Application PDFs | `pdfkit`, rendered server-side and returned base64-encoded |
| Charts | Custom hand-rolled SVG/CSS — no Recharts or Chart.js |
| Path alias | `@/*` → project root (configured in `tsconfig.json` and `vite.config.ts`) |

There is **no automated test suite**. `@playwright/test` is installed as a devDependency for ad hoc manual/agent-driven verification only — it is not wired into any `npm` script.

---

## Architecture

TalentAI runs as **two separate processes** in local development:

```
Browser (:3000)
  │  Vite SPA (React 19)
  │  src/api/ → fetch()
  ▼
Express API (:3001)          server/server.js
  │  multipart upload (multer)
  │  text extraction (pdf-parse / mammoth)
  │  Groq Llama 3.3 70B  ◄──── GROQ_API_KEY
  │  Gemini 2.5 Flash    ◄──── GEMINI_API_KEY  (fallback on any Groq failure)
  │  bdjobs.com / LinkedIn proxy + scrape
  ▼
SQLite  talentai.db (project root, auto-created)
```

### Frontend (`src/`)
- **`App.tsx`** — composes 8 custom hooks from `src/hooks/` (`useAppToast`, `useDarkMode`, `useActivityLog`, `useResumeProfiles`, `useSavedJobs`, `useApplications`, `useAccountSettings`, `useJobListings`, `useApplicationPackage`), each owning one state domain; `tab` is a plain `useState<string>` — no React Router, no Redux/Zustand. Two composition-only files take it from there:
  - **`src/components/ResumeBootstrapGate.tsx`** — loading/error/no-profile guard clauses, using a render-prop so TypeScript narrows `currentProfile` from `ResumeProfile | null` to `ResumeProfile` for everything downstream
  - **`src/ActiveViewRouter.tsx`** — the `switch (tab)` that renders the active `*View` component
- **`src/components/*View.tsx`** — one top-level component per sidebar tab; every file is kept at or under 100 lines, so sub-widgets (table rows, chart components, modal sections) and stateful logic are extracted into their own files and `src/hooks/*.ts` hooks rather than living inline
- **`src/api/`** — all `fetch()` calls to the Express backend, split by domain (`users.ts`, `resumes.ts`, `savedJobs.ts`, `jobMatch.ts`, `externalJobs.ts`, `linkedinJobs.ts`, `client.ts`), re-exported from `src/api/index.ts`
- **`src/types/`** — canonical TypeScript shapes (`resume.ts`, `job.ts`, `application.ts`, `settings.ts`), re-exported from `src/types/index.ts`
- **`src/data/`** — mock applications and mock activity-log seed data only (job listings are no longer mocked — see below), re-exported from `src/data/index.ts`
- **`src/utils/`** — pure functions: mapping raw bdjobs/LinkedIn shapes into the shared `Job` type, building the AI match-batch request, resolving search keywords, filtering/sorting

### Backend (`server/`)
- All backend code lives under `server/` — a clean boundary from the frontend's `src/`. `server/server.js` is now a thin ~70-line composition file (Express/CORS/DB setup, mounts routers) — the former ~1,150-line monolith (previously at the project root) was split into `server/routes/` (one file per resource, plus `server/routes/externalJobs/`), `server/ai/` (Groq/Gemini providers + the shared fallback wrapper), `server/resumeParsing/` (the parse prompt, transaction-insert helpers, and profile reassembly), `server/pdf/`, and `server/upload/`, so the 100-line rule now applies here too, same as the frontend
- `callAIAPI()` (`server/ai/callAIAPI.js`) is the single shared call site for all five AI features; it tries Groq first and falls back to Gemini once on any failure (rate limit, malformed response, network error) — both provider functions share an identical `(systemPrompt, userPrompt, options) → parsed result` contract
- No route ever forwards a caught AI/DB error's raw `.message` to the client — a failed AI call embeds the full upstream provider error bodies (internal org IDs, billing URLs), and a failed DB call can name real table/column names. Every route logs the real error server-side and returns a clean branded message instead (429 when `err.bothRateLimited`, otherwise a generic 502/500)
- Normalized SQLite schema centered on `resumes`; all child tables cascade-delete via foreign keys
- Resume parse: text extraction → AI JSON-mode completion → `BEGIN TRANSACTION` / `COMMIT` / `ROLLBACK` multi-table insert
- `PATCH` endpoints use a targeted `UPDATE` from a fixed column allowlist (not `INSERT OR REPLACE`) to avoid clobbering unspecified columns
- Schema changes to already-created tables use idempotent `PRAGMA table_info` + `ALTER TABLE … ADD COLUMN` migrations, not just an updated `CREATE TABLE IF NOT EXISTS`
- External job text (title/company/location/experience/education/description) is treated as **untrusted third-party data**: sanitized/truncated before being embedded in a prompt, explicitly labeled as data-not-instructions in the system prompt, and the AI's response is re-validated server-side (`clampMatchRate`, `sanitizeMatchEntry`) regardless of what the model returns
- The LinkedIn full-description endpoint only accepts real `linkedin.com/jobs/view/...` URLs (regex-enforced) to prevent it being used as an open SSRF proxy

### What's real vs. mock

| Feature | Source |
|---------|--------|
| Resume profiles & AI analysis | **SQLite** via REST API + Groq/Gemini |
| Saved jobs & inline notes | **SQLite** via REST API, scoped per resume |
| Job listings & match rates | **Live** — bdjobs.com + LinkedIn, scored by one batched AI call per page load |
| Match Matrix experience alignment | **AI** via `/api/jobs/compare` |
| Quick Apply tailored resume + cover letter | **AI** via `/api/jobs/generate-application`, rendered server-side as PDFs |
| Account name, email, notification prefs, API key label | **SQLite** via REST API |
| AI provider configuration status | **REST API** (`/api/config/status`) |
| Applications pipeline | **Mock** — client-only, resets on "Reset sandbox state" |
| Activity feed & notifications dropdown | **Mock** — client-only |
| Skill add, profile field edits | **Client-side only** — not persisted |

---

## Getting started

### Prerequisites
- [Node.js](https://nodejs.org/) 18 or later
- A [Groq API key](https://console.groq.com/) and/or a [Gemini API key](https://aistudio.google.com/apikey) (free tiers available) — at least one is required

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set at least one AI provider key:

```bash
cp .env.example .env
```

```env
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Both keys live **server-side only** — neither is ever sent to the browser, and neither should be given a `VITE_`-prefixed copy (that would bundle it into client JS).

### 3. Start both servers

Both processes must be running for API-backed features (resume parsing, job listings, saved jobs, match matrix, Quick Apply, settings) to work.

**Terminal 1 — Express API (port 3001):**
```bash
npm run server
```

**Terminal 2 — Vite dev server (port 3000):**
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

> On first start the backend auto-creates `talentai.db` and runs schema migrations. A default user `user-default` is seeded automatically.

### Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server on `:3000` |
| `npm run server` | Express API server on `:3001` |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`) — no separate test runner exists |
| `npm run clean` | `rm -rf dist server/server.js` — careful, this deletes `server.js` itself, not just build output |

---

## Environment variables

| Variable | Required | Description |
|----------|----------|--------------|
| `GROQ_API_KEY` | One of the two* | Groq API key — primary AI provider, used by `server/server.js` only |
| `GEMINI_API_KEY` | One of the two* | Gemini API key — automatic fallback when Groq fails for any reason, used by `server/server.js` only |
| `PORT` | No | API server port (default: `3001`) |

\* At least one of the two keys must be set for resume parsing, job matching, job comparison, and application generation to work. There is no `GROK_API_KEY` alias.

---

## API reference

Base URL: `http://localhost:3001/api`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/users` | List all users |
| `POST` | `/users` | Create or upsert a user |
| `PATCH` | `/users/:id` | Update account name/email, API key label, or notification prefs (targeted column update) |
| `GET` | `/config/status` | Returns `{ aiConfigured: boolean }` — key values never exposed |
| `GET` | `/resumes?userId=` | List resume summaries for a user |
| `GET` | `/resumes/:id` | Full `ResumeProfile` — reassembled from normalized tables |
| `POST` | `/resumes/parse` | Upload + AI-parse a resume (`multipart/form-data`, field `file`) |
| `DELETE` | `/resumes/:id` | Delete a resume (cascades to all child tables) |
| `GET` | `/saved-jobs?resumeId=` | List saved job matches for a resume |
| `POST` | `/saved-jobs` | Save or upsert a job match |
| `PATCH` | `/saved-jobs/:id` | Update notes on a saved job (does not touch match data) |
| `DELETE` | `/saved-jobs/:id` | Remove a saved job |
| `GET` | `/external-jobs` | Proxy: live bdjobs.com listings (`page`, `rpp`, `keyword`) |
| `GET` | `/external-jobs/bdjobs/description?jobId=` | Lazily fetch one bdjobs listing's full description |
| `GET` | `/external-jobs/linkedin` | Proxy/scrape: live LinkedIn "guest" listings (`keywords`, `location`, `count`) |
| `GET` | `/external-jobs/linkedin/description?url=` | Lazily fetch one LinkedIn listing's full description (URL must match `linkedin.com/jobs/view/...`) |
| `POST` | `/jobs/compare` | AI alignment between a profile and one job — returns `{ alignment: string }` |
| `POST` | `/jobs/match-batch` | AI match scoring for a whole page of listings in one call — returns `{ matches: [...] }` |
| `POST` | `/jobs/generate-application` | AI-tailored resume + cover letter for one profile/job pair, rendered as base64 PDFs |

---

## Database schema

SQLite file: **`talentai.db`** — created automatically in the project root on first server start, gitignored.

```
users
 └── resumes
      ├── resume_skills       (skill_name, category)
      ├── experience          (role, company, dates, bullets JSON)
      ├── education           (degree, institution, graduation_year)
      ├── certifications      (name, institution, year)
      ├── projects            (title, description, technologies JSON, github_url, live_url)
      ├── languages           (name, proficiency)
      ├── social_links        (platform, url)
      ├── resume_analysis     (strengths JSON, improvements JSON) — 1:1 with resumes
      └── job_matches         (job_id, match_rate, why_matches, missing_skills JSON,
                               resume_improvements JSON, saved_at, notes)
```

All child tables cascade-delete on `resumes` delete. Array-valued columns (bullets, technologies, strengths, improvements, missing_skills, resume_improvements) are stored as JSON strings and parsed at the API boundary. Every `resume_id`/`user_id` foreign-key column has an index (`server/database/schema/indexes.js`) — SQLite doesn't create these automatically. Schema changes to already-existing tables (e.g. `users.api_key_label`, `users.notify_*`, `job_matches.saved_at`/`notes`) are applied via idempotent `PRAGMA table_info` + `ALTER TABLE … ADD COLUMN` checks in `server/database/migrations.js`, since `CREATE TABLE IF NOT EXISTS` is a no-op against a pre-existing `talentai.db` file. `server/database.js` is a thin orchestrator; the schema/migrations/seed logic lives under `server/database/`.

---

## Project structure

```
├── src/
│   ├── App.tsx                        # Composes 8 hooks; no local view-routing logic itself
│   ├── ActiveViewRouter.tsx            # tab switch → active *View component
│   ├── ActiveViewRouterProps.ts        # shared prop shape spread into each *View
│   ├── main.tsx                       # React entry point
│   ├── index.css                      # MD3 design tokens, Tailwind theme, global utilities
│   ├── hooks/                          # one hook per state domain (useResumeProfiles, useJobListings, ...)
│   ├── api/                            # fetch() wrappers split by domain, barrel-exported via index.ts
│   ├── types/                          # shared TypeScript interfaces, barrel-exported via index.ts
│   ├── data/                           # mock applications/activity seed data, barrel-exported via index.ts
│   ├── utils/                          # pure helpers: job-source mapping, match-input building, filters
│   ├── styles/                         # dark-tokens.css, utilities.css (glass-card, skeleton-shimmer, etc.)
│   └── components/
│       ├── DashboardView.tsx, ResumeView.tsx, JobSearchView.tsx,
│       │   SavedJobsView.tsx*, ApplicationsView.tsx, AnalyticsView.tsx, SettingsView.tsx
│       │                                 # one top-level component per sidebar tab
│       ├── ResumeBootstrapGate.tsx     # loading/error/no-profile guard, render-prop narrowing
│       ├── AppApplicationPackageOverlay.tsx / ApplicationPackageModal.tsx / ApplicationPackagePreview.tsx
│       │                                 # Quick Apply: AI-tailored resume + cover letter, PDF preview/download
│       ├── JobFeedList.tsx / JobFeedColumn.tsx / JobFeedStatus.tsx
│       │                                 # two-column bdjobs/LinkedIn feed with partial-failure status
│       ├── JobSearchModals.tsx, MatchMatrixModal.tsx, JobDetailsModal.tsx
│       ├── ScoreProgressionChart.tsx, SkillsDistributionChart.tsx, ApplicationsPerMonthChart.tsx,
│       │   RecruitingRatesCard.tsx, TopSkillsChart.tsx    # hand-rolled SVG/CSS charts, no library
│       ├── AccountSection.tsx, ApiKeysSection.tsx, NotificationSettingsSection.tsx,
│       │   SecuritySection.tsx, ResumeManagementSection.tsx, UiSettingsSection.tsx
│       └── ui/
│           ├── Card.tsx, Button.tsx, Modal.tsx, Table.tsx, Toast.tsx, FilterPillGroup.tsx
├── server/                            # All backend code — a clean boundary from src/
│   ├── server.js                      # Thin composition file — Express/CORS/DB setup, mounts routers
│   ├── server-utils.js                # Pure, test-covered helpers (sanitization, rate-limit flag)
│   ├── database.js                    # Thin orchestrator — connect, createSchema, runMigrations, seed
│   ├── database/                      # schema/ (tables + indexes), migrations.js, seed.js, connection.js
│   ├── routes/                        # One file per API resource (+ routes/externalJobs/)
│   ├── ai/                             # Groq/Gemini providers + the shared callAIAPI fallback wrapper
│   ├── resumeParsing/                 # Parse prompt, transaction-insert helpers, profile reassembly
│   ├── pdf/                            # Application-package PDF builders
│   └── upload/                         # Multer config + resume text extraction
├── tests/                             # tests/api/ (node:test) + tests/e2e/ (Playwright) — see tests/README.md
├── docs/                              # app_detail.md (original design brief), submit.md
├── index.html                         # Vite HTML entry
├── vite.config.ts                     # Vite + Tailwind plugin config
├── tsconfig.json                      # TypeScript config (path alias @/*)
├── talentai.db                        # Local database (gitignored, auto-created)
├── .env.example                       # Environment variable template
└── CLAUDE.md                          # Developer guide for AI coding assistants — architecture source of truth
```

\* `SavedJobsView` composes `SavedJobTableRow.tsx`, `SavedJobNotesCell.tsx`, and `SavedJobsEmptyState.tsx`, following the same per-tab extraction pattern as the other views.

Every file under `src/` is kept at or under 100 lines — enforced by a Claude Code hook (`.claude/hooks/validation-gate.js`), not just convention. When a component or hook approaches the limit, the established pattern is to extract a genuine sub-responsibility (a sub-widget, a piece of state logic) rather than compress formatting.

---

## Origin

Originally scaffolded from [Google AI Studio](https://ai.studio/apps/527dcbd2-224a-4a4a-a049-3383a9531a45) using a Material Design 3 dashboard brief (see `docs/app_detail.md`). Significantly extended with a persistent Express + SQLite backend, multipart resume upload, dual-provider (Groq + Gemini) AI parsing and job matching, live bdjobs.com + LinkedIn job aggregation, AI-generated tailored application packages, and a normalized multi-table database schema.

## License

Private project.
