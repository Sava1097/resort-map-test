interface MapErrorLoad {
  message: string | null
}

export const MapErrorLoad = ({message}: MapErrorLoad) => {

  return (
    <div className="text-center p-10 bg-red-50 rounded-lg border border-red-200 mx-2">
      <p className="flex justify-center items-center text-red-600 font-medium">Error loading map: {message || "uknown error"}</p>
    </div>
  )
}
