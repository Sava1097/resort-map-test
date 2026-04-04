import type { PropsWithChildren } from "react";

export const FormLayout = ({children} : PropsWithChildren) => {
  return (
    <div className="flex flex-col gap-2.5">
      {children}
    </div>
  )
}