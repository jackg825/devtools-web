'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { cn } from '@/lib/utils'
import {
  useSourceImage,
  useProcessedImage,
  useOriginalWidth,
  useOriginalHeight,
  useTargetWidth,
  useTargetHeight,
} from '@/stores/imageToolsStore'

type ViewMode = 'original' | 'processed' | 'compare'

export function ImagePreview() {
  const t = useTranslations('imageTools')
  const [viewMode, setViewMode] = useState<ViewMode>('original')
  const prevProcessedRef = useRef<string | null>(null)

  const sourceImage = useSourceImage()
  const processedImage = useProcessedImage()
  const originalWidth = useOriginalWidth()
  const originalHeight = useOriginalHeight()
  const targetWidth = useTargetWidth()
  const targetHeight = useTargetHeight()

  const hasProcessed = !!processedImage

  // Auto-switch to processed view when processing completes
  useEffect(() => {
    if (processedImage && !prevProcessedRef.current) {
      setViewMode('processed')
    }
    prevProcessedRef.current = processedImage
  }, [processedImage])

  if (!sourceImage) {
    return null
  }

  return (
    <div className="flex flex-col h-full">
      {/* View Mode Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--muted)] rounded-lg mb-4 w-fit">
        <button
          onClick={() => setViewMode('original')}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            viewMode === 'original'
              ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          )}
        >
          {t('preview.original')}
        </button>
        <button
          onClick={() => setViewMode('processed')}
          disabled={!hasProcessed}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            viewMode === 'processed'
              ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
            !hasProcessed && 'opacity-50 cursor-not-allowed'
          )}
        >
          {t('preview.processed')}
        </button>
        <button
          onClick={() => setViewMode('compare')}
          disabled={!hasProcessed}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            viewMode === 'compare'
              ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
            !hasProcessed && 'opacity-50 cursor-not-allowed'
          )}
        >
          {t('preview.compare')}
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 relative overflow-hidden rounded-lg bg-[var(--muted)]">
        {/* Checkerboard pattern for transparency */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
            backgroundColor: '#ffffff',
          }}
        />

        {viewMode === 'compare' && hasProcessed && processedImage ? (
          <div className="relative w-full h-full">
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src={processedImage}
                  alt="Processed"
                  style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src={sourceImage}
                  alt="Original"
                  style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                />
              }
              style={{ width: '100%', height: '100%' }}
            />
            {/* Labels */}
            <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 text-white text-xs rounded font-medium pointer-events-none z-10">
              {t('preview.processed')}
            </div>
            <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded font-medium pointer-events-none z-10">
              {t('preview.original')}
            </div>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={viewMode === 'processed' && processedImage ? processedImage : sourceImage}
            alt={viewMode === 'processed' ? 'Processed' : 'Original'}
            className="relative w-full h-full object-contain"
          />
        )}
      </div>

      {/* Dimensions Info */}
      <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <span>
          {t('preview.original')}: {originalWidth} × {originalHeight}
        </span>
        {(targetWidth !== originalWidth || targetHeight !== originalHeight) && (
          <span>
            → {targetWidth} × {targetHeight}
          </span>
        )}
      </div>
    </div>
  )
}
