import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-2 border-[#0d0f10] bg-[#0d0f10] text-white shadow-[3px_3px_0px_#0d0f10] hover:bg-[#1f2326] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        destructive:
          "border-2 border-[#0d0f10] bg-red-600 text-white shadow-[3px_3px_0px_#0d0f10] hover:bg-red-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        outline:
          "border-2 border-[#0d0f10] bg-white text-[#0d0f10] shadow-[2px_2px_0px_#0d0f10] hover:bg-[#fef9c3] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        secondary:
          "border-2 border-[#0d0f10] bg-[#eef1f6] text-[#0d0f10] shadow-[2px_2px_0px_#0d0f10] hover:bg-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        ghost: "text-[#0d0f10] hover:bg-[#0d0f10]/5",
        link: "text-[#0d0f10] underline underline-offset-4 decoration-2 hover:decoration-[3px]",
        green: "border-2 border-[#0d0f10] bg-emerald-500 text-[#0d0f10] shadow-[3px_3px_0px_#0d0f10] hover:bg-emerald-400 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        blue: "border-2 border-[#0d0f10] bg-[#2563eb] text-white shadow-[3px_3px_0px_#0d0f10] hover:bg-[#1d4ed8] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        red: "border-2 border-[#0d0f10] bg-red-600 text-white shadow-[3px_3px_0px_#0d0f10] hover:bg-red-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        gray: "border-2 border-[#0d0f10] bg-[#eef1f6] text-[#0d0f10] shadow-[2px_2px_0px_#0d0f10] hover:bg-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-[11px]",
        lg: "h-11 px-8 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
