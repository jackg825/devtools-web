import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-[var(--duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-sm',
        secondary:
          'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)]',
        outline:
          'border border-[var(--border)] bg-transparent hover:bg-[var(--muted)] hover:border-[var(--border-hover)]',
        ghost:
          'hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
        link:
          'text-[var(--accent)] underline-offset-4 hover:underline',
        glass:
          'bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] shadow-[var(--shadow-glass)] hover:bg-[var(--glass-bg-elevated)] hover:shadow-[var(--shadow-glass-hover)] active:scale-[0.98]',
        gradient:
          'bg-gradient-to-r from-[#4A9A9A] via-[#3D8585] to-[#306B6B] text-white shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
