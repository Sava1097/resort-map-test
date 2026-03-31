import { useState } from "react";
import ResortMap from "./components/ResortMap";
import type { Tile } from "./components/ResortMap";
import { BookingModal } from "./components/BookingModal";
import { useMap } from "./hooks/useMap";
import { FirstLoading } from "./components/layout/FirstLoading";
import { ScreenWrapper } from "./components/layout/ScreenWrapper";
import { MapTitle } from "./components/layout/MapTitle";
import { MapDescription } from "./components/layout/MapDescription";
import { MapErrorLoad } from "./components/layout/MapErrorLoad";
import { MainLayoutContainer } from "./components/layout/MainLayoutContainer";

function App() {
  const { tiles, mapWidth, isLoading, error } = useMap();
  const [selectedCabana, setSelectedCabana] = useState<Tile | null>(null);

  const closeModal = () => setSelectedCabana(null);

  if (isLoading)
    return (
      <ScreenWrapper>
        <FirstLoading />
      </ScreenWrapper>
    );

  if (error) {
    return (
      <ScreenWrapper>
        <MapErrorLoad message={error} />
      </ScreenWrapper>
    );
  }

  return (
    <MainLayoutContainer>
      <MapTitle />
      <MapDescription />
      <ResortMap
        width={mapWidth}
        tiles={tiles}
        onCabanaClick={(tile) => setSelectedCabana(tile)}
      />

      {selectedCabana && (
        <BookingModal selectedCabana={selectedCabana} onClose={closeModal} />
      )}
    </MainLayoutContainer>
  );
}

export default App;
