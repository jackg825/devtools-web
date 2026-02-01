'use client'

import { memo, useMemo } from 'react'
import type { WindowStyle } from '@/types/settings'
import type { TerminalTheme } from '@/types/theme'

interface WindowChromeProps {
  style: WindowStyle
  title: string
  theme: TerminalTheme
  onTitleChange?: (title: string) => void
}

const macButtonColors = ['#FF5F56', '#FFBD2E', '#27C93F'] as const

const MacOSButtons = memo(function MacOSButtons() {
  return (
    <div className="macos-buttons" style={{ display: 'flex', gap: '8px' }}>
      {macButtonColors.map((color) => (
        <div
          key={color}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  )
})

const WindowsButtons = memo(function WindowsButtons() {
  const buttonStyle = {
    width: '20px',
    height: '20px',
    borderRadius: '2px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const

  const iconColor = { color: 'rgba(255,255,255,0.5)' }

  return (
    <div className="windows-buttons" style={{ display: 'flex', gap: '4px' }}>
      <div style={buttonStyle}>
        <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor" style={iconColor}>
          <rect width="10" height="1" />
        </svg>
      </div>
      <div style={buttonStyle}>
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          style={iconColor}
        >
          <rect x="0.5" y="0.5" width="7" height="7" />
        </svg>
      </div>
      <div style={buttonStyle}>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={iconColor}
        >
          <line x1="2" y1="2" x2="8" y2="8" />
          <line x1="8" y1="2" x2="2" y2="8" />
        </svg>
      </div>
    </div>
  )
})

export const WindowChrome = memo(function WindowChrome({
  style,
  title,
  theme,
  onTitleChange,
}: WindowChromeProps) {
  const containerStyle = useMemo(
    () => ({
      display: 'flex',
      alignItems: 'center',
      height: '40px',
      padding: '0 16px',
      backgroundColor: theme.colors.titleBar,
      borderTopLeftRadius: 'inherit',
      borderTopRightRadius: 'inherit',
      userSelect: 'none' as const,
    }),
    [theme.colors.titleBar]
  )

  const titleInputStyle = useMemo(
    () => ({
      flex: 1,
      textAlign: 'center' as const,
      fontSize: '13px',
      color: theme.colors.foreground,
      opacity: 0.6,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      padding: 0,
      margin: 0,
      minWidth: 0,
    }),
    [theme.colors.foreground]
  )

  const titleSpanStyle = useMemo(
    () => ({
      flex: 1,
      textAlign: 'center' as const,
      fontSize: '13px',
      color: theme.colors.foreground,
      opacity: 0.6,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
    [theme.colors.foreground]
  )

  if (style === 'none') return null

  return (
    <div className="window-chrome" style={containerStyle}>
      {style === 'macos' && <MacOSButtons />}
      {style === 'windows' && <WindowsButtons />}
      {onTitleChange ? (
        <input
          type="text"
          className="window-title-input"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          style={titleInputStyle}
          placeholder="untitled"
        />
      ) : (
        <span className="window-title" style={titleSpanStyle}>
          {title}
        </span>
      )}
      <div style={{ width: style === 'macos' ? 52 : 68 }} />
    </div>
  )
})
