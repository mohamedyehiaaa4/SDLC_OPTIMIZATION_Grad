# RepoMind — Frontend

Next.js (App Router), React, TypeScript and Tailwind CSS. The frontend is UI only: it calls the FastAPI backend through `/api/*` (proxied in `next.config.mjs`) and never talks to Supabase directly. See the root `README.md` to run the project.

## Structure

```
src/
  app/
    (marketing)/         # public landing page
    (auth)/              # /login, /signup — share one layout (shader background + logo)
    dashboard/           # sidebar + topbar app shell, one folder per route
  components/
    ui/                  # shared building blocks: Button, Panel, StatCard, icons, BrandMark...
    auth/                # AuthForm, Velaris background
    dashboard/           # Sidebar, Topbar, StageTabs, ChatPanel, AccountDetails
      nav.ts             # the list of dashboard pages (sidebar links + topbar titles)
      CurrentUserProvider.tsx  # loads the logged-in user once; read it with useCurrentUser()
    marketing/           # Hero, Footer, Reveal, StageCycler
  services/              # one file per backend feature (auth.service.ts), built on lib/api.ts
  lib/                   # api.ts (fetch wrapper), utils.ts
  middleware.ts          # redirects /dashboard <-> /login based on the session cookies
```

## Adding a feature

1. Backend: add `backend/app/<feature>/` (`router.py`, `service.py`, `schemas.py`), raise `AppError` for user-facing errors, and include the router in `backend/app/main.py`.
2. Frontend: add `src/services/<feature>.service.ts` calling `apiRequest`.
3. Add the page under `src/app/dashboard/<feature>/` and one entry in `components/dashboard/nav.ts`.
4. Components render and call the service; the current user comes from `useCurrentUser()`.
