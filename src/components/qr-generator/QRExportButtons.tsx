'use client'

import { memo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QRExportButtonsProps {
  downloadPng: () => Promise<void>
  downloadSvg: () => Promise<void>
}

export const QRExportButtons = memo(function QRExportButtons({
  downloadPng,
  downloadSvg,
}: QRExportButtonsProps) {
  const t = useTranslations('qrGenerator.export')
  const [isExporting, setIsExporting] = useState(false)

  const handleDownloadPng = async () => {
    setIsExporting(true)
    try {
      await downloadPng()
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadSvg = async () => {
    setIsExporting(true)
    try {
      await downloadSvg()
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadPng}
        disabled={isExporting}
        className="flex-1"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>{t('png')}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadSvg}
        disabled={isExporting}
        className="flex-1"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>{t('svg')}</span>
      </Button>
    </div>
  )
})
