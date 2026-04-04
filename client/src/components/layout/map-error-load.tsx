type MapErrorLoadProps = {
  message: string | null;
};

export const MapErrorLoad = ({ message }: MapErrorLoadProps) => {
  return (
    <div className="mx-2 rounded-lg border border-red-200 bg-red-50 p-10 text-center">
      <p className="flex items-center justify-center font-medium text-red-600">
        Error loading map: {message || 'unknown error'}
      </p>
    </div>
  );
};
