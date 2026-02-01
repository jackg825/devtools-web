'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  exportToPng,
  exportToSvg,
  downloadDataUrl,
  copyToClipboard,
  type ExportOptions,
} from '@/utils/exportImage'

type ExportStatus = 'idle' | 'exporting' | 'success' | 'error'

interface UseExportResult {
  previewRef: React.RefObject<HTMLDivElement | null>
  status: ExportStatus
  error: Error | null
  downloadPng: (filename?: string, options?: ExportOptions) => Promise<void>
  downloadSvg: (filename?: string, options?: ExportOptions) => Promise<void>
  copyImage: (options?: ExportOptions) => Promise<boolean>
}

export function useExport(): UseExportResult {
  const previewRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<ExportStatus>('idle')
  const [error, setError] = useState<Error | null>(null)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const setStatusWithReset = useCallback((newStatus: ExportStatus) => {
    setStatus(newStatus)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (newStatus === 'success' || newStatus === 'error') {
      timeoutRef.current = setTimeout(() => setStatus('idle'), 2000)
    }
  }, [])

  const downloadPng = useCallback(
    async (filename = 'code-canvas', options: ExportOptions = {}) => {
      if (!previewRef.current) return

      setStatus('exporting')
      setError(null)

      try {
        const dataUrl = await exportToPng(previewRef.current, options)
        downloadDataUrl(dataUrl, `${filename}.png`)
        setStatusWithReset('success')
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Export failed'))
        setStatusWithReset('error')
      }
    },
    [setStatusWithReset]
  )

  const downloadSvg = useCallback(
    async (filename = 'code-canvas', options: ExportOptions = {}) => {
      if (!previewRef.current) return

      setStatus('exporting')
      setError(null)

      try {
        const dataUrl = await exportToSvg(previewRef.current, options)
        downloadDataUrl(dataUrl, `${filename}.svg`)
        setStatusWithReset('success')
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Export failed'))
        setStatusWithReset('error')
      }
    },
    [setStatusWithReset]
  )

  const copyImage = useCallback(
    async (options: ExportOptions = {}): Promise<boolean> => {
      if (!previewRef.current) return false

      setStatus('exporting')
      setError(null)

      try {
        const success = await copyToClipboard(previewRef.current, options)
        setStatusWithReset(success ? 'success' : 'error')
        return success
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Copy failed'))
        setStatusWithReset('error')
        return false
      }
    },
    [setStatusWithReset]
  )

  return {
    previewRef,
    status,
    error,
    downloadPng,
    downloadSvg,
    copyImage,
  }
}
