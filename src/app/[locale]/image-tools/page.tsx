import { setRequestLocale } from 'next-intl/server'
import { ImageToolsClient } from '@/components/image-tools/ImageToolsClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function ImageToolsPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="h-[calc(100dvh-56px-48px)]">
      <ImageToolsClient />
    </div>
  )
}
