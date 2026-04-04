import type { PropsWithChildren } from 'react';

export const ScreenWrapper = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex min-h-svh items-center justify-center md:min-h-auto md:items-start md:pt-3">
      {children}
    </main>
  );
};
