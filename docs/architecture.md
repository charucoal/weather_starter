# Architecture

This is an npm-workspaces monorepo (`frontend`, `backend`) that runs as **one Node process** in development — there is no separate frontend dev server/port to configure.

```
Browser (http://weather-starter.localhost:1355)
  -> Portless proxy (stable local .localhost URL, see scripts/dev.mjs)
    -> Express app (backend/src/server.ts), random local PORT
         - app.use('/api', ...)        -> locations router
         - Vite dev middleware (non-test, non-prod) serves the React app
         - express.static + SPA fallback in production
    -> SQLite (backend/weather.db) via Drizzle ORM
    -> data.gov.sg API (api-open.data.gov.sg) for weather data
```

## Module map

- `backend/src/server.ts` — `createApp(options)` builds the Express app and is the single entry point used by both the dev server and tests; it accepts an injectable `weatherClient` so tests can avoid real network calls. `serveFrontend` / `enableRequestLogging` default based on `NODE_ENV` (both off under `NODE_ENV=test`, set by `vitest.config.ts`).
- `backend/src/db.ts` — the only module that touches SQLite. It wraps `node:sqlite`'s `DatabaseSync` behind Drizzle's `sqlite-proxy` driver (a custom async `sqliteCallback`, not `better-sqlite3`), runs Drizzle migrations from `backend/drizzle/` on startup, and exposes `listLocations` / `createLocation` / `getLocation` / `updateWeather` / `deleteLocation` / `resetStore`. All weather fields are stored as flat columns on the `locations` table (not a separate table) and converted to/from the nested `WeatherSnapshot` shape via `rowToRecord` / `weatherToColumns`.
- `backend/src/schema.ts` — Drizzle table definition plus the `WeatherSnapshot` interface (snake_case field names — this is the shape sent to the frontend and used throughout, distinct from the DB's camelCase column names). `forecast_periods` and `daily_forecast` are stored as JSON columns.
- `backend/src/weather.ts` — `SingaporeWeatherClient`, the data.gov.sg API client. Different data.gov.sg endpoints (2-hr forecast, 24-hr forecast, 4-day forecast, station readings for temperature/humidity/rainfall/wind, UV, PSI/PM2.5) have different response shapes; this is the one place that normalizes them into a `WeatherSnapshot`. Routes depend on the `WeatherClient` interface (`getCurrentWeather`), not this concrete class, so tests inject a fake.
- `backend/src/routes/locations.ts` — REST endpoints for locations; validates lat/lon are within Singapore bounds (1.1–1.5, 103.6–104.1) before creating a location, immediately refreshes weather on creation, and degrades gracefully (keeps the placeholder snapshot) if the weather provider errors rather than failing the create.
- `frontend/src/state/store.tsx` — client-side state for the locations list (fetch/create/refresh/delete), consumed by `App.tsx` and the sidebar/card components.
- `frontend/src/api.ts` — thin fetch wrapper against `/api/*` (relative URLs only — no base URL/port config needed since Express serves both API and frontend).

## Data flow (snapshot pattern)

The app does **not** hit the external weather API on every page load:
1. `POST /api/locations` saves coordinates, then immediately calls the weather provider once and persists the resulting snapshot.
2. `GET /api/locations` reads only from `backend/weather.db`.
3. `POST /api/locations/:id/refresh` is the only other time the external API is called, overwriting the stored snapshot.
