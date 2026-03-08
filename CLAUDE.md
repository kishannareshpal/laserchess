# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Year

2026

## Project Overview

Laser Chess is a browser-based board game built as a pure SPA. No server-side logic — all game state runs in the client. Rendered via PixiJS React on an HTML canvas.

## Tech Stack

- **Framework:** TanStack Start (React 19, configured as SPA — no SSR, no server functions)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4 + shadcn/ui (radix-nova style) + CVA for variants
- **Routing:** TanStack Router (file-based, routes in `src/routes/`)
- **Rendering:** PixiJS + `@pixi/react` for canvas-based game board
- **State:** Zustand for game state, TanStack Query for any async data (e.g. leaderboard)
- **Build:** Vite 7, pnpm
- **Testing:** Vitest + React Testing Library + jsdom

## Commands

```bash
pnpm dev          # Start dev server (port 3000)
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm test         # Run Vitest
pnpm lint         # ESLint check
pnpm format       # Prettier format (ts/tsx/js/jsx)
pnpm typecheck    # TypeScript type check
```

## Architecture

### SPA-only — no server logic

This app is a pure SPA. Do **not** use:

- `createServerFn` — no server functions
- `server.handlers` — no API routes
- SSR loaders that touch server-only APIs
- Any Node.js / server-side imports

Route loaders are fine for client-side data prep (e.g. reading from Zustand or local storage). All game logic runs in the browser.

### Project structure

```
src/
  features/           # Domain-grouped feature modules
    game/             # Core game logic, board state, laser tracing
    ui/               # Menus, HUD, overlays
    # Future: replay/, lobby/, settings/
  components/ui/      # shadcn/ui primitives
  lib/                # Shared utilities: cn() (utils.ts)
  routes/             # File-based routing (TanStack Router)
    __root.tsx        # HTML shell, head metadata, devtools
    index.tsx         # Home / main menu
    game.tsx          # Game canvas route
```

**File-based routing:** Routes live in `src/routes/`. The file `src/routeTree.gen.ts` is auto-generated — never edit it manually. Routes use `createFileRoute()` from TanStack Router.

**Root layout:** `src/routes/__root.tsx` provides the HTML shell, head metadata, stylesheets, and devtools.

**UI components:** shadcn/ui components in `src/components/ui/`. Use `cn()` from `src/lib/utils.ts` for Tailwind class merging. Add new shadcn components via `npx shadcn@latest add <component>`.

**Path aliases:** `@/*` maps to `src/*`.

**Styling:** OKLch color system with CSS variables for light/dark mode, defined in `src/styles.css`.

### Feature module convention

Business logic lives in `src/features/<domain>/`. Each feature uses sub-folders by type:

```
src/features/<feature-name>/
  index.ts              # Barrel: public API of this feature
  store.ts              # Zustand store for this domain (if needed)
  schemas/              # Zod validation schemas + inferred types
  types/                # TypeScript types, interfaces
  components/           # Feature-scoped React components
    <component-name>.tsx
  hooks/                # Feature-specific React hooks
    <hook-name>.ts
  utils/                # Pure functions (game logic, laser tracing, etc.)
    <util-name>.ts
```

Rules:

- No API routes or server functions — this is a pure SPA
- Game logic (move validation, laser tracing, win detection) lives in `src/features/game/utils/` as pure functions — keep them framework-agnostic and easy to unit test
- Zustand stores are the source of truth for game state
- `components/` and `hooks/` created only when needed, not pre-emptively
- `index.ts` barrel re-exports the public API

### PixiJS / Canvas

- Use `@pixi/react` components (`<Stage>`, `<Sprite>`, `<Graphics>`, etc.) inside the game route
- Keep PixiJS rendering concerns isolated in `src/features/game/components/`
- Game logic (state, rules) must be fully decoupled from rendering — the Pixi layer only reads from the Zustand store and dispatches actions
- Avoid direct Pixi imperative calls outside of `useApp()` hooks or `onMount`/`onUpdate` callbacks

## Code Style

- Prettier: 80-char width, no semicolons, single quotes, Tailwind plugin
- ESLint: @tanstack/eslint-config
- Filenames: kebab-case
- Run `pnpm format` and `pnpm lint --fix` instead of fixing lint issues one by one
