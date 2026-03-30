import { Loader2 } from "lucide-react";

export const FirstLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2">
      <Loader2 className="h-10 w-10 md:h-15 md:w-15 animate-spin text-primary" />
      <p className="text-sm md:text-xl text-muted-foreground animate-pulse">
        Loading map...
      </p>
    </div>
  )
}