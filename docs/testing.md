# Testing

- `vitest.config.ts` restricts tests to `backend/src/**/*.test.ts`, runs with `pool: 'forks'` and `fileParallelism: false` (tests share the real SQLite file, so they can't run in parallel), and forces `NODE_ENV=test` / `LOG_LEVEL=silent`.
- `backend/src/routes/locations.test.ts` uses `supertest` against `createApp({ weatherClient: <fake> })` to avoid real external API calls.
