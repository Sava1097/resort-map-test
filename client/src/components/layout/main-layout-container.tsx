import type { PropsWithChildren } from 'react';

export const MainLayoutContainer = ({ children }: PropsWithChildren) => {
  return (
    <main className="mx-auto flex w-full flex-col items-center justify-center gap-4 p-4 md:p-6">
      {children}
    </main>
  );
};
