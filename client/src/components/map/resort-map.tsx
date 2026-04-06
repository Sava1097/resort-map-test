import { MapTile, type Tile } from './map-tile';

type ResortMapProps = {
  width: number;
  tiles: Tile[];
  onCabanaClick: (tile: Tile) => void;
};

export const ResortMap = ({ width, tiles, onCabanaClick }: ResortMapProps) => {
  return (
    <div className="mx-auto w-full max-w-[980px] overflow-x-auto">
      <div
        className="grid w-full gap-1 md:gap-2"
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          minWidth: `${width * 35}px`,
        }}
      >
        {tiles.map((tile) => (
          <MapTile
            key={`${tile.x}-${tile.y}`}
            tile={tile}
            onClick={onCabanaClick}
          />
        ))}
      </div>
    </div>
  );
};
