import type { PropsWithChildren } from 'react';

export const MainLayoutContainer = ({
  children,
}: PropsWithChildren) => {
  return (
    <main className="flex flex-col items-center justify-center gap-4 p-6">
      {children}
    </main>
  );
};
