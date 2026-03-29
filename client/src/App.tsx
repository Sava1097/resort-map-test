import { useState } from "react";
import { toast } from "sonner";
import ResortMap from "./components/ResortMap";
import type { Tile } from "./components/ResortMap";
import { BookingModal } from "./components/BookingModal";
import { useMap } from "./hooks/useMap";

function App() {
  const { tiles, mapWidth, isLoading, error } = useMap();
  const [selectedCabana, setSelectedCabana] = useState<Tile | null>(null);

  function closeModal() {
    setSelectedCabana(null);
  }

  function handleBookingSuccess(message: string) {
    toast.success(message);
  }

  if (isLoading) {
    return <main className="p-6">Loading map...</main>;
  }

  if (error) {
    return <main className="p-6">Error: {error}</main>;
  }

  return (
    <main className="p-6 flex flex-col justify-center items-center gap-4">
      <h1 className="text-4xl font-semibold">Resort Map</h1>
      <p className="">
        <span>Cabana</span> | <span>Pool</span> | <span>Path</span> | <span>Chalet</span>
      </p>
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
