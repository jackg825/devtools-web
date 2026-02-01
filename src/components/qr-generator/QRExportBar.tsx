'use client'

import { memo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { MdDownload, MdContentCopy, MdRefresh, MdCheck } from 'react-icons/md'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  type ExportFormat,
  type ExportSize,
  EXPORT_FORMATS,
  EXPORT_SIZES,
} from '@/hooks/useQRCode'

interface QRExportBarProps {
  download: (format: ExportFormat, size: ExportSize, filename?: string) => Promise<void>
  downloadPng: () => Promise<void>
  downloadSvg: () => Promise<void>
  size: number
}

export const QRExportBar = memo(function QRExportBar({
  download,
  downloadPng,
  size,
}: QRExportBarProps) {
  const t = useTranslations('qrGenerator.export')
  const [format, setFormat] = useState<ExportFormat>('png')
  const [exportSize, setExportSize] = useState<ExportSize>(512)
  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleDownload = async () => {
    setIsExporting(true)
    try {
      await download(format, exportSize)
    } finally {
      setIsExporting(false)
    }
  }

  const handleCopy = async () => {
    setIsExporting(true)
    try {
      await downloadPng()
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-[--glass-bg-elevated] backdrop-blur-xl rounded-2xl border border-[--glass-border] shadow-[--shadow-glass]">
      {/* Top Row: Format and Size Options */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Format Toggle */}
        <div className="flex bg-[--glass-bg] rounded-lg p-1 border border-[--glass-border]">
          {EXPORT_FORMATS.map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setFormat(fmt)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-[--duration-fast]',
                format === fmt
                  ? 'bg-[--accent] text-white shadow-sm'
                  : 'text-[--muted-foreground] hover:text-[--foreground]'
              )}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Size Selector */}
        <div className="flex bg-[--glass-bg] rounded-lg p-1 border border-[--glass-border]">
          {EXPORT_SIZES.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setExportSize(sz)}
              className={cn(
                'px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-[--duration-fast]',
                exportSize === sz
                  ? 'bg-[--accent] text-white shadow-sm'
                  : 'text-[--muted-foreground] hover:text-[--foreground]'
              )}
            >
              {sz}
            </button>
          ))}
        </div>

        {/* Current Size Badge */}
        <div className="px-3 py-1.5 bg-[--glass-bg] rounded-lg border border-[--glass-border] text-xs text-[--muted-foreground]">
          {t('preview')}: {size}px
        </div>
      </div>

      {/* Bottom Row: Actions */}
      <div className="flex items-center gap-3">
        {/* Spacer */}
        <div className="flex-1" />

        {/* Copy Button */}
        <Button
          variant="glass"
          size="sm"
          onClick={handleCopy}
          disabled={isExporting}
          className="gap-2"
        >
          {copied ? (
            <MdCheck className="w-4 h-4 text-green-500" />
          ) : (
            <MdContentCopy className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{copied ? t('copied') : t('copy')}</span>
        </Button>

        {/* Download Button */}
        <Button
          variant="gradient"
          size="sm"
          onClick={handleDownload}
          disabled={isExporting}
          className="gap-2"
        >
          {isExporting ? (
            <MdRefresh className="w-4 h-4 animate-spin" />
          ) : (
            <MdDownload className="w-4 h-4" />
          )}
          <span>
            {t('download')} {format.toUpperCase()} ({exportSize}px)
          </span>
        </Button>
      </div>
    </div>
  )
})
