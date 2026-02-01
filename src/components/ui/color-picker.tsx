'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from './input'

const defaultColors = [
  '#000000',
  '#1a1a2e',
  '#16213e',
  '#0f3460',
  '#e94560',
  '#ff6b6b',
  '#feca57',
  '#48dbfb',
  '#1dd1a1',
  '#5f27cd',
  '#667eea',
  '#764ba2',
  '#ffffff',
]

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  showPresets?: boolean
  className?: string
}

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  ({ value, onChange, disabled = false, showPresets = true, className }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-3', className)}>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className={cn(
                'w-12 h-10 rounded-lg cursor-pointer border border-[--glass-border] bg-[--glass-bg] p-1 transition-all duration-[--duration-fast]',
                'hover:border-[--border-hover] hover:shadow-sm',
                'focus:outline-none focus:ring-2 focus:ring-[--accent] focus:ring-offset-2',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            />
            {/* Color preview overlay with rounded corners */}
            <div
              className="absolute inset-1.5 rounded-md pointer-events-none"
              style={{ backgroundColor: value }}
            />
          </div>
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            variant="glass"
            className="flex-1 font-mono text-sm uppercase"
            placeholder="#000000"
          />
        </div>

        {showPresets && (
          <div className="flex flex-wrap gap-1.5">
            {defaultColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onChange(color)}
                disabled={disabled}
                className={cn(
                  'w-6 h-6 rounded-md border transition-all duration-[--duration-fast]',
                  'hover:scale-110 hover:shadow-md',
                  'focus:outline-none focus:ring-2 focus:ring-[--accent] focus:ring-offset-1',
                  value === color
                    ? 'border-[--accent] ring-2 ring-[--accent] ring-offset-1'
                    : 'border-[--glass-border]',
                  disabled && 'opacity-50 cursor-not-allowed hover:scale-100'
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
)
ColorPicker.displayName = 'ColorPicker'

export { ColorPicker }
