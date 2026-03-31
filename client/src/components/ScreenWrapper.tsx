export const ScreenWrapper = ({children}: {children: React.ReactNode}) => {
  return (
    <main className="flex min-h-svh md:min-h-auto justify-center items-center md:items-start md:pt-3">
      {children}
    </main>
  )
}
