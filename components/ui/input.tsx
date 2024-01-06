import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "jsflex jsh-10 jsw-full jsrounded-md jsborder jsborder-slate-200 jsbg-white jspx-3 jspy-2 jstext-sm jsring-offset-white file:jsborder-0 file:jsbg-transparent file:jstext-sm file:jsfont-medium placeholder:jstext-slate-500 focus-visible:jsoutline-none focus-visible:jsring-2 focus-visible:jsring-slate-950 focus-visible:jsring-offset-2 disabled:jscursor-not-allowed disabled:jsopacity-50 dark:jsborder-slate-800 dark:jsbg-slate-950 dark:jsring-offset-slate-950 dark:placeholder:jstext-slate-400 dark:focus-visible:jsring-slate-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
