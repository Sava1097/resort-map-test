# Resort Map

An interactive web app for rendering a resort map and handling cabana booking.

Stack:

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express
- Backend tests: Vitest + Supertest

## Implemented Features

- Loads map layout from `map.ascii` and guest records from `server/bookings.json`.
- Exposes REST API for map data and booking.
- Renders the resort map with CSS Grid.
- Cabana interactions:
  - available cabana -> booking form;
  - booked cabana -> booking info.
- Visual differentiation for booked cabanas.
- In-memory booking storage on the backend (no database / no persistence).

## Project Structure

- [`AGENTS.md`](AGENTS.md) — short overview for humans and coding agents (commands, paths, conventions)
- `client` - React/Vite frontend
- `server` - Express backend
- `client/public/assets` - tile images used by the map (also served by the API at `/assets`)
- `map.ascii` - ASCII map layout
- `server/bookings.json` - valid guest pairs (`room` + `guestName`)
- `scripts/start.js` - single entrypoint for starting frontend + backend

## Requirements

- Node.js **20.19+** or **22.12+** (matches Vite 8 / tooling engine ranges)
- npm 10+

The root `package.json` lists `@rolldown/binding-darwin-arm64` as a dependency so `npm install` with npm workspaces reliably installs the native module Vite’s bundler needs on Apple Silicon; optional entries cover other platforms.

## Installation

From the project root (npm workspaces install `client` and `server` dependencies):

```bash
npm install
```

## Run (Single Command)

From the project root:

```bash
npm run start
```

This command starts both frontend and backend.

Default input files:

- `map.ascii`
- `server/bookings.json`

Custom files can be passed as startup arguments:

```bash
npm run start -- --map ./map.ascii --bookings ./server/bookings.json
```

## Local URLs

- Frontend: `http://localhost:5173` (or next available port)
- Backend: `http://localhost:3001`

### Frontend API base URL

By default the client uses **same-origin** requests (`/api`, `/assets`) and the Vite dev server **proxies** those paths to the backend on port 3001. To point the SPA at a separate API host (e.g. production preview), set `VITE_API_BASE_URL` in `client/.env` (see `client/.env.example`).

## API

### `GET /api/health`

Simple server health check endpoint.

### `GET /api/map-data`

Returns JSON `{ "map": { "width", "height", "tiles" } }` with current cabana availability (no server file paths in the response).

Example cabana tile payload:

```json
{
  "x": 3,
  "y": 11,
  "type": "W",
  "booked": true,
  "status": "booked",
  "bookedByGuestName": "Alice Smith",
  "bookedByRoom": "101"
}
```

### `POST /api/book`

Creates a cabana booking.

Request body:

```json
{
  "room": "101",
  "guestName": "Alice Smith",
  "x": 3,
  "y": 11
}
```

Validation rules:

- guest must exist in `server/bookings.json`;
- selected tile must be a cabana (`W`);
- cabana must not already be booked;
- each guest may have at most one active cabana booking.

### `DELETE /api/book`

Cancels an existing cabana booking.

Request body:

```json
{
  "room": "101",
  "guestName": "Alice Smith",
  "x": 3,
  "y": 11
}
```

Validation rules:

- guest must exist in `server/bookings.json`;

## Tests

Run backend tests:

```bash
npm run test
```

Covered scenarios:

- successful booking;
- booking rejection for unknown guest;
- booking rejection when the cabana is already booked;
- booking rejection when the guest already has another cabana;

## Lint & build

```bash
npm run lint
npm run build
```

## Core Design Decisions / Trade-offs

- Booking state is stored in-memory (`Map`) to keep the solution simple and aligned with the task requirements.
- Guest validation is done against static `server/bookings.json` data.
- TanStack Query handles fetching and cache invalidation after booking
- No authentication layer was added; `room + guestName` acts as identity proof per requirements.
