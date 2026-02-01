'use client'

import { memo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  type ExportFormat,
  type ExportSize,
  EXPORT_FORMATS,
  EXPORT_SIZES,
} from '@/hooks/useQRCode'

interface QRExportButtonsProps {
  download: (format: ExportFormat, size: ExportSize, filename?: string) => Promise<void>
  downloadPng: () => Promise<void>
  downloadSvg: () => Promise<void>
}

export const QRExportButtons = memo(function QRExportButtons({
  download,
}: QRExportButtonsProps) {
  const t = useTranslations('qrGenerator.export')
  const [format, setFormat] = useState<ExportFormat>('png')
  const [exportSize, setExportSize] = useState<ExportSize>(512)
  const [isExporting, setIsExporting] = useState(false)

  const handleDownload = async () => {
    setIsExporting(true)
    try {
      await download(format, exportSize)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Format Selection */}
      <div className="space-y-2">
        <Label>{t('format')}</Label>
        <div className="grid grid-cols-4 gap-1">
          {EXPORT_FORMATS.map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setFormat(fmt)}
              className={cn(
                'px-2 py-1.5 text-xs font-medium rounded-md border transition-colors',
                format === fmt
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                  : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--muted)]'
              )}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-2">
        <Label>{t('size')}</Label>
        <div className="grid grid-cols-4 gap-1">
          {EXPORT_SIZES.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setExportSize(sz)}
              className={cn(
                'px-2 py-1.5 text-xs font-medium rounded-md border transition-colors',
                exportSize === sz
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                  : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--muted)]'
              )}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Download Button */}
      <Button
        variant="default"
        size="default"
        onClick={handleDownload}
        disabled={isExporting}
        className="w-full gap-2"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>
          {t('download')} {format.toUpperCase()} ({exportSize}px)
        </span>
      </Button>
    </div>
  )
})
