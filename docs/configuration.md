# Configuration

- `DATABASE_PATH` overrides the SQLite file location (used by `db.ts`, `scripts/reset.mjs`, and `drizzle.config.ts`).
- `WEATHER_API_KEY` is optional; increases data.gov.sg rate limits.
- `PORTLESS_PORT` / `PORTLESS_HTTPS` configure the Portless dev proxy (see `scripts/dev.mjs`).
- Frontend-only overrides (`VITE_BACKEND_PORT`, `VITE_API_TARGET`) live in `frontend/.env.local` — not needed in normal dev since the frontend is served by the same Express process.
