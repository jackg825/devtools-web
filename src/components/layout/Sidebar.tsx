'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { Code2, QrCode } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/components/providers/SidebarProvider'

const tools = [
  {
    id: 'code-canvas',
    href: '/code-canvas',
    icon: Code2,
    labelKey: 'codeCanvas',
    descKey: 'codeCanvasDesc',
  },
  {
    id: 'qr-generator',
    href: '/qr-generator',
    icon: QrCode,
    labelKey: 'qrGenerator',
    descKey: 'qrGeneratorDesc',
  },
] as const

export function Sidebar() {
  const t = useTranslations('nav')
  const tCommon = useTranslations('common')
  const pathname = usePathname()
  const { isOpen, close } = useSidebar()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-[var(--sidebar-width)] border-r border-[var(--border)] bg-[var(--surface)] flex flex-col z-40',
          'transition-transform duration-300',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-[var(--header-height)] flex items-center px-5 border-b border-[var(--border)]">
          <Link href="/code-canvas" className="flex items-center gap-2.5 group" onClick={close}>
            <Image
              src="/icons/icon-192.svg"
              alt="DevTools"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-semibold text-[15px] text-[var(--foreground)]">
              {tCommon('appName')}
            </span>
          </Link>
        </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {tools.map((tool) => {
          const Icon = tool.icon
          const isActive = pathname.startsWith(tool.href)

          return (
            <Link
              key={tool.id}
              href={tool.href}
              onClick={close}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-[var(--duration-fast)]',
                isActive
                  ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium truncate">
                  {t(tool.labelKey)}
                </div>
                <div className="text-[12px] opacity-70 truncate">
                  {t(tool.descKey)}
                </div>
              </div>
            </Link>
          )
        })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border)]">
          <a
            href="https://github.com/anthropics/devtools"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-[13px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--muted)] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            {tCommon('github')}
          </a>
        </div>
      </aside>
    </>
  )
}
