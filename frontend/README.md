# RepoMind — Frontend Prototype

A front-end-only prototype of the RepoMind UI, built with **Next.js (App Router), React, TypeScript, and Tailwind CSS**. There is no backend: auth is a mock form that redirects into the dashboard, and every dashboard list starts empty since no real projects exist.

## Site structure

**Marketing (public)** — dark, Kiro-style landing site with its own nav/footer:
- `/` — landing page: hero, product preview, the four SDLC stages, "how it works", closing CTA
- `/login`, `/signup` — centered auth cards ("Continue with GitHub" + email/password). Either form just pushes you to `/dashboard` — there's no real account system yet.

**Dashboard (app)** — the formal, sidebar-driven workspace, gated behind the marketing site's sign in/up:
- `/dashboard` — workspace overview: welcome banner, summary stat row, empty projects list
- `/dashboard/requirements`, `/dashboard/design`, `/dashboard/implementation`, `/dashboard/testing` — each has an **AI Chat** tab (greeting only, input disabled) and a **Dashboard** tab (zeroed stats, empty tables/panels)
- `/dashboard/projects` — empty project list
- `/dashboard/settings` — account info + empty integrations panel

The dashboard topbar now shows a page title *and* subtitle (breadcrumb-style), and the user chip/avatar use a flat, single accent color instead of the previous purple gradient — meant to read as a more formal, enterprise product surface than the original mockup.

## Run it locally

This sandbox's npm registry access is blocked by org policy, so the dependencies couldn't be installed or build-verified here — the code was written and type-checked by hand instead (against the real `tsc` compiler with stubbed `next`/`react` types). On your own machine:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Structure

```
src/
  app/
    (marketing)/         # landing, /login, /signup — public site, own layout
    dashboard/           # sidebar + topbar app shell, one folder per route
  components/
    marketing/           # Navbar, Footer, AuthForm (mock sign in/up)
    ...                  # Sidebar, Topbar, StageTabs, ChatPanel, StatCard, etc.
```

`StageTabs` is the shared client component powering the AI Chat / Dashboard toggle on the four SDLC-stage pages. `AuthForm` is the shared client component behind both `/login` and `/signup`.
