import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMapData } from '../api';
import type { Tile } from '../components/map/map-tile';

const MAP_QUERY_KEY = ['map-data'] as const;

export function useMap() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: MAP_QUERY_KEY,
    queryFn: fetchMapData,
    select: (data) => ({
      tiles: data.map.tiles as Tile[],
      width: data.map.width,
    }),
  });

  const refreshMap = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: MAP_QUERY_KEY });
  }, [queryClient]);

  const errorMessage =
    error instanceof Error ? error.message : error ? String(error) : null;

  return {
    tiles: data?.tiles ?? [],
    mapWidth: data?.width ?? 0,
    isLoading,
    error: errorMessage,
    refreshMap,
  };
}
