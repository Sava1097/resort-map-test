import { MapTile, type Tile } from "./MapTile";

type ResortMapProps = {
  width: number;
  tiles: Tile[];
  onCabanaClick: (tile: Tile) => void;
};

const ResortMap = ({ width, tiles, onCabanaClick }: ResortMapProps) => {
  return (
    <div
      className="resort-grid"
      style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}
    >
      {tiles.map((tile) => (
        <MapTile 
          key={`${tile.x}-${tile.y}`} 
          tile={tile} 
          onClick={onCabanaClick} 
        />
      ))}
    </div>
  );
}

export type { Tile };
export default ResortMap
