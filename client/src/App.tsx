import { useState } from "react";
import ResortMap from "./components/ResortMap";
import type { Tile } from "./components/ResortMap";
import BookingModal from "./components/BookingModal";
import { useMap } from "./hooks/useMap";
import "./App.css";

function App() {
  const { tiles, mapWidth, isLoading, error } = useMap();
  const [selectedCabana, setSelectedCabana] = useState<Tile | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function closeModal() {
    setSelectedCabana(null);
  }

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => {
      setNotice(null);
    }, 2000);
  }

  function handleBookingSuccess(message: string) {
    showNotice(message);
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
      {notice && <p className="notice-message">{notice}</p>}
      <ResortMap
        width={mapWidth}
        tiles={tiles}
        onCabanaClick={(tile) => setSelectedCabana(tile)}
      />

      {selectedCabana && (
        <BookingModal
          selectedCabana={selectedCabana}
          onClose={closeModal}
          onSuccess={handleBookingSuccess}
        />
      )}
    </main>
  );
}

export default App;
