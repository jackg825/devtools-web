'use client'

import { forwardRef, memo, useMemo } from 'react'
import { WindowChrome } from './WindowChrome'
import { CodeDisplay } from './CodeDisplay'
import { useShiki } from '@/hooks/useShiki'
import { getTheme } from '@/themes'
import { getEffectClassName, getEffectCSSVars } from '@/styles/effects'
import type { WindowStyle, ShadowIntensity, VisualEffect } from '@/types/settings'

interface TerminalPreviewProps {
  code: string
  language: string
  themeId: string
  fontSize: number
  lineHeight: number
  padding: number
  borderRadius: number
  showLineNumbers: boolean
  windowStyle: WindowStyle
  showBackground: boolean
  backgroundColor: string
  shadowIntensity: ShadowIntensity
  fontFamily: string
  tabTitle: string
  visualEffect: VisualEffect
  effectColor: string
  onCodeChange?: (code: string) => void
  onTitleChange?: (title: string) => void
}

const shadowStyles: Record<ShadowIntensity, string> = {
  none: 'none',
  light: '0 4px 12px rgba(0, 0, 0, 0.15)',
  medium: '0 8px 30px rgba(0, 0, 0, 0.3)',
  heavy: '0 20px 60px rgba(0, 0, 0, 0.5)',
}

export const TerminalPreview = memo(
  forwardRef<HTMLDivElement, TerminalPreviewProps>(function TerminalPreview(props, ref) {
    const {
      code,
      language,
      themeId,
      fontSize,
      lineHeight,
      padding,
      borderRadius,
      showLineNumbers,
      windowStyle,
      showBackground,
      backgroundColor,
      shadowIntensity,
      fontFamily,
      tabTitle,
      visualEffect,
      effectColor,
      onCodeChange,
      onTitleChange,
    } = props

    const theme = getTheme(themeId)
    const { highlightedCode, isLoading } = useShiki(code, language, themeId)

    const effectClass = useMemo(() => getEffectClassName(visualEffect), [visualEffect])
    const effectVars = useMemo(
      () => getEffectCSSVars(visualEffect, effectColor),
      [visualEffect, effectColor]
    )

    const previewStyle = useMemo(
      () => ({
        display: 'inline-block' as const,
        padding: showBackground ? '48px' : '0',
        backgroundColor: showBackground ? backgroundColor : 'transparent',
        borderRadius: showBackground ? borderRadius + 16 : 0,
      }),
      [showBackground, backgroundColor, borderRadius]
    )

    const windowStyleObj = useMemo(
      () => ({
        borderRadius: `${borderRadius}px`,
        overflow: 'hidden' as const,
        boxShadow: visualEffect === 'none' ? shadowStyles[shadowIntensity] : undefined,
        backgroundColor: theme.colors.background,
        position: 'relative' as const,
        ...effectVars,
      }),
      [borderRadius, visualEffect, shadowIntensity, theme.colors.background, effectVars]
    )

    return (
      <div ref={ref} className="terminal-preview" style={previewStyle}>
        <div className={`terminal-window ${effectClass}`.trim()} style={windowStyleObj}>
          <WindowChrome
            style={windowStyle}
            title={tabTitle}
            theme={theme}
            onTitleChange={onTitleChange}
          />
          <CodeDisplay
            highlightedCode={highlightedCode}
            code={code}
            fontSize={fontSize}
            lineHeight={lineHeight}
            fontFamily={fontFamily}
            showLineNumbers={showLineNumbers}
            padding={padding}
            theme={theme}
            isLoading={isLoading}
            onCodeChange={onCodeChange}
          />
        </div>
      </div>
    )
  })
)
