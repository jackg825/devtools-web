'use client'

import { useEffect, useRef, useCallback } from 'react'
import { QRPreview } from './QRPreview'
import { QRControlPanel } from './QRControlPanel'
import { QRDataInput } from './QRDataInput'
import { QRExportButtons } from './QRExportButtons'
import { useQRGeneratorStore, useQRPreviewSettings } from '@/stores/qrGeneratorStore'
import { cn } from '@/lib/utils'
import type { ExportFormat, ExportSize } from '@/hooks/useQRCode'

export function QRGeneratorClient() {
  const settings = useQRPreviewSettings()

  // Store download functions from QRPreview
  const downloadRef = useRef<(format: ExportFormat, size: ExportSize, filename?: string) => Promise<void>>(
    () => Promise.resolve()
  )
  const downloadPngRef = useRef<(filename?: string) => Promise<void>>(() => Promise.resolve())
  const downloadSvgRef = useRef<(filename?: string) => Promise<void>>(() => Promise.resolve())

  // Rehydrate store on client
  useEffect(() => {
    useQRGeneratorStore.persist.rehydrate()
  }, [])

  const handleSetDownload = useCallback(
    (fn: (format: ExportFormat, size: ExportSize, filename?: string) => Promise<void>) => {
      downloadRef.current = fn
    },
    []
  )

  const handleSetDownloadPng = useCallback((fn: (filename?: string) => Promise<void>) => {
    downloadPngRef.current = fn
  }, [])

  const handleSetDownloadSvg = useCallback((fn: (filename?: string) => Promise<void>) => {
    downloadSvgRef.current = fn
  }, [])

  const handleDownload = useCallback(
    async (format: ExportFormat, size: ExportSize, filename?: string) => {
      await downloadRef.current(format, size, filename || 'qr-code')
    },
    []
  )

  const handleDownloadPng = useCallback(async () => {
    await downloadPngRef.current('qr-code')
  }, [])

  const handleDownloadSvg = useCallback(async () => {
    await downloadSvgRef.current('qr-code')
  }, [])

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full">
      {/* Preview Area */}
      <div className="flex-1 flex flex-col order-1 lg:order-1">
        {/* QR Preview */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-[var(--muted)] rounded-xl overflow-hidden relative min-h-[280px] sm:min-h-[300px] max-h-[50vh] lg:max-h-[60vh]">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div
            className={cn(
              'relative z-10 p-3 sm:p-4 rounded-lg shadow-lg max-w-full max-h-full',
              !settings.transparentBackground && 'bg-white'
            )}
            style={settings.transparentBackground ? {
              backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
              backgroundColor: '#ffffff',
            } : undefined}
          >
            <QRPreview
              {...settings}
              onDownload={handleSetDownload}
              onDownloadPng={handleSetDownloadPng}
              onDownloadSvg={handleSetDownloadSvg}
            />
          </div>
        </div>

        {/* Data Input */}
        <div className="mt-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
          <QRDataInput />
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4 overflow-y-auto order-2 lg:order-2">
        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
          <QRControlPanel />
        </div>
        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
          <QRExportButtons
            download={handleDownload}
            downloadPng={handleDownloadPng}
            downloadSvg={handleDownloadSvg}
          />
        </div>
      </div>
    </div>
  )
}
