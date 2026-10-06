import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-lg border-2 border-[#0d0f10] bg-white px-3 py-2 font-mono text-base shadow-[2px_2px_0px_#0d0f10] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:bg-[#fefce8] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
