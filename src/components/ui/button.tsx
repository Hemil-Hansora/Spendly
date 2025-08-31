import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-[var(--transition-smooth)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl shadow-[var(--shadow-soft)]",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-xl shadow-[var(--shadow-soft)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)]",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-xl",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "hero-gradient text-white hover:scale-[1.02] rounded-xl shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-large)] border-0",
        financial: "primary-gradient text-white hover:opacity-90 rounded-xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] border-0",
        success: "secondary-gradient text-white hover:opacity-90 rounded-xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] border-0",
        card: "financial-card hover:shadow-[var(--shadow-medium)] text-card-foreground border-border",
        premium: "bg-gradient-to-r from-primary via-accent to-secondary text-white hover:scale-[1.02] rounded-xl shadow-[var(--shadow-large)] border-0 font-semibold",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-xl px-4",
        lg: "h-13 rounded-xl px-8 text-base",
        xl: "h-16 rounded-xl px-10 text-lg",
        icon: "h-11 w-11 rounded-xl",
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
