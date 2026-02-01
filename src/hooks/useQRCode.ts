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
  logoMargin?: number
}

export type ExportFormat = 'png' | 'jpeg' | 'webp' | 'svg'
export type ExportSize = 256 | 512 | 1024 | 2048

export const EXPORT_FORMATS: ExportFormat[] = ['png', 'jpeg', 'webp', 'svg']
export const EXPORT_SIZES: ExportSize[] = [256, 512, 1024, 2048]

interface UseQRCodeResult {
  containerRef: React.RefObject<HTMLDivElement | null>
  isLoading: boolean
  error: Error | null
  download: (format: ExportFormat, size: ExportSize, filename?: string) => Promise<void>
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

/**
 * 為 logo 添加保持原形狀的邊框
 * 使用 Canvas globalCompositeOperation 技術：
 * 1. 繪製放大的 logo（作為邊框底層）
 * 2. 用邊框顏色填充該放大區域
 * 3. 在上方繪製原始大小的 logo
 * 這樣可以保持 logo 原本的形狀（圓形、方形或不規則形狀）
 */
async function addBorderToLogo(
  logoSrc: string,
  borderWidth: number,
  borderColor: string = '#ffffff'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // 使用較高的內部解析度來避免模糊
      // 確保最小處理尺寸為 1024px 以保持品質
      const minSize = 1024
      const scale = Math.max(1, minSize / Math.max(img.width, img.height))
      const scaledWidth = img.width * scale
      const scaledHeight = img.height * scale

      // 邊框實際像素（根據圖片尺寸調整）
      const border = borderWidth * 6 * scale

      const canvas = document.createElement('canvas')
      canvas.width = scaledWidth + border * 2
      canvas.height = scaledHeight + border * 2
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      // 設置高品質圖像平滑
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // 1. 繪製放大的 logo（用於邊框輪廓）
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // 2. 用邊框顏色填充 logo 形狀區域
      ctx.globalCompositeOperation = 'source-in'
      ctx.fillStyle = borderColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 3. 在上方繪製原始 logo（使用高品質縮放）
      ctx.globalCompositeOperation = 'source-over'
      ctx.drawImage(img, border, border, scaledWidth, scaledHeight)

      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('Failed to load logo image'))
    img.src = logoSrc
  })
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
          const logoSizePercent = (options.logoSize || 40) / 100
          const logoMargin = options.logoMargin ?? 0
          const desiredLogoPx = options.size * logoSizePercent

          let finalLogoImage = options.logoImage
          let finalMargin = logoMargin

          // If border is enabled, pre-process logo with rounded border
          if (logoMargin > 0) {
            try {
              const borderColor = options.transparentBackground
                ? 'transparent'
                : options.backgroundColor
              finalLogoImage = await addBorderToLogo(
                options.logoImage,
                logoMargin,
                borderColor
              )
              finalMargin = 0 // Border is now built into the image
            } catch (e) {
              console.error('Failed to process logo border:', e)
            }
          }

          // Compensate imageSize for margin
          const compensatedImageSize = (desiredLogoPx + logoMargin * 2) / options.size

          qrOptions.image = finalLogoImage
          qrOptions.imageOptions = {
            crossOrigin: 'anonymous',
            margin: finalMargin,
            imageSize: Math.min(compensatedImageSize, 0.85),
            hideBackgroundDots: false, // 不使用方形遮罩，讓邊框自己遮住 QR 點
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
    options.logoMargin,
  ])

  // Store current options for download with custom size
  const optionsRef = useRef(options)
  optionsRef.current = options

  const download = useCallback(async (
    format: ExportFormat,
    size: ExportSize,
    filename = 'qr-code'
  ) => {
    const opts = optionsRef.current
    const QRCodeStylingModule = await import('qr-code-styling')
    const QRCodeStylingClass = QRCodeStylingModule.default

    const qrOptions: ConstructorParameters<typeof QRCodeStylingClass>[0] = {
      width: size,
      height: size,
      data: opts.data || 'https://example.com',
      margin: opts.margin,
      qrOptions: {
        errorCorrectionLevel: opts.errorCorrectionLevel,
        ...(opts.version > 0 ? { version: opts.version } : {}),
      },
      dotsOptions: {
        type: dotStyleMap[opts.dotStyle],
        color: opts.color,
      },
      cornersSquareOptions: {
        type: cornerSquareStyleMap[opts.cornerSquareStyle],
        color: opts.cornerSquareColor,
      },
      cornersDotOptions: {
        type: cornerDotStyleMap[opts.cornerDotStyle],
        color: opts.cornerDotColor,
      },
      backgroundOptions: {
        color: opts.transparentBackground ? 'transparent' : opts.backgroundColor,
      },
    }

    if (opts.logoImage) {
      const logoSizePercent = (opts.logoSize || 40) / 100
      const logoMargin = opts.logoMargin ?? 0
      const desiredLogoPx = size * logoSizePercent

      let finalLogoImage = opts.logoImage
      let finalMargin = logoMargin

      if (logoMargin > 0) {
        try {
          const borderColor = opts.transparentBackground
            ? 'transparent'
            : opts.backgroundColor
          finalLogoImage = await addBorderToLogo(
            opts.logoImage,
            logoMargin,
            borderColor
          )
          finalMargin = 0
        } catch (e) {
          console.error('Failed to process logo border:', e)
        }
      }

      const compensatedImageSize = (desiredLogoPx + logoMargin * 2) / size

      qrOptions.image = finalLogoImage
      qrOptions.imageOptions = {
        crossOrigin: 'anonymous',
        margin: finalMargin,
        imageSize: Math.min(compensatedImageSize, 0.85),
        hideBackgroundDots: false, // 不使用方形遮罩，讓邊框自己遮住 QR 點
      }
    }

    const exportQR = new QRCodeStylingClass(qrOptions)
    await exportQR.download({
      name: filename,
      extension: format,
    })
  }, [])

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
    download,
    downloadPng,
    downloadSvg,
  }
}
