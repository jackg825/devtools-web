'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/shallow'
import type {
  ImageToolsSettings,
  OutputFormat,
  ResizeMode,
  BackgroundRemovalModel,
} from '@/types/imageTools'

interface ImageToolsStore extends ImageToolsSettings {
  // Setters
  setSourceImage: (image: string | null, fileName?: string | null) => void
  setOriginalDimensions: (width: number, height: number) => void
  setOutputFormat: (format: OutputFormat) => void
  setQuality: (quality: number) => void
  setTargetWidth: (width: number) => void
  setTargetHeight: (height: number) => void
  setMaintainAspectRatio: (maintain: boolean) => void
  setResizeMode: (mode: ResizeMode) => void
  setRemoveBackground: (remove: boolean) => void
  setBgRemovalModel: (model: BackgroundRemovalModel) => void
  setProcessingState: (isProcessing: boolean, step?: string | null, progress?: number) => void
  setProcessedImage: (image: string | null) => void
  setError: (error: string | null) => void
  reset: () => void
  clearImage: () => void
}

const defaultSettings: ImageToolsSettings = {
  sourceImage: null,
  sourceFileName: null,
  originalWidth: 0,
  originalHeight: 0,
  outputFormat: 'png',
  quality: 90,
  targetWidth: 0,
  targetHeight: 0,
  maintainAspectRatio: true,
  resizeMode: 'pixels',
  removeBackground: false,
  bgRemovalModel: 'isnet',
  isProcessing: false,
  processingStep: null,
  processingProgress: 0,
  processedImage: null,
  error: null,
}

export const useImageToolsStore = create<ImageToolsStore>()(
  persist(
    (set, get) => ({
      ...defaultSettings,

      setSourceImage: (image, fileName = null) => {
        set({
          sourceImage: image,
          sourceFileName: fileName,
          processedImage: null,
          error: null,
        })
      },

      setOriginalDimensions: (width, height) => {
        const state = get()
        set({
          originalWidth: width,
          originalHeight: height,
          targetWidth: state.targetWidth === 0 ? width : state.targetWidth,
          targetHeight: state.targetHeight === 0 ? height : state.targetHeight,
        })
      },

      setOutputFormat: (format) => set({ outputFormat: format }),
      setQuality: (quality) => set({ quality }),

      setTargetWidth: (width) => {
        const state = get()
        if (state.maintainAspectRatio && state.originalWidth > 0) {
          const ratio = state.originalHeight / state.originalWidth
          set({ targetWidth: width, targetHeight: Math.round(width * ratio) })
        } else {
          set({ targetWidth: width })
        }
      },

      setTargetHeight: (height) => {
        const state = get()
        if (state.maintainAspectRatio && state.originalHeight > 0) {
          const ratio = state.originalWidth / state.originalHeight
          set({ targetHeight: height, targetWidth: Math.round(height * ratio) })
        } else {
          set({ targetHeight: height })
        }
      },

      setMaintainAspectRatio: (maintain) => set({ maintainAspectRatio: maintain }),
      setResizeMode: (mode) => set({ resizeMode: mode }),
      setRemoveBackground: (remove) => set({ removeBackground: remove }),
      setBgRemovalModel: (model) => set({ bgRemovalModel: model }),

      setProcessingState: (isProcessing, step = null, progress = 0) =>
        set({ isProcessing, processingStep: step, processingProgress: progress }),

      setProcessedImage: (image) =>
        set({ processedImage: image, isProcessing: false, processingStep: null }),

      setError: (error) =>
        set({ error, isProcessing: false, processingStep: null }),

      reset: () => set(defaultSettings),

      clearImage: () =>
        set({
          sourceImage: null,
          sourceFileName: null,
          originalWidth: 0,
          originalHeight: 0,
          targetWidth: 0,
          targetHeight: 0,
          processedImage: null,
          error: null,
        }),
    }),
    {
      name: 'devtools-image-tools',
      skipHydration: true,
      partialize: (state) => ({
        outputFormat: state.outputFormat,
        quality: state.quality,
        maintainAspectRatio: state.maintainAspectRatio,
        resizeMode: state.resizeMode,
        bgRemovalModel: state.bgRemovalModel,
      }),
    }
  )
)

// Atomic Selectors
export const useSourceImage = () => useImageToolsStore((s) => s.sourceImage)
export const useSourceFileName = () => useImageToolsStore((s) => s.sourceFileName)
export const useOriginalWidth = () => useImageToolsStore((s) => s.originalWidth)
export const useOriginalHeight = () => useImageToolsStore((s) => s.originalHeight)
export const useOutputFormat = () => useImageToolsStore((s) => s.outputFormat)
export const useQuality = () => useImageToolsStore((s) => s.quality)
export const useTargetWidth = () => useImageToolsStore((s) => s.targetWidth)
export const useTargetHeight = () => useImageToolsStore((s) => s.targetHeight)
export const useMaintainAspectRatio = () => useImageToolsStore((s) => s.maintainAspectRatio)
export const useResizeMode = () => useImageToolsStore((s) => s.resizeMode)
export const useRemoveBackground = () => useImageToolsStore((s) => s.removeBackground)
export const useBgRemovalModel = () => useImageToolsStore((s) => s.bgRemovalModel)
export const useIsProcessing = () => useImageToolsStore((s) => s.isProcessing)
export const useProcessingStep = () => useImageToolsStore((s) => s.processingStep)
export const useProcessingProgress = () => useImageToolsStore((s) => s.processingProgress)
export const useProcessedImage = () => useImageToolsStore((s) => s.processedImage)
export const useImageError = () => useImageToolsStore((s) => s.error)

// Action Selectors
export const useSetSourceImage = () => useImageToolsStore((s) => s.setSourceImage)
export const useSetOriginalDimensions = () => useImageToolsStore((s) => s.setOriginalDimensions)
export const useSetOutputFormat = () => useImageToolsStore((s) => s.setOutputFormat)
export const useSetQuality = () => useImageToolsStore((s) => s.setQuality)
export const useSetTargetWidth = () => useImageToolsStore((s) => s.setTargetWidth)
export const useSetTargetHeight = () => useImageToolsStore((s) => s.setTargetHeight)
export const useSetMaintainAspectRatio = () => useImageToolsStore((s) => s.setMaintainAspectRatio)
export const useSetResizeMode = () => useImageToolsStore((s) => s.setResizeMode)
export const useSetRemoveBackground = () => useImageToolsStore((s) => s.setRemoveBackground)
export const useSetBgRemovalModel = () => useImageToolsStore((s) => s.setBgRemovalModel)
export const useSetProcessingState = () => useImageToolsStore((s) => s.setProcessingState)
export const useSetProcessedImage = () => useImageToolsStore((s) => s.setProcessedImage)
export const useSetError = () => useImageToolsStore((s) => s.setError)
export const useResetImageTools = () => useImageToolsStore((s) => s.reset)
export const useClearImage = () => useImageToolsStore((s) => s.clearImage)

// Grouped Selectors
export const useImageDimensions = () =>
  useImageToolsStore(
    useShallow((s) => ({
      originalWidth: s.originalWidth,
      originalHeight: s.originalHeight,
      targetWidth: s.targetWidth,
      targetHeight: s.targetHeight,
    }))
  )

export const useProcessingStatus = () =>
  useImageToolsStore(
    useShallow((s) => ({
      isProcessing: s.isProcessing,
      processingStep: s.processingStep,
      processingProgress: s.processingProgress,
      error: s.error,
    }))
  )

export const useExportSettings = () =>
  useImageToolsStore(
    useShallow((s) => ({
      outputFormat: s.outputFormat,
      quality: s.quality,
      targetWidth: s.targetWidth,
      targetHeight: s.targetHeight,
    }))
  )
