'use client'

import { useEffect } from 'react'
import { ImageDropzone } from './ImageDropzone'
import { ImagePreview } from './ImagePreview'
import { ControlPanel } from './ControlPanel'
import { ExportButtons } from './ExportButtons'
import { useImageToolsStore, useSourceImage, useImageError, useClearImage, useBgRemovalModel } from '@/stores/imageToolsStore'
import { useBackgroundRemoval } from '@/hooks/useBackgroundRemoval'
import { useTranslations } from 'next-intl'
import { AlertCircle, X } from 'lucide-react'

export function ImageToolsClient() {
  const t = useTranslations('imageTools')
  const sourceImage = useSourceImage()
  const error = useImageError()
  const clearImage = useClearImage()
  const bgRemovalModel = useBgRemovalModel()
  const { preloadModel } = useBackgroundRemoval()

  // Rehydrate store on client
  useEffect(() => {
    useImageToolsStore.persist.rehydrate()
  }, [])

  // Preload AI model based on user's preferred model
  useEffect(() => {
    preloadModel(bgRemovalModel)
  }, [preloadModel, bgRemovalModel])

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full">
      {/* Preview Area */}
      <div className="flex-1 flex flex-col order-1 lg:order-1">
        {/* Main Preview / Dropzone */}
        <div className="flex-1 p-4 sm:p-6 bg-[var(--muted)] rounded-xl overflow-hidden relative min-h-[300px] sm:min-h-[400px] max-h-[60vh] lg:max-h-none">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative z-10 h-full">
            {sourceImage ? <ImagePreview /> : <ImageDropzone />}
          </div>

          {/* Clear Image Button */}
          {sourceImage && (
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              title="Clear image"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm">{t(`errors.${error}`)}</p>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4 overflow-y-auto order-2 lg:order-2">
        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
          <ControlPanel />
        </div>
        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
          <ExportButtons />
        </div>
      </div>
    </div>
  )
}
