import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { SidebarProvider } from '@/components/providers/SidebarProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ServiceWorkerProvider } from '@/components/providers/ServiceWorkerProvider'
import '../globals.css'

export const metadata: Metadata = {
  title: 'DevTools',
  description: 'Developer Tools Collection - Code Canvas & QR Generator',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DevTools',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-gradient-subtle">
        <ThemeProvider>
          <ServiceWorkerProvider>
            <NextIntlClientProvider messages={messages}>
              <SidebarProvider>
                <div className="flex min-h-[100dvh] relative">
                  {/* Background pattern */}
                  <div
                    className="fixed inset-0 opacity-40 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)',
                      backgroundSize: '32px 32px',
                    }}
                  />
                  <Sidebar />
                  {/* Main content: no margin on mobile, sidebar margin on desktop */}
                  <div className="flex-1 flex flex-col ml-0 lg:ml-[260px] relative z-10 transition-[margin] duration-300">
                    <Header />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
                  </div>
                </div>
              </SidebarProvider>
            </NextIntlClientProvider>
          </ServiceWorkerProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
