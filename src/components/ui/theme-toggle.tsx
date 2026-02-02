'use client'

import { useTheme } from 'next-themes'
import { MdLightMode, MdDarkMode } from 'react-icons/md'
import { useSyncExternalStore } from 'react'

// Use useSyncExternalStore for hydration-safe mounting detection
const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg hover:bg-[--glass-bg-elevated] text-[--muted-foreground] transition-colors"
        aria-label="Toggle theme"
      >
        <div className="w-5 h-5" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative p-2 rounded-lg hover:bg-[--glass-bg-elevated] text-[--muted-foreground] hover:text-[--foreground] transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <MdLightMode className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
      <MdDarkMode className="absolute top-2 left-2 h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
    </button>
  )
}
