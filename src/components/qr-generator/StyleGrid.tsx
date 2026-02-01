'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils'

interface StyleOption<T extends string> {
  value: T
  label: string
  preview: React.ReactNode
}

interface StyleGridProps<T extends string> {
  options: StyleOption<T>[]
  value: T
  onChange: (value: T) => void
  columns?: 2 | 3 | 4
  className?: string
}

function StyleGridInner<T extends string>({
  options,
  value,
  onChange,
  columns = 3,
  className,
}: StyleGridProps<T>) {
  return (
    <div
      className={cn(
        'grid gap-2',
        columns === 2 && 'grid-cols-2',
        columns === 3 && 'grid-cols-2 sm:grid-cols-3',
        columns === 4 && 'grid-cols-2 sm:grid-cols-4',
        className
      )}
    >
      {options.map((option) => {
        const isActive = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-[--duration-normal]',
              'border',
              isActive
                ? 'bg-gradient-to-br from-[--accent]/15 to-[#764ba2]/10 border-[--accent]/30 shadow-sm'
                : 'bg-[--glass-bg] border-[--glass-border] hover:bg-[--glass-bg-elevated] hover:border-[--border-hover]'
            )}
          >
            <div
              className={cn(
                'w-8 h-8 flex items-center justify-center transition-transform duration-300',
                isActive && 'scale-110'
              )}
            >
              {option.preview}
            </div>
            <span
              className={cn(
                'text-[10px] font-medium truncate w-full text-center',
                isActive ? 'text-[--accent]' : 'text-[--muted-foreground]'
              )}
            >
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export const StyleGrid = memo(StyleGridInner) as typeof StyleGridInner

// Pre-built dot style previews
export const DotStylePreviews = {
  square: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="2" width="6" height="6" fill="currentColor" />
      <rect x="10" y="2" width="6" height="6" fill="currentColor" />
      <rect x="2" y="10" width="6" height="6" fill="currentColor" />
      <rect x="16" y="10" width="6" height="6" fill="currentColor" />
      <rect x="10" y="16" width="6" height="6" fill="currentColor" />
    </svg>
  ),
  rounded: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="2" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="10" y="2" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="2" y="10" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="16" y="10" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="10" y="16" width="6" height="6" rx="1" fill="currentColor" />
    </svg>
  ),
  dots: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <circle cx="5" cy="5" r="3" fill="currentColor" />
      <circle cx="13" cy="5" r="3" fill="currentColor" />
      <circle cx="5" cy="13" r="3" fill="currentColor" />
      <circle cx="19" cy="13" r="3" fill="currentColor" />
      <circle cx="13" cy="19" r="3" fill="currentColor" />
    </svg>
  ),
  classy: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="2" width="6" height="6" rx="0" ry="3" fill="currentColor" />
      <rect x="10" y="2" width="6" height="6" rx="0" ry="3" fill="currentColor" />
      <rect x="2" y="10" width="6" height="6" rx="0" ry="3" fill="currentColor" />
      <rect x="16" y="10" width="6" height="6" rx="0" ry="3" fill="currentColor" />
      <rect x="10" y="16" width="6" height="6" rx="0" ry="3" fill="currentColor" />
    </svg>
  ),
  'classy-rounded': (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="2" width="6" height="6" rx="2" fill="currentColor" />
      <rect x="10" y="2" width="6" height="6" rx="2" fill="currentColor" />
      <rect x="2" y="10" width="6" height="6" rx="2" fill="currentColor" />
      <rect x="16" y="10" width="6" height="6" rx="2" fill="currentColor" />
      <rect x="10" y="16" width="6" height="6" rx="2" fill="currentColor" />
    </svg>
  ),
  'extra-rounded': (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="2" width="6" height="6" rx="3" fill="currentColor" />
      <rect x="10" y="2" width="6" height="6" rx="3" fill="currentColor" />
      <rect x="2" y="10" width="6" height="6" rx="3" fill="currentColor" />
      <rect x="16" y="10" width="6" height="6" rx="3" fill="currentColor" />
      <rect x="10" y="16" width="6" height="6" rx="3" fill="currentColor" />
    </svg>
  ),
}

// Pre-built corner style previews
export const CornerSquareStylePreviews = {
  square: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" />
      <rect x="7" y="7" width="10" height="10" fill="currentColor" />
    </svg>
  ),
  dot: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="12" cy="12" r="5" fill="currentColor" />
    </svg>
  ),
  'extra-rounded': (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="currentColor" strokeWidth="3" />
      <rect x="7" y="7" width="10" height="10" rx="3" fill="currentColor" />
    </svg>
  ),
}

// Pre-built corner dot style previews
export const CornerDotStylePreviews = {
  square: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <rect x="6" y="6" width="12" height="12" fill="currentColor" />
    </svg>
  ),
  dot: (
    <svg viewBox="0 0 24 24" className="w-full h-full">
      <circle cx="12" cy="12" r="6" fill="currentColor" />
    </svg>
  ),
}
