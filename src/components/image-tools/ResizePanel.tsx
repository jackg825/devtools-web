'use client'

import { useTranslations } from 'next-intl'
import { Link2, Link2Off, RotateCcw } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  useTargetWidth,
  useTargetHeight,
  useMaintainAspectRatio,
  useResizeMode,
  useOriginalWidth,
  useOriginalHeight,
  useSetTargetWidth,
  useSetTargetHeight,
  useSetMaintainAspectRatio,
  useSetResizeMode,
} from '@/stores/imageToolsStore'
import type { ResizeMode } from '@/types/imageTools'

export function ResizePanel() {
  const t = useTranslations('imageTools.controls.resize')

  const targetWidth = useTargetWidth()
  const targetHeight = useTargetHeight()
  const maintainAspectRatio = useMaintainAspectRatio()
  const resizeMode = useResizeMode()
  const originalWidth = useOriginalWidth()
  const originalHeight = useOriginalHeight()

  const setTargetWidth = useSetTargetWidth()
  const setTargetHeight = useSetTargetHeight()
  const setMaintainAspectRatio = useSetMaintainAspectRatio()
  const setResizeMode = useSetResizeMode()

  const handleWidthChange = (value: string) => {
    const num = parseInt(value, 10)
    if (!isNaN(num) && num > 0) {
      if (resizeMode === 'percentage') {
        const pixelWidth = Math.round((originalWidth * num) / 100)
        setTargetWidth(pixelWidth)
      } else {
        setTargetWidth(num)
      }
    }
  }

  const handleHeightChange = (value: string) => {
    const num = parseInt(value, 10)
    if (!isNaN(num) && num > 0) {
      if (resizeMode === 'percentage') {
        const pixelHeight = Math.round((originalHeight * num) / 100)
        setTargetHeight(pixelHeight)
      } else {
        setTargetHeight(num)
      }
    }
  }

  const resetToOriginal = () => {
    setTargetWidth(originalWidth)
    setTargetHeight(originalHeight)
  }

  const displayWidth =
    resizeMode === 'percentage'
      ? Math.round((targetWidth / originalWidth) * 100) || 100
      : targetWidth

  const displayHeight =
    resizeMode === 'percentage'
      ? Math.round((targetHeight / originalHeight) * 100) || 100
      : targetHeight

  const modes: { value: ResizeMode; label: string }[] = [
    { value: 'pixels', label: t('pixels') },
    { value: 'percentage', label: t('percentage') },
  ]

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => setResizeMode(mode.value)}
            className={cn(
              'flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              resizeMode === mode.value
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80'
            )}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Dimensions */}
      <div className="flex items-end gap-3">
        <div className="flex-1 space-y-2">
          <Label>{t('width')}</Label>
          <div className="relative">
            <Input
              type="number"
              value={displayWidth || ''}
              onChange={(e) => handleWidthChange(e.target.value)}
              min={1}
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]">
              {resizeMode === 'percentage' ? '%' : 'px'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
          className={cn(
            'p-2 rounded-lg transition-colors mb-0.5',
            maintainAspectRatio
              ? 'bg-[var(--accent)] text-white'
              : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80'
          )}
          title={t('maintainRatio')}
        >
          {maintainAspectRatio ? (
            <Link2 className="w-4 h-4" />
          ) : (
            <Link2Off className="w-4 h-4" />
          )}
        </button>

        <div className="flex-1 space-y-2">
          <Label>{t('height')}</Label>
          <div className="relative">
            <Input
              type="number"
              value={displayHeight || ''}
              onChange={(e) => handleHeightChange(e.target.value)}
              min={1}
              className="pr-8"
              disabled={maintainAspectRatio}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]">
              {resizeMode === 'percentage' ? '%' : 'px'}
            </span>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetToOriginal}
        className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        {t('original')} ({originalWidth} × {originalHeight})
      </button>
    </div>
  )
}
