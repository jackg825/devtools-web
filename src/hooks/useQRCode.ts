'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type QRCodeStyling from 'qr-code-styling'
import type {
  DotStyle,
  CornerSquareStyle,
  CornerDotStyle,
  ErrorCorrectionLevel,
} from '@/types/qr'

interface UseQRCodeOptions {
  data: string
  size: number
  color: string
  backgroundColor: string
  transparentBackground: boolean
  version: number
  errorCorrectionLevel: ErrorCorrectionLevel
  margin: number
  dotStyle: DotStyle
  cornerSquareStyle: CornerSquareStyle
  cornerSquareColor: string
  cornerDotStyle: CornerDotStyle
  cornerDotColor: string
  logoImage?: string
  logoSize?: number
}

interface UseQRCodeResult {
  containerRef: React.RefObject<HTMLDivElement | null>
  isLoading: boolean
  error: Error | null
  downloadPng: (filename?: string) => Promise<void>
  downloadSvg: (filename?: string) => Promise<void>
}

const dotStyleMap: Record<DotStyle, 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded'> = {
  'square': 'square',
  'rounded': 'rounded',
  'dots': 'dots',
  'classy': 'classy',
  'classy-rounded': 'classy-rounded',
  'extra-rounded': 'extra-rounded',
}

const cornerSquareStyleMap: Record<CornerSquareStyle, 'square' | 'dot' | 'extra-rounded'> = {
  'square': 'square',
  'dot': 'dot',
  'extra-rounded': 'extra-rounded',
}

const cornerDotStyleMap: Record<CornerDotStyle, 'square' | 'dot'> = {
  'square': 'square',
  'dot': 'dot',
}

export function useQRCode(options: UseQRCodeOptions): UseQRCodeResult {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrCodeRef = useRef<QRCodeStyling | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    const initQR = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const QRCodeStylingModule = await import('qr-code-styling')
        const QRCodeStylingClass = QRCodeStylingModule.default

        if (!mounted) return

        const qrOptions: ConstructorParameters<typeof QRCodeStylingClass>[0] = {
          width: options.size,
          height: options.size,
          data: options.data || 'https://example.com',
          margin: options.margin,
          qrOptions: {
            errorCorrectionLevel: options.errorCorrectionLevel,
            ...(options.version > 0 ? { version: options.version } : {}),
          },
          dotsOptions: {
            type: dotStyleMap[options.dotStyle],
            color: options.color,
          },
          cornersSquareOptions: {
            type: cornerSquareStyleMap[options.cornerSquareStyle],
            color: options.cornerSquareColor,
          },
          cornersDotOptions: {
            type: cornerDotStyleMap[options.cornerDotStyle],
            color: options.cornerDotColor,
          },
          backgroundOptions: {
            color: options.transparentBackground ? 'transparent' : options.backgroundColor,
          },
        }

        if (options.logoImage) {
          qrOptions.image = options.logoImage
          qrOptions.imageOptions = {
            crossOrigin: 'anonymous',
            margin: 5,
            imageSize: (options.logoSize || 20) / 100,
          }
        }

        const qrCode = new QRCodeStylingClass(qrOptions)
        qrCodeRef.current = qrCode

        // Clear container using safe DOM methods
        if (containerRef.current) {
          while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild)
          }
          qrCode.append(containerRef.current)
        }

        setIsLoading(false)
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to generate QR code'))
          setIsLoading(false)
        }
      }
    }

    initQR()

    return () => {
      mounted = false
    }
  }, [
    options.data,
    options.size,
    options.color,
    options.backgroundColor,
    options.transparentBackground,
    options.version,
    options.errorCorrectionLevel,
    options.margin,
    options.dotStyle,
    options.cornerSquareStyle,
    options.cornerSquareColor,
    options.cornerDotStyle,
    options.cornerDotColor,
    options.logoImage,
    options.logoSize,
  ])

  const downloadPng = useCallback(async (filename = 'qr-code') => {
    if (qrCodeRef.current) {
      await qrCodeRef.current.download({
        name: filename,
        extension: 'png',
      })
    }
  }, [])

  const downloadSvg = useCallback(async (filename = 'qr-code') => {
    if (qrCodeRef.current) {
      await qrCodeRef.current.download({
        name: filename,
        extension: 'svg',
      })
    }
  }, [])

  return {
    containerRef,
    isLoading,
    error,
    downloadPng,
    downloadSvg,
  }
}
