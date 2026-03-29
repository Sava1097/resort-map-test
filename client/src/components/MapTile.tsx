import { cn } from "../lib/utils";

export type Tile = {
  x: number;
  y: number;
  type: string;
  booked?: boolean;
  status?: "available" | "booked";
  bookedByGuestName?: string | null;
  bookedByRoom?: string | null;
};

interface MapTileProps {
  tile: Tile;
  onClick: (tile: Tile) => void;
}

const tileImageMap: Record<string, string> = {
  W: "http://localhost:3001/assets/cabana.png",
  p: "http://localhost:3001/assets/pool.png",
  "#": "http://localhost:3001/assets/arrowStraight.png",
  c: "http://localhost:3001/assets/houseChimney.png",
  ".": "http://localhost:3001/assets/parchmentBasic.png",
};

const tileLabelMap: Record<string, string> = {
  W: "Cabana",
  p: "Pool",
  "#": "Path",
  c: "Chalet",
  ".": "Empty",
};

export const MapTile = ({ tile, onClick }: MapTileProps) => {
  const tileLabel = tileLabelMap[tile.type] ?? "Unknown";
  const isCabana = tile.type === "W";
  const isBookedCabana = isCabana && tile.booked;
  const imageSrc = tileImageMap[tile.type];

  return (
    <button
      className={cn(
        "aspect-square border border-black/15 p-0 flex items-center justify-center transition-all duration-200",
        isCabana ? "cursor-pointer hover:scale-105" : "",
        isBookedCabana ? "bg-red-500 opacity-50 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
      )}
      disabled={isBookedCabana}
      type="button"
      title={isBookedCabana ? "Booked" : undefined}
      aria-label={`${tileLabel} at (${tile.x}, ${tile.y})`}
      onClick={() => {
        if (isCabana) {
          onClick(tile);
        }
      }}
    >
      {imageSrc ? (
        <img src={imageSrc} alt={tileLabel} className="h-full w-full object-cover" />
      ) : (
        <span>{tile.type}</span>
      )}
    </button>
  );
};