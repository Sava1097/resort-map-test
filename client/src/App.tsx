import { useState } from "react";
import ResortMap from "./components/ResortMap";
import type { Tile } from "./components/ResortMap";
import { BookingModal } from "./components/BookingModal";
import { useMap } from "./hooks/useMap";
import { FirstLoading } from "./components/FirstLoading";
import { ScreenWrapper } from "./components/ScreenWrapper";

function App() {
  const { tiles, mapWidth, isLoading, error } = useMap();
  const [selectedCabana, setSelectedCabana] = useState<Tile | null>(null);

  const closeModal = () => setSelectedCabana(null)

  if (isLoading) return (
    <ScreenWrapper>
      <FirstLoading/>
    </ScreenWrapper>
  )

  if (error) {
    return (
      <ScreenWrapper>
        <div className="text-center p-10 bg-red-50 rounded-lg border border-red-200 mx-2">
          <p className="flex justify-center items-center text-red-600 font-medium">Error loading map: {error}</p>
        </div>
      </ScreenWrapper>
    )
  }

  return (
    <main className="p-6 flex flex-col justify-center items-center gap-4">
      <h1 className="text-4xl font-semibold">Resort Map</h1>
      <p className="text-muted-foreground lg:text-xl">
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
        />
      )}
    </main>
  );
}

export default App;
