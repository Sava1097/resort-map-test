import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import ResortMap from "./components/ResortMap";
import type { Tile } from "./components/ResortMap";
import "./App.css";

type MapResponse = {
  map: {
    width: number;
    height: number;
    tiles: Tile[];
  };
};

type ApiError = {
  error?: string;
};

const API_BASE_URL = "http://localhost:3001";

function App() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [mapWidth, setMapWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCabana, setSelectedCabana] = useState<Tile | null>(null);
  const [guestName, setGuestName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function loadMap() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/map-data`);

      if (!response.ok) {
        throw new Error("Failed to load map data.");
      }

      const data = (await response.json()) as MapResponse;
      setTiles(data.map.tiles);
      setMapWidth(data.map.width);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unknown error while loading map.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMap();
  }, []);

  function closeModal() {
    setSelectedCabana(null);
    setGuestName("");
    setRoomNumber("");
    setBookingError(null);
  }

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => {
      setNotice(null);
    }, 2000);
  }

  async function submitCabanaBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCabana) {
      return;
    }

    setIsBooking(true);
    setBookingError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room: roomNumber,
          guestName,
          x: selectedCabana.x,
          y: selectedCabana.y,
        }),
      });

      if (!response.ok) {
        const errorBody = (await response.json()) as ApiError;
        throw new Error(errorBody.error ?? "Booking failed.");
      }

      closeModal();
      await loadMap();
      showNotice("Booking completed.");
    } catch (bookingRequestError) {
      setBookingError(
        bookingRequestError instanceof Error
          ? bookingRequestError.message
          : "Unknown booking error.",
      );
    } finally {
      setIsBooking(false);
    }
  }

  async function cancelCabanaBooking() {
    if (!selectedCabana) {
      return;
    }

    setIsBooking(true);
    setBookingError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/book`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room: roomNumber,
          guestName,
          x: selectedCabana.x,
          y: selectedCabana.y,
        }),
      });

      if (!response.ok) {
        const errorBody = (await response.json()) as ApiError;
        throw new Error(errorBody.error ?? "Cancel failed.");
      }

      closeModal();
      await loadMap();
      showNotice("Booking cancelled.");
    } catch (cancelError) {
      setBookingError(
        cancelError instanceof Error ? cancelError.message : "Unknown cancel error.",
      );
    } finally {
      setIsBooking(false);
    }
  }

  if (isLoading) {
    return <main className="app-shell">Loading map...</main>;
  }

  if (error) {
    return <main className="app-shell">Error: {error}</main>;
  }

  return (
    <main className="app-shell">
      <h1>Resort Map</h1>
      <p className="legend">W: cabana, p: pool, #: path, c: chalet, .: empty</p>
      {notice ? <p className="notice-message">{notice}</p> : null}
      <ResortMap
        width={mapWidth}
        tiles={tiles}
        onCabanaClick={(tile) => setSelectedCabana(tile)}
      />

      {selectedCabana ? (
        <div className="modal-overlay" role="presentation" onClick={closeModal}>
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-label="Cabana booking form"
            onClick={(event) => event.stopPropagation()}
          >
            {selectedCabana.booked ? (
              <>
                <h2>Cabana ({selectedCabana.x}, {selectedCabana.y})</h2>
                <p className="booked-info">
                  Booked by {selectedCabana.bookedByGuestName ?? "Unknown"}
                </p>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void cancelCabanaBooking();
                  }}
                  className="booking-form"
                >
                  <label>
                    Guest name
                    <input
                      value={guestName}
                      onChange={(event) => setGuestName(event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Room number
                    <input
                      value={roomNumber}
                      onChange={(event) => setRoomNumber(event.target.value)}
                      required
                    />
                  </label>
                  {bookingError ? <p className="booking-error">{bookingError}</p> : null}
                  <div className="modal-actions">
                    <button type="button" onClick={closeModal} disabled={isBooking}>
                      Close
                    </button>
                    <button type="submit" disabled={isBooking}>
                      {isBooking ? "Cancelling..." : "Cancel booking"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2>Book cabana ({selectedCabana.x}, {selectedCabana.y})</h2>
                <form onSubmit={submitCabanaBooking} className="booking-form">
                  <label>
                    Guest name
                    <input
                      value={guestName}
                      onChange={(event) => setGuestName(event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Room number
                    <input
                      value={roomNumber}
                      onChange={(event) => setRoomNumber(event.target.value)}
                      required
                    />
                  </label>
                  {bookingError ? <p className="booking-error">{bookingError}</p> : null}
                  <div className="modal-actions">
                    <button type="button" onClick={closeModal} disabled={isBooking}>
                      Cancel
                    </button>
                    <button type="submit" disabled={isBooking}>
                      {isBooking ? "Booking..." : "Submit"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default App;
