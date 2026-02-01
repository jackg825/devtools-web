'use client'

import { useEffect, useRef, useCallback } from 'react'
import { QRPreview } from './QRPreview'
import { QRControlPanel } from './QRControlPanel'
import { QRDataInput } from './QRDataInput'
import { QRExportButtons } from './QRExportButtons'
import { useQRGeneratorStore, useQRPreviewSettings } from '@/stores/qrGeneratorStore'

export function QRGeneratorClient() {
  const settings = useQRPreviewSettings()

  // Store download functions from QRPreview
  const downloadPngRef = useRef<(filename?: string) => Promise<void>>(() => Promise.resolve())
  const downloadSvgRef = useRef<(filename?: string) => Promise<void>>(() => Promise.resolve())

  // Rehydrate store on client
  useEffect(() => {
    useQRGeneratorStore.persist.rehydrate()
  }, [])

  const handleSetDownloadPng = useCallback((fn: (filename?: string) => Promise<void>) => {
    downloadPngRef.current = fn
  }, [])

  const handleSetDownloadSvg = useCallback((fn: (filename?: string) => Promise<void>) => {
    downloadSvgRef.current = fn
  }, [])

  const handleDownloadPng = useCallback(async () => {
    await downloadPngRef.current('qr-code')
  }, [])

  const handleDownloadSvg = useCallback(async () => {
    await downloadSvgRef.current('qr-code')
  }, [])

  return (
    <div className="flex gap-6 h-full">
      {/* Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* QR Preview */}
        <div className="flex-1 flex items-center justify-center p-8 bg-[var(--muted)] rounded-xl overflow-auto relative">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative z-10 bg-white p-4 rounded-lg shadow-lg">
            <QRPreview
              {...settings}
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
      <div className="w-[280px] flex-shrink-0 space-y-4 overflow-y-auto">
        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
          <QRControlPanel />
        </div>
        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
          <QRExportButtons
            downloadPng={handleDownloadPng}
            downloadSvg={handleDownloadSvg}
          />
        </div>
      </div>
    </div>
  )
}
