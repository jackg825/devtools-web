'use client'

import { useEffect } from 'react'
import { TerminalPreview } from './TerminalPreview'
import { ControlPanel } from './ControlPanel'
import { ExportButtons } from './ExportButtons'
import { useExport } from '@/hooks/useExport'
import {
  useCodeCanvasStore,
  usePreviewSettings,
  usePreviewActions,
} from '@/stores/codeCanvasStore'
import '@/styles/effects.css'

export function CodeCanvasClient() {
  const { previewRef, status, downloadPng, downloadSvg, copyImage } = useExport()
  const settings = usePreviewSettings()
  const { setCode, setTabTitle } = usePreviewActions()

  // Rehydrate store on client
  useEffect(() => {
    useCodeCanvasStore.persist.rehydrate()
  }, [])

  return (
    <div className="flex gap-6 h-full">
      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[var(--muted)] rounded-xl overflow-auto relative">
        {/* Dotted grid pattern */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10">
          <TerminalPreview
            ref={previewRef}
            code={settings.code}
            language={settings.language}
            themeId={settings.theme}
            fontSize={settings.fontSize}
            lineHeight={settings.lineHeight}
            padding={settings.padding}
            borderRadius={settings.borderRadius}
            showLineNumbers={settings.showLineNumbers}
            windowStyle={settings.windowStyle}
            showBackground={settings.showBackground}
            backgroundColor={settings.backgroundColor}
            shadowIntensity={settings.shadowIntensity}
            fontFamily={settings.fontFamily}
            tabTitle={settings.tabTitle}
            visualEffect={settings.visualEffect}
            effectColor={settings.effectColor}
            onCodeChange={setCode}
            onTitleChange={setTabTitle}
          />
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-[280px] flex-shrink-0 space-y-4 overflow-y-auto">
        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
          <ControlPanel />
        </div>
        <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
          <ExportButtons
            status={status}
            onDownloadPng={downloadPng}
            onDownloadSvg={downloadSvg}
            onCopy={copyImage}
          />
        </div>
      </div>
    </div>
  )
}
