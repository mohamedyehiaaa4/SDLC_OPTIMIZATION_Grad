# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Repository state

This is a graduation project ("RepoMind": a repository-intelligent AI platform for SDLC assistance).

- `frontend/`: Next.js 14 (App Router) + TypeScript + Tailwind. **UI only**: it never calls Supabase directly.
- `backend/`: FastAPI. Owns all logic (auth now; planning features next). One package per feature (`app/auth/`: `router.py`, `service.py`, `schemas.py`, `cookies.py`, `dependencies.py`); shared setup in `app/core/`.
- `phase1_schema.sql`: the Supabase/PostgreSQL schema, applied once in the Supabase SQL Editor. It relies on Supabase's `auth` schema, so it does not run on plain PostgreSQL.
- One `.env` (git-ignored), one `.env.example` and one `requirements.txt`, all at the **repository root**, shared by frontend and backend.

## Commands

```bash
# Backend (from repo root, once): python -m venv .venv && .venv\Scripts\pip install -r requirements.txt
cd backend && ..\.venv\Scripts\uvicorn app.main:app --reload --port 8000
.venv\Scripts\ruff check backend && .venv\Scripts\ruff format backend

# Frontend
cd frontend && npm install && npm run dev      # http://localhost:3000
npm run lint
```

`npm run build` currently fails on pre-existing type errors in `src/components/ui/hero.tsx`.

## How the frontend and backend connect

- The browser only calls `/api/*`. `frontend/next.config.mjs` rewrites it to `BACKEND_URL`, so requests are same-origin and no CORS is needed. `next.config.mjs` also loads the root `.env` (with `forceReload`, because Next caches env files from `frontend/`).
- Browser calls live in `frontend/src/services/*.service.ts` via `src/lib/api.ts`. Components only render and call services.
- Backend errors always come back as one readable sentence in `detail` (handlers for `AuthError` and `RequestValidationError` in `backend/app/main.py`), and `apiRequest` throws it as `ApiError(message, status)`.

## Auth

- Credentials live in Supabase Auth (`auth.users`, password hashed). The `on_auth_user_created` trigger copies name and email into `public.users`. Supabase's "Confirm email" setting should be off; otherwise login returns 403 until the user confirms.
- Endpoints (`backend/app/auth/router.py`): `POST /auth/signup` (201, no session: the user is sent to `/login?registered=1`), `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout` (204), `GET /auth/me`.
- The session is two httpOnly cookies set by the backend (`backend/app/auth/cookies.py`): `repomind_access` (expires with the Supabase access token) and `repomind_refresh` (30 days). Nothing about the user is stored in the browser. Set `COOKIE_SECURE=true` in production.
- Protect a backend route with `Depends(get_current_user)` (`backend/app/auth/dependencies.py`). It reads the access cookie and has Supabase validate it.
- Input rules are in `backend/app/auth/schemas.py`: email is trimmed and lowercased, and the signup password needs 8+ characters with a letter and a number. `AuthForm.tsx` mirrors these rules for instant feedback, but the backend is the authority.
- Frontend:
  - `src/lib/api.ts`: on a 401, calls `/auth/refresh` once (shared between concurrent requests) and retries. It skips this for the login, signup, refresh and logout paths.
  - `src/middleware.ts`: only checks that a cookie *exists*. It redirects `/dashboard` to `/login` when neither cookie is present, and `/login` or `/signup` to `/dashboard` when the access cookie is present. The cookie names there must match `cookies.py`.
  - `Topbar.tsx` loads the user from `/auth/me`. If that still returns 401 after the refresh attempt, it logs out and sends the user to `/login`.

The authoritative spec for the current work is `phase_1_planning_requirements_final_latest.md` (Phase 1: Planning and Requirements). Read it before designing or implementing anything in Phase 1. Per `AGENTS.md`, it is a private planning document: do not commit it, and do not copy its detailed requirements into tracked files (including this one).

## Phase 1 architecture (big picture)

The core rule: **AI proposes → authorized human reviews → Project Manager approves → approved artifacts are persisted → dependent work becomes eligible.** AI components never approve their own output and never get unrestricted database or Jira access.

Layering (framework choices are recommended, not frozen — LangGraph for orchestration and PostgreSQL for persistence are candidates; pgvector is optional):

```
Web/Chat UI → Planning Orchestrator (workflow state, approval gates)
            → AI agents (draft/analyze only)
            → Application services (permissions, validation, persistence, history, traceability, stale flags)
            → Project Intelligence Memory (consumed by Phase 2)
```

Keep these concerns in separate modules — AI generation, persistence, workflow control, and external integrations. Suggested layout: `app/planning/{workflow,agents_or_capabilities,services,repositories,schemas,tools,api}`, `app/integrations/jira`, `app/project_memory` (names are flexible).

Current agent structure (the spec's final section, §13, is the latest decision and supersedes the earlier grouping in §6):

- Planning Orchestrator — controls state and gates; makes no business-content decisions
- Requirements Discovery Agent, Requirements Authoring Agent, Story & Acceptance Criteria Agent
- Planning Agent with two nodes: Sprint Planning and Task Assignment
- Non-agents: application/planning services, persistence layer, and the **Jira Integration Service, which is deterministic backend code, not an AI agent**
- There is no separate Quality Evaluator agent; quality checks are automatic and passing them never approves an artifact

Invariants to preserve in any implementation:

- Workflow state references persisted artifacts by ID; workflow memory is not the source of truth.
- Only the Project Manager edits/approves planning artifacts; the Software Architect can review and suggest but not edit or approve.
- Material upstream edits mark dependent downstream artifacts as needing re-review (requirement → story → acceptance-criteria traceability).
- Jira is optional. Every Jira write requires a preview plus explicit PM confirmation; Jira refresh is manual and yields a fresh proposal before further writes.
- Credentials/integration tokens must never be placed in model prompts.
- No false-success states: model failures, invalid structured output, Jira partial success, etc. must surface explicitly.
