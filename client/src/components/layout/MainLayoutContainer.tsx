export const MainLayoutContainer = ({children}: {children:React.ReactNode}) => {
  return <main className="p-6 flex flex-col justify-center items-center gap-4">
    {children}
  </main>
}
