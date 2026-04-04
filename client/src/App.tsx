import { useState } from 'react';
import { ResortMap } from './components/map/resort-map';
import type { Tile } from './components/map/map-tile';
import { BookingModal } from './components/modal-window/booking-modal';
import { useMap } from './hooks/use-map';
import { FirstLoading } from './components/layout/first-loading';
import { ScreenWrapper } from './components/layout/screen-wrapper';
import { MapTitle } from './components/layout/map-title';
import { MapDescription } from './components/layout/map-description';
import { MapErrorLoad } from './components/layout/map-error-load';
import { MainLayoutContainer } from './components/layout/main-layout-container';

export const App = () => {
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
};
