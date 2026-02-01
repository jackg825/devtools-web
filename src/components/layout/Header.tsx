'use client'

import { Menu } from 'lucide-react'
import { LocaleSwitcher } from './LocaleSwitcher'
import { useSidebar } from '@/components/providers/SidebarProvider'

export function Header() {
  const { toggle } = useSidebar()

  return (
    <header className="h-[var(--header-height)] border-b border-[var(--border)] bg-[var(--surface-overlay)] backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      <button
        onClick={toggle}
        className="lg:hidden p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="lg:hidden" />
      <LocaleSwitcher />
    </header>
  )
}
