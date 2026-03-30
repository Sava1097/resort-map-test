const fs = require("node:fs/promises");
const path = require("node:path");
const express = require("express");
const cors = require("cors");

function parseMapToTiles(mapText) {
  const rows = mapText
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => line.length > 0);
  const tiles = [];

  rows.forEach((row, y) => {
    [...row].forEach((tileType, x) => {
      tiles.push({ x, y, type: tileType });
    });
  });

  return {
    width: rows[0]?.length ?? 0,
    height: rows.length,
    tiles,
  };
}

function bookingKey(x, y) {
  return `${x}:${y}`;
}

function validateGuest(bookings, room, guestName) {
  return bookings.some(
    (booking) =>
      booking.room === String(room).trim() &&
      booking.guestName.toLowerCase() === String(guestName).trim().toLowerCase(),
  );
}

function createApp({ mapPath, bookingsPath, assetsDir }) {
  const app = express();
  const bookedCabanas = new Map();

  app.use(cors());
  app.use(express.json());
  app.use("/assets", express.static(assetsDir));

  async function loadData() {
    const [mapText, bookingsText] = await Promise.all([
      fs.readFile(mapPath, "utf8"),
      fs.readFile(bookingsPath, "utf8"),
    ]);

    return {
      map: parseMapToTiles(mapText),
      bookings: JSON.parse(bookingsText),
    };
  }

  function mapWithBookingStatus(map) {
    return {
      ...map,
      tiles: map.tiles.map((tile) => {
        if (tile.type !== "W") {
          return tile;
        }

        const booking = bookedCabanas.get(bookingKey(tile.x, tile.y));
        const booked = Boolean(booking);
        return {
          ...tile,
          booked,
          status: booked ? "booked" : "available",
          bookedByGuestName: booking?.guestName ?? null,
          bookedByRoom: booking?.room ?? null,
        };
      }),
    };
  }

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/map-data", async (_req, res) => {
    try {
      const { map } = await loadData();
      res.json({
        mapPath,
        bookingsPath,
        map: mapWithBookingStatus(map),
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to read map/bookings files.",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.post("/api/book", async (req, res) => {
    const { room, guestName, x, y } = req.body ?? {};

    if (!room || !guestName || !Number.isInteger(x) || !Number.isInteger(y)) {
      return res.status(400).json({
        error: "room, guestName, x and y are required.",
      });
    }

    try {
      const { map, bookings } = await loadData();
      const tile = map.tiles.find((mapTile) => mapTile.x === x && mapTile.y === y);

      if (!tile || tile.type !== "W") {
        return res.status(400).json({ error: "Selected tile is not a cabana." });
      }

      if (!validateGuest(bookings, room, guestName)) {
        return res.status(401).json({ error: "Guest not found." });
      }

      const alreadyHasBooking = Array.from(bookedCabanas.values()).some(
        (b) => 
          b.room === String(room).trim() && 
          b.guestName.toLowerCase() === String(guestName).trim().toLowerCase()
    );

      if (alreadyHasBooking) {
        return res.status(400).json({ 
          error: `Guest ${guestName} from room ${room} already has an active booking. One cabana per room/guest only.` 
        });
      }

      const key = bookingKey(x, y);
      if (bookedCabanas.has(key)) {
        return res.status(400).json({ error: "Cabana is already booked." });
      }

      bookedCabanas.set(key, {
        room: String(room).trim(),
        guestName: String(guestName).trim(),
      });
      return res.json({
        success: true,
        booking: { room: String(room), guestName: String(guestName), x, y },
      });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to process booking.",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.delete("/api/book", async (req, res) => {
    const { room, guestName, x, y } = req.body ?? {};

    if (!room || !guestName || !Number.isInteger(x) || !Number.isInteger(y)) {
      return res.status(400).json({
        error: "room, guestName, x and y are required.",
      });
    }

    try {
      const { map, bookings } = await loadData();
      const tile = map.tiles.find((mapTile) => mapTile.x === x && mapTile.y === y);

      if (!tile || tile.type !== "W") {
        return res.status(400).json({ error: "Selected tile is not a cabana." });
      }

      if (!validateGuest(bookings, room, guestName)) {
        return res.status(401).json({ error: "Guest not found." });
      }

      const key = bookingKey(x, y);
      const booking = bookedCabanas.get(key);
      if (!booking) {
        return res.status(400).json({ error: "Cabana is not booked." });
      }

      const sameGuest =
        booking.room === String(room).trim() &&
        booking.guestName.toLowerCase() === String(guestName).trim().toLowerCase();

      if (!sameGuest) {
        return res.status(401).json({
          error: "Only the guest who booked this cabana can cancel it.",
        });
      }

      bookedCabanas.delete(key);
      return res.json({ success: true, message: "Booking cancelled." });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to cancel booking.",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  return app;
}

function createDefaultApp(cliArgs) {
  return createApp({
    mapPath: path.resolve(cliArgs.map),
    bookingsPath: path.resolve(cliArgs.bookings),
    assetsDir: path.resolve(__dirname, "../../assets"),
  });
}

module.exports = {
  createApp,
  createDefaultApp,
};
