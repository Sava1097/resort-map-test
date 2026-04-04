import { Loader2 } from 'lucide-react';

export const FirstLoading = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 md:mt-3">
      <Loader2 className="text-primary h-10 w-10 animate-spin md:h-15 md:w-15" />
      <p className="text-muted-foreground animate-pulse text-sm md:text-xl">
        Loading map...
      </p>
    </div>
  );
};
