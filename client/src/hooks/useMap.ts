import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMapData } from "../api";
import type { Tile } from "../components/ResortMap";

const MAP_QUERY_KEY = ["map-data"] as const;

export function useMap() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: MAP_QUERY_KEY,
    queryFn: fetchMapData,
  });

  const refreshMap = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: MAP_QUERY_KEY });
  }, [queryClient]);

  const tiles = (data?.map.tiles ?? []) as Tile[];
  const mapWidth = data?.map.width ?? 0;
  const errorMessage =
    error instanceof Error ? error.message : error ? String(error) : null;

  return {
    tiles,
    mapWidth,
    isLoading,
    error: errorMessage,
    refreshMap,
  };
}
