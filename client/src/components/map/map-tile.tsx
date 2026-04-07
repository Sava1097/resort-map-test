import { cn } from '../../lib/utils';
import { env } from '../../env';

export type Tile = {
  x: number;
  y: number;
  type: string;
  booked?: boolean;
  status?: 'available' | 'booked';
  bookedByGuestName?: string | null;
  bookedByRoom?: string | null;
};

type MapTileProps = {
  tile: Tile;
  onClick: (tile: Tile) => void;
};

const assetUrl = (file: string) => {
  const base = env.VITE_API_BASE_URL.replace(/\/$/, '');
  return `${base}/assets/${file}`;
};

const tileImageFiles: Record<string, string> = {
  W: 'cabana.png',
  p: 'pool.png',
  '#': 'arrowStraight.png',
  c: 'houseChimney.png',
  '.': 'parchmentBasic.png',
};

const tileLabelMap: Record<string, string> = {
  W: 'Cabana',
  p: 'Pool',
  '#': 'Path',
  c: 'Chalet',
  '.': 'Empty',
};

export const MapTile = ({ tile, onClick }: MapTileProps) => {
  const tileLabel = tileLabelMap[tile.type] ?? 'Unknown';

  const isCabana = tile.type === 'W';
  const isPool = tile.type === 'p';
  const isChalet = tile.type === 'c';

  const isBookedCabana = isCabana && tile.booked;
  const imageFile = tileImageFiles[tile.type];
  const imageSrc = imageFile ? assetUrl(imageFile) : undefined;

  return (
    <button
      className={cn(
        'focus-visible:border-ring focus-visible:ring-ring/50 flex aspect-square items-center justify-center border border-black/50 transition-all duration-400 outline-none focus-visible:ring-3',
        isCabana ? 'touch-manipulation hover:scale-105' : 'cursor-default',
        isBookedCabana
          ? 'cursor-not-allowed bg-red-600 opacity-80 hover:bg-red-700'
          : isCabana
            ? 'focus-visible:ring-ring/90 bg-green-500 hover:bg-green-600'
            : isPool
              ? 'bg-sky-400'
              : isChalet
                ? 'bg-yellow-400'
                : 'bg-transparent'
      )}
      type="button"
      disabled={isBookedCabana}
      title={isBookedCabana ? 'Booked' : undefined}
      aria-label={`${tileLabel} at (${tile.x}, ${tile.y})`}
      onClick={() => {
        if (isCabana) {
          onClick(tile);
        }
      }}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={tileLabel}
          className="h-full w-full rounded-sm object-cover shadow-sm"
        />
      ) : (
        <span>{tile.type}</span>
      )}
    </button>
  );
};
