'use client'

import { memo, useState } from 'react'
import { MdExpandMore } from 'react-icons/md'
import { cn } from '@/lib/utils'

interface ControlSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export const ControlSection = memo(function ControlSection({
  title,
  defaultOpen = false,
  children,
}: ControlSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-[--glass-border] rounded-xl overflow-hidden bg-[--glass-bg] backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 text-sm font-medium',
          'transition-colors duration-[--duration-fast]',
          'hover:bg-[--glass-bg-elevated]',
          isOpen && 'border-b border-[--glass-border]'
        )}
      >
        <span>{title}</span>
        <MdExpandMore
          className={cn(
            'w-4 h-4 text-[--muted-foreground] transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="p-4 space-y-4">{children}</div>
        </div>
      </div>
    </div>
  )
})
