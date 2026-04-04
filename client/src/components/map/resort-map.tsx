import { MapTile, type Tile } from './map-tile';

type ResortMapProps = {
  width: number;
  tiles: Tile[];
  onCabanaClick: (tile: Tile) => void;
};

export const ResortMap = ({ width, tiles, onCabanaClick }: ResortMapProps) => {
  return (
    <div
      className="mx-auto grid w-full max-w-[980px] gap-2"
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
};
