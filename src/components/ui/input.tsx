import * as React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.ComponentProps<'input'> {
  variant?: 'default' | 'glass'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
          variant === 'default' && 'border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)]',
          variant === 'glass' && 'border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm hover:bg-[var(--glass-bg-elevated)] hover:shadow-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
