interface MapErrorLoad {
  message: string | null;
}

export const MapErrorLoad = ({ message }: MapErrorLoad) => {
  return (
    <div className="mx-2 rounded-lg border border-red-200 bg-red-50 p-10 text-center">
      <p className="flex items-center justify-center font-medium text-red-600">
        Error loading map: {message || "uknown error"}
      </p>
    </div>
  );
};
