type Tile = {
  x: number;
  y: number;
  type: string;
  booked?: boolean;
  status?: "available" | "booked";
  bookedByGuestName?: string | null;
  bookedByRoom?: string | null;
};

type ResortMapProps = {
  width: number;
  tiles: Tile[];
  onCabanaClick: (tile: Tile) => void;
};

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

function ResortMap({ width, tiles, onCabanaClick }: ResortMapProps) {
  return (
    <div
      className="resort-grid"
      style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}
    >
      {tiles.map((tile) => {
        const tileLabel = tileLabelMap[tile.type] ?? "Unknown";
        const isCabana = tile.type === "W";
        const isBookedCabana = isCabana && tile.booked;
        const imageSrc = tileImageMap[tile.type];

        return (
          <button
            key={`${tile.x}-${tile.y}`}
            className={`tile tile-${tile.type} ${isCabana ? "is-clickable" : ""} ${isBookedCabana ? "is-booked" : ""}`}
            type="button"
            aria-label={`${tileLabel} at (${tile.x}, ${tile.y})`}
            onClick={() => {
              if (isCabana) {
                onCabanaClick(tile);
              }
            }}
          >
            {imageSrc ? (
              <img src={imageSrc} alt={tileLabel} className="tile-image" />
            ) : (
              <span>{tile.type}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export type { Tile };
export default ResortMap;
