'use client'

import { memo, useMemo, useRef, useEffect } from 'react'
import DOMPurify from 'dompurify'
import type { TerminalTheme } from '@/types/theme'

interface CodeDisplayProps {
  highlightedCode: string
  code: string
  fontSize: number
  lineHeight: number
  fontFamily: string
  showLineNumbers: boolean
  padding: number
  theme: TerminalTheme
  isLoading: boolean
  onCodeChange?: (code: string) => void
}

export const CodeDisplay = memo(function CodeDisplay({
  highlightedCode,
  code,
  fontSize,
  lineHeight,
  fontFamily,
  showLineNumbers,
  padding,
  theme,
  isLoading,
  onCodeChange,
}: CodeDisplayProps) {
  const lineCount = useMemo(() => code.split('\n').length, [code])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const codeContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    const codeContent = codeContentRef.current
    if (!textarea || !codeContent) return

    const handleScroll = () => {
      codeContent.scrollTop = textarea.scrollTop
      codeContent.scrollLeft = textarea.scrollLeft
    }

    textarea.addEventListener('scroll', handleScroll, { passive: true })
    return () => textarea.removeEventListener('scroll', handleScroll)
  }, [])

  // Sanitize HTML from Shiki using DOMPurify to prevent XSS
  const sanitizedHtml = useMemo(() => {
    if (typeof window === 'undefined') return highlightedCode
    return DOMPurify.sanitize(highlightedCode, {
      ALLOWED_TAGS: ['pre', 'code', 'span'],
      ALLOWED_ATTR: ['class', 'style'],
    })
  }, [highlightedCode])

  const containerStyle = useMemo(
    () => ({
      position: 'relative' as const,
      padding: `${padding}px`,
      backgroundColor: theme.colors.background,
      fontFamily: `"${fontFamily}", "Fira Code", "Monaco", "Consolas", monospace`,
      fontSize: `${fontSize}px`,
      lineHeight: lineHeight,
      overflow: 'hidden' as const,
    }),
    [padding, theme.colors.background, fontFamily, fontSize, lineHeight]
  )

  const loadingStyle = useMemo(
    () => ({
      position: 'absolute' as const,
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
      color: theme.colors.foreground,
      opacity: 0.5,
    }),
    [theme.colors.background, theme.colors.foreground]
  )

  const textareaStyle = useMemo(
    () => ({
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      padding: 0,
      margin: 0,
      border: 'none',
      outline: 'none',
      resize: 'none' as const,
      background: 'transparent',
      color: 'transparent',
      caretColor: theme.colors.cursor,
      fontFamily: `"${fontFamily}", "Fira Code", "Monaco", "Consolas", monospace`,
      fontSize: `${fontSize}px`,
      lineHeight: lineHeight,
      whiteSpace: 'pre' as const,
      overflow: 'auto' as const,
    }),
    [theme.colors.cursor, fontFamily, fontSize, lineHeight]
  )

  return (
    <div className="code-display" style={containerStyle}>
      {isLoading && <div style={loadingStyle}>Loading...</div>}
      <div
        style={{
          display: 'flex',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.15s ease',
        }}
      >
        {showLineNumbers && (
          <LineNumbers
            count={lineCount}
            fontSize={fontSize}
            lineHeight={lineHeight}
            color={theme.colors.brightBlack}
          />
        )}
        <div
          className="code-editor-wrapper"
          style={{
            position: 'relative',
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Highlighted code (background) - sanitized with DOMPurify for XSS prevention */}
          <div
            ref={codeContentRef}
            className="code-content"
            style={{
              overflow: 'auto',
              pointerEvents: 'none',
            }}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />

          {onCodeChange && (
            <textarea
              ref={textareaRef}
              className="code-editor-overlay"
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              style={textareaStyle}
            />
          )}
        </div>
      </div>
    </div>
  )
})

interface LineNumbersProps {
  count: number
  fontSize: number
  lineHeight: number
  color: string
}

const LineNumbers = memo(function LineNumbers({
  count,
  fontSize,
  lineHeight,
  color,
}: LineNumbersProps) {
  const numbers = useMemo(() => Array.from({ length: count }, (_, i) => i + 1), [count])

  const style = useMemo(
    () => ({
      paddingRight: '16px',
      marginRight: '16px',
      borderRight: `1px solid ${color}33`,
      textAlign: 'right' as const,
      color: color,
      userSelect: 'none' as const,
      fontSize: `${fontSize}px`,
      lineHeight: lineHeight,
    }),
    [color, fontSize, lineHeight]
  )

  return (
    <div className="line-numbers" style={style}>
      {numbers.map((n) => (
        <div key={n}>{n}</div>
      ))}
    </div>
  )
})
