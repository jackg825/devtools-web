'use client'

import { useTranslations } from 'next-intl'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import {
  useOutputFormat,
  useQuality,
  useSetOutputFormat,
  useSetQuality,
} from '@/stores/imageToolsStore'
import type { OutputFormat } from '@/types/imageTools'

const formats: { value: OutputFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WebP' },
]

export function FormatPanel() {
  const t = useTranslations('imageTools.controls.format')
  const outputFormat = useOutputFormat()
  const quality = useQuality()
  const setOutputFormat = useSetOutputFormat()
  const setQuality = useSetQuality()

  const showQuality = outputFormat !== 'png'

  return (
    <div className="space-y-4">
      {/* Format Selection */}
      <div className="space-y-2">
        <Label>{t('title')}</Label>
        <div className="flex gap-2">
          {formats.map((format) => (
            <button
              key={format.value}
              onClick={() => setOutputFormat(format.value)}
              className={cn(
                'flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                outputFormat === format.value
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80'
              )}
            >
              {format.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quality Slider (only for JPEG/WebP) */}
      {showQuality && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{t('quality')}</Label>
            <span className="text-sm text-[var(--muted-foreground)]">{quality}%</span>
          </div>
          <Slider
            value={[quality]}
            onValueChange={([v]) => setQuality(v)}
            min={10}
            max={100}
            step={5}
          />
        </div>
      )}

      {/* Format Info */}
      <div className="p-3 bg-[var(--muted)] rounded-lg text-xs text-[var(--muted-foreground)]">
        {outputFormat === 'png' && (
          <p>PNG：無損壓縮，支援透明背景，適合圖標和截圖</p>
        )}
        {outputFormat === 'jpeg' && (
          <p>JPEG：有損壓縮，檔案較小，不支援透明，適合照片</p>
        )}
        {outputFormat === 'webp' && (
          <p>WebP：現代格式，同品質下檔案更小，支援透明</p>
        )}
      </div>
    </div>
  )
}
