import { useCallback, useEffect, useState } from "react";
import { fetchMapData } from "../api";
import type { Tile } from "../components/ResortMap";

export function useMap() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [mapWidth, setMapWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshMap = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchMapData();
      setTiles(data.map.tiles);
      setMapWidth(data.map.width);
    } catch (mapError) {
      setError(
        mapError instanceof Error ? mapError.message : "Unknown error while loading map.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshMap();
  }, [refreshMap]);

  return {
    tiles,
    mapWidth,
    isLoading,
    error,
    refreshMap,
  };
}
