'use client'

import { LocaleSwitcher } from './LocaleSwitcher'

export function Header() {
  return (
    <header className="h-[var(--header-height)] border-b border-[var(--border)] bg-[var(--surface-overlay)] backdrop-blur-xl sticky top-0 z-30 flex items-center justify-end px-6">
      <LocaleSwitcher />
    </header>
  )
}
