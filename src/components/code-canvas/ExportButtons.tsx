'use client'

import { memo } from 'react'
import { useTranslations } from 'next-intl'
import { Download, Copy, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTabTitle } from '@/stores/codeCanvasStore'

interface ExportButtonsProps {
  status: 'idle' | 'exporting' | 'success' | 'error'
  onDownloadPng: (filename: string) => void
  onDownloadSvg: (filename: string) => void
  onCopy: () => void
}

export const ExportButtons = memo(function ExportButtons({
  status,
  onDownloadPng,
  onDownloadSvg,
  onCopy,
}: ExportButtonsProps) {
  const t = useTranslations('codeCanvas.export')
  const tabTitle = useTabTitle()
  const filename = tabTitle || 'code-canvas'

  const isExporting = status === 'exporting'
  const isSuccess = status === 'success'

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDownloadPng(filename)}
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
        onClick={() => onDownloadSvg(filename)}
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

      <Button
        variant={isSuccess ? 'default' : 'outline'}
        size="sm"
        onClick={onCopy}
        disabled={isExporting}
        className="flex-1"
      >
        {isSuccess ? (
          <Check className="w-4 h-4" />
        ) : isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
        <span>{isSuccess ? t('copied') : t('copy')}</span>
      </Button>
    </div>
  )
})
