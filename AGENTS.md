# ResortMap — agent context

Interactive resort map with cabana booking. **Monorepo** (npm workspaces): `client/` (React + Vite + TypeScript + Tailwind), `server/` (Express 5).

## Commands (repo root)

- `npm install` — install all workspaces
- `npm run start` — dev: Vite + API (concurrently)
- `npm run test` — server Vitest + Supertest
- `npm run lint` — client ESLint
- `npm run build` — client production build
- `npm run format` / `npm run format:check` — Prettier

## Data locations

- Map: [`map.ascii`](map.ascii) (repo root; override with `--map`)
- Guests: [`server/bookings.json`](server/bookings.json) (default; override with `--bookings`)
- Tile images: [`client/public/assets/`](client/public/assets/) — served by Vite as `/assets/*` in dev; Express also serves `/assets` from this folder for API parity

## Conventions

- **Client component files**: kebab-case (e.g. `resort-map.tsx`, `booking-modal.tsx`)
- **Exports**: prefer **named exports** for app and feature components (`export const App`, `export const ResortMap`)
- **Env**: [`client/src/env.ts`](client/src/env.ts) — Zod-validated `VITE_*` vars (see [`client/.env.example`](client/.env.example))
- **Formatting**: Prettier with **single quotes** ([`.prettierrc`](.prettierrc))
- **Validation**: Zod on the client; server uses manual checks in [`server/src/app.js`](server/src/app.js)

## API

- `GET /api/health`, `GET /api/map-data`, `POST /api/book`
- Details: [`README.md`](README.md)

## Local AI assets

- Project rule: [`.cursor/rules/resortmap.mdc`](.cursor/rules/resortmap.mdc)
- Optional workflow skill: [`.cursor/skills/resortmap/SKILL.md`](.cursor/skills/resortmap/SKILL.md)
