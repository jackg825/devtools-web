'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Download, Copy, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  useSourceImage,
  useProcessedImage,
  useOutputFormat,
  useQuality,
  useTargetWidth,
  useTargetHeight,
  useRemoveBackground,
  useBgRemovalModel,
  useOriginalWidth,
  useOriginalHeight,
  useIsProcessing,
  useProcessingStep,
  useProcessingProgress,
  useSetProcessingState,
  useSetProcessedImage,
  useSetError,
  useSourceFileName,
} from '@/stores/imageToolsStore'
import { useImageResize } from '@/hooks/useImageResize'
import { useBackgroundRemoval } from '@/hooks/useBackgroundRemoval'
import { useSmoothedProgress } from '@/hooks/useSmoothedProgress'
import { convertFormat, downloadImage, copyImageToClipboard } from '@/utils/imageUtils'

export function ExportButtons() {
  const t = useTranslations('imageTools.export')
  const [copied, setCopied] = useState(false)

  const sourceImage = useSourceImage()
  const sourceFileName = useSourceFileName()
  const processedImage = useProcessedImage()
  const outputFormat = useOutputFormat()
  const quality = useQuality()
  const targetWidth = useTargetWidth()
  const targetHeight = useTargetHeight()
  const removeBackground = useRemoveBackground()
  const bgRemovalModel = useBgRemovalModel()
  const originalWidth = useOriginalWidth()
  const originalHeight = useOriginalHeight()
  const isProcessing = useIsProcessing()
  const processingStep = useProcessingStep()
  const processingProgress = useProcessingProgress()
  const smoothedProgress = useSmoothedProgress(processingProgress)

  const setProcessingState = useSetProcessingState()
  const setProcessedImage = useSetProcessedImage()
  const setError = useSetError()

  const { resize } = useImageResize()
  const { removeBackground: removeBg } = useBackgroundRemoval()

  const needsProcessing =
    targetWidth !== originalWidth ||
    targetHeight !== originalHeight ||
    removeBackground

  const processImage = useCallback(async () => {
    if (!sourceImage) return

    setProcessingState(true, t('processing'), 0)
    setError(null)

    try {
      let currentImage = sourceImage

      // Step 1: Background removal (if enabled)
      if (removeBackground) {
        currentImage = await removeBg(currentImage, {
          model: bgRemovalModel,
          onProgress: (progress, message) => {
            const totalProgress = progress * 0.8
            setProcessingState(true, message || t('processingImage'), totalProgress)
          },
        })
      }

      // Step 2: Resize (if needed)
      const needsResize = targetWidth !== originalWidth || targetHeight !== originalHeight
      if (needsResize) {
        setProcessingState(true, t('resizing'), removeBackground ? 85 : 50)
        currentImage = await resize(currentImage, {
          width: targetWidth,
          height: targetHeight,
        })
      }

      // Step 3: Format conversion
      setProcessingState(true, t('converting'), 95)
      currentImage = await convertFormat(currentImage, outputFormat, quality)

      // Complete
      setProcessingState(true, t('processing'), 100)

      // Brief delay to show 100% completion
      await new Promise((resolve) => setTimeout(resolve, 300))

      setProcessedImage(currentImage)
    } catch {
      setError('processingFailed')
      setProcessingState(false, null, 0)
    }
  }, [
    sourceImage,
    removeBackground,
    removeBg,
    bgRemovalModel,
    targetWidth,
    targetHeight,
    originalWidth,
    originalHeight,
    resize,
    outputFormat,
    quality,
    setProcessingState,
    setProcessedImage,
    setError,
    t,
  ])

  const handleDownload = useCallback(async () => {
    const imageToDownload = processedImage || sourceImage
    if (!imageToDownload) return

    // If needs processing and no processed image yet, process first
    if (needsProcessing && !processedImage) {
      await processImage()
      return // Will trigger re-render with processedImage
    }

    const baseName = sourceFileName?.replace(/\.[^/.]+$/, '') || 'image'
    await downloadImage(imageToDownload, baseName, outputFormat)
  }, [processedImage, sourceImage, needsProcessing, processImage, sourceFileName, outputFormat])

  const handleCopy = useCallback(async () => {
    const imageToCopy = processedImage || sourceImage
    if (!imageToCopy) return

    try {
      await copyImageToClipboard(imageToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy error:', error)
    }
  }, [processedImage, sourceImage])

  if (!sourceImage) return null

  return (
    <div className="space-y-3">
      {/* Process Button (if needed) */}
      {needsProcessing && (
        isProcessing ? (
          <div className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-white rounded-lg relative overflow-hidden">
            <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
            <span className="font-medium">{processingStep || t('processing')}</span>
            {smoothedProgress > 0 && (
              <span className="text-white/80 tabular-nums">({Math.round(smoothedProgress)}%)</span>
            )}
            {/* Background progress indicator - uses smoothed progress for fluid animation */}
            <div
              className="absolute inset-0 bg-white/10 origin-left"
              style={{ transform: `scaleX(${smoothedProgress / 100})` }}
            />
          </div>
        ) : (
          <Button onClick={processImage} className="w-full" variant="default">
            {t('process')}
          </Button>
        )
      )}

      {/* Download & Copy */}
      <div className="flex gap-2">
        <Button
          onClick={handleDownload}
          disabled={isProcessing || (needsProcessing && !processedImage)}
          className="flex-1"
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" />
          {t('download')}
        </Button>

        <Button
          onClick={handleCopy}
          disabled={isProcessing}
          variant="outline"
          className="px-3"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Processing Progress - uses smoothed progress for fluid animation */}
      {isProcessing && (
        <div className="w-full bg-[var(--muted)] rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-[var(--accent)]"
            style={{ width: `${Math.max(smoothedProgress, 2)}%` }}
          />
        </div>
      )}
    </div>
  )
}
