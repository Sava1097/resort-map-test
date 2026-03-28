import type { Tile } from "./components/ResortMap";

export const API_BASE_URL = "http://localhost:3001";

export type MapResponse = {
  map: {
    width: number;
    height: number;
    tiles: Tile[];
  };
};

type ApiError = {
  error?: string;
};

type BookingPayload = {
  room: string;
  guestName: string;
  x: number;
  y: number;
};

async function parseError(response: Response, fallbackMessage: string) {
  const errorBody = (await response.json()) as ApiError;
  throw new Error(errorBody.error ?? fallbackMessage);
}

export async function fetchMapData(): Promise<MapResponse> {
  const response = await fetch(`${API_BASE_URL}/api/map-data`);

  if (!response.ok) {
    await parseError(response, "Failed to load map data.");
  }

  return (await response.json()) as MapResponse;
}

export async function bookCabana(payload: BookingPayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await parseError(response, "Booking failed.");
  }
}
