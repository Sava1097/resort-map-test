export const MainLayoutContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <main className="flex flex-col items-center justify-center gap-4 p-6">
      {children}
    </main>
  );
};
