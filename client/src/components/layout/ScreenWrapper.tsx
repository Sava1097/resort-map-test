export const ScreenWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-svh items-center justify-center md:min-h-auto md:items-start md:pt-3">
      {children}
    </main>
  );
};
