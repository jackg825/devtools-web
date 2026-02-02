'use client'

import { useCallback, useRef } from 'react'
import type PicaLib from 'pica'

let picaInstance: PicaLib.Pica | null = null

async function getPica(): Promise<PicaLib.Pica> {
  if (!picaInstance) {
    const PicaModule = (await import('pica')).default
    picaInstance = new PicaModule()
  }
  return picaInstance
}

interface ResizeOptions {
  width: number
  height: number
  quality?: 0 | 1 | 2 | 3
}

export function useImageResize() {
  const abortControllerRef = useRef<AbortController | null>(null)

  const resize = useCallback(
    async (
      imageSource: string | HTMLImageElement,
      options: ResizeOptions,
      onProgress?: (progress: number) => void
    ): Promise<string> => {
      // Cancel any previous operation
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      const pica = await getPica()

      // Load image if string
      const img =
        typeof imageSource === 'string'
          ? await loadImage(imageSource)
          : imageSource

      // Create source canvas
      const sourceCanvas = document.createElement('canvas')
      sourceCanvas.width = img.naturalWidth || img.width
      sourceCanvas.height = img.naturalHeight || img.height

      const sourceCtx = sourceCanvas.getContext('2d')
      if (!sourceCtx) throw new Error('Canvas context not available')
      sourceCtx.drawImage(img, 0, 0)

      // Create destination canvas
      const destCanvas = document.createElement('canvas')
      destCanvas.width = options.width
      destCanvas.height = options.height

      onProgress?.(10)

      // Resize with pica
      await pica.resize(sourceCanvas, destCanvas, {
        quality: options.quality ?? 3,
      })

      onProgress?.(90)

      // Convert to data URL
      const result = destCanvas.toDataURL('image/png')

      onProgress?.(100)

      return result
    },
    []
  )

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort()
  }, [])

  return { resize, cancel }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
