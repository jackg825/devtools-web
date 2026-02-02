'use client'

import { useCallback, useRef, useState } from 'react'
import type { BackgroundRemovalModel } from '@/types/imageTools'

interface RemovalOptions {
  model?: BackgroundRemovalModel
  onProgress?: (progress: number, message?: string) => void
}

export function useBackgroundRemoval() {
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const removeBackground = useCallback(
    async (
      imageSource: string,
      options: RemovalOptions = {}
    ): Promise<string> => {
      // Cancel any previous operation
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      const { model = 'isnet', onProgress } = options

      try {
        onProgress?.(2, 'Loading library...')

        const { removeBackground: removeBg } = await import('@imgly/background-removal')

        onProgress?.(5, 'Initializing...')

        let lastProgress = 5
        const blob = await removeBg(imageSource, {
          model,
          device: 'cpu',
          progress: (key, current, total) => {
            const stepProgress = total > 0 ? (current / total) : 0

            if (key.startsWith('fetch:')) {
              // Model downloading: 5% - 35%
              const newProgress = 5 + stepProgress * 30
              if (newProgress > lastProgress) {
                lastProgress = newProgress
                onProgress?.(newProgress, 'Downloading model...')
              }
            } else if (key.startsWith('compute:')) {
              // Processing: 35% - 95%
              setIsModelLoaded(true)
              const newProgress = 35 + stepProgress * 60
              if (newProgress > lastProgress) {
                lastProgress = newProgress
                onProgress?.(newProgress, 'Processing...')
              }
            }
          },
        })

        onProgress?.(98, 'Finalizing...')

        // Convert blob to data URL
        const result = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(new Error('Failed to read result'))
          reader.readAsDataURL(blob)
        })

        onProgress?.(100, 'Complete')

        return result
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          throw new Error('Operation cancelled')
        }
        throw error
      }
    },
    []
  )

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort()
  }, [])

  const preloadModel = useCallback(async (model: BackgroundRemovalModel = 'isnet') => {
    try {
      const { preload } = await import('@imgly/background-removal')
      await preload({ model, device: 'cpu' })
      setIsModelLoaded(true)
    } catch {
      // Preload is optional, ignore errors
    }
  }, [])

  return {
    removeBackground,
    cancel,
    preloadModel,
    isModelLoaded,
  }
}
