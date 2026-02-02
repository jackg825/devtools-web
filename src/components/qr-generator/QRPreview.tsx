'use client'

import { memo } from 'react'
import { Loader2 } from 'lucide-react'
import { useQRCode, type ExportFormat, type ExportSize } from '@/hooks/useQRCode'
import type {
  DotStyle,
  CornerSquareStyle,
  CornerDotStyle,
  ErrorCorrectionLevel,
} from '@/types/qr'

interface QRPreviewProps {
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
  onDownload: (download: (format: ExportFormat, size: ExportSize, filename?: string) => Promise<void>) => void
  onDownloadPng: (download: (filename?: string) => Promise<void>) => void
  onDownloadSvg: (download: (filename?: string) => Promise<void>) => void
}

export const QRPreview = memo(function QRPreview(props: QRPreviewProps) {
  const { onDownload, onDownloadPng, onDownloadSvg, ...qrOptions } = props

  const { containerRef, isLoading, error, download, downloadPng, downloadSvg } = useQRCode(qrOptions)

  // Pass download functions to parent
  onDownload(download)
  onDownloadPng(downloadPng)
  onDownloadSvg(downloadSvg)

  return (
    <div className="relative flex items-center justify-center max-w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)]/80 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
        </div>
      )}
      {error && (
        <div className="text-red-500 text-sm p-4">
          {error.message}
        </div>
      )}
      <div
        ref={containerRef}
        className="flex items-center justify-center aspect-square [&>canvas]:max-w-full [&>canvas]:max-h-[45vh] [&>canvas]:w-auto [&>canvas]:h-auto [&>svg]:max-w-full [&>svg]:max-h-[45vh] [&>svg]:w-auto [&>svg]:h-auto"
      />
    </div>
  )
})
