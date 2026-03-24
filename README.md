# Resort Map

An interactive web app for rendering a resort map and handling cabana booking/cancellation.

Stack:
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express
- Backend tests: Vitest + Supertest

## Implemented Features

- Loads map layout from `map.ascii` and guest records from `bookings.json`.
- Exposes REST API for map data, booking, and booking cancellation.
- Renders the resort map with CSS Grid.
- Cabana interactions:
  - available cabana -> booking form;
  - booked cabana -> booking info + cancellation flow.
- Visual differentiation for booked cabanas.
- In-memory booking storage on the backend (no database / no persistence).

## Project Structure

- `client` - React/Vite frontend
- `server` - Express backend
- `assets` - tile images used by the map
- `map.ascii` - ASCII map layout
- `bookings.json` - valid guest pairs (`room` + `guestName`)
- `scripts/start.js` - single entrypoint for starting frontend + backend

## Requirements

- Node.js 20+ (or current LTS)
- npm 10+

## Installation

From the project root:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

## Run (Single Command)

From the project root:

```bash
npm run start
```

This command starts both frontend and backend.

Default input files:
- `map.ascii`
- `bookings.json`

Custom files can be passed as startup arguments:

```bash
npm run start -- --map ./map.ascii --bookings ./bookings.json
```

## Local URLs

- Frontend: `http://localhost:5173` (or next available port)
- Backend: `http://localhost:3001`

## API

### `GET /api/health`
Simple server health check endpoint.

### `GET /api/map-data`
Returns map data with current cabana availability.

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
- guest must exist in `bookings.json`;
- selected tile must be a cabana (`W`);
- cabana must not already be booked.

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
- guest must exist in `bookings.json`;
- only the same guest who created the booking can cancel it.

## Tests

Run backend tests:

```bash
npm run test --prefix server
```

Covered scenarios:
- successful booking;
- booking rejection for unknown guest;
- successful cancellation;
- cancellation rejection by a different guest.

## Build Frontend

```bash
npm run build --prefix client
```

## Core Design Decisions / Trade-offs

- Booking state is stored in-memory (`Map`) to keep the solution simple and aligned with the task requirements.
- Guest validation is done against static `bookings.json` data.
- Frontend communicates directly with REST endpoints without additional global state tooling.
- No authentication layer was added; `room + guestName` acts as identity proof per requirements.
