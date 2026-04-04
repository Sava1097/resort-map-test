---
name: resortmap-workflow
description: >-
  Run and change the ResortMap monorepo (cabana booking demo): where data lives,
  dev commands, and client/server boundaries.
---

# ResortMap workflow

## Quick run

From repository root: `npm install`, then `npm run start`. Frontend defaults to same-origin `/api` and `/assets` (Vite proxy to port 3001).

## Touch points

| Concern | Location |
|--------|----------|
| Map ASCII | `map.ascii` (root) |
| Guest list | `server/bookings.json` |
| Tile PNGs | `client/public/assets/` |
| Client env schema | `client/src/env.ts` |
| Booking API | `server/src/app.js` |

## When changing booking rules

Update server validation and extend `server/src/app.test.js`. If the response shape changes, update `client/src/api.ts` and any tile types in `client/src/components/map-tile.tsx`.
