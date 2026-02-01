'use client'

import { memo } from 'react'
import { Loader2 } from 'lucide-react'
import { useQRCode } from '@/hooks/useQRCode'
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
  onDownloadPng: (download: (filename?: string) => Promise<void>) => void
  onDownloadSvg: (download: (filename?: string) => Promise<void>) => void
}

export const QRPreview = memo(function QRPreview(props: QRPreviewProps) {
  const { onDownloadPng, onDownloadSvg, ...qrOptions } = props

  const { containerRef, isLoading, error, downloadPng, downloadSvg } = useQRCode(qrOptions)

  // Pass download functions to parent
  onDownloadPng(downloadPng)
  onDownloadSvg(downloadSvg)

  return (
    <div className="relative flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)]/80">
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
        className="flex items-center justify-center"
        style={{
          minWidth: props.size,
          minHeight: props.size,
        }}
      />
    </div>
  )
})
