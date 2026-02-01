import { setRequestLocale } from 'next-intl/server'
import { CodeCanvasClient } from '@/components/code-canvas/CodeCanvasClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function CodeCanvasPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="h-[calc(100vh-var(--header-height)-48px)]">
      <CodeCanvasClient />
    </div>
  )
}
