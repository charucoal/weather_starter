# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Weather Starter is a TypeScript weather app that tracks Singapore locations and stores the latest weather snapshot for each one (Node/Express backend, React/Vite frontend, SQLite via Drizzle).

This is an **npm workspaces** monorepo (`frontend`, `backend`) — `npm install` at the root installs both.

## Commands

```bash
npm run dev    # Start Express + Vite (single process) through Portless
npm run build  # Build frontend (vite build) + compile backend TypeScript
npm run start  # Run the compiled production server (after build)
npm test       # Run backend API tests (vitest run)
```

Single test file: `npx vitest run backend/src/routes/locations.test.ts`
Single test by name: `npx vitest run -t "pattern"`

There is no single typecheck script — `tsc` runs per workspace: `tsc -p backend/tsconfig.json --noEmit` or `tsc -p frontend/tsconfig.json --noEmit`.

**Never delete or edit `backend/weather.db` (or its `-shm`/`-wal` files) directly while the dev server is running** — `npm run reset` is the safe way to clear it.

## More detail

- [Architecture](docs/architecture.md) — module map and data flow
- [Testing](docs/testing.md) — test config and patterns
- [Configuration](docs/configuration.md) — environment variables
