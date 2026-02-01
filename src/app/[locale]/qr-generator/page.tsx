import { setRequestLocale } from 'next-intl/server'
import { QRGeneratorClient } from '@/components/qr-generator/QRGeneratorClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function QRGeneratorPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="h-[calc(100vh-var(--header-height)-48px)]">
      <QRGeneratorClient />
    </div>
  )
}
