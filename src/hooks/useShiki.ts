'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createHighlighter, type Highlighter, type BundledTheme } from 'shiki'
import { getTheme } from '@/themes'
import { detectLanguage } from '@/utils/languages'

const PRELOAD_LANGUAGES = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'python',
  'go',
  'java',
  'rust',
  'bash',
  'shell',
  'json',
  'html',
  'css',
  'sql',
  'markdown',
  'yaml',
  'dockerfile',
  'c',
  'cpp',
  'csharp',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'elixir',
  'haskell',
  'scala',
  'lua',
  'r',
]

const AVAILABLE_THEMES: BundledTheme[] = [
  'andromeeda',
  'ayu-dark',
  'catppuccin-mocha',
  'dark-plus',
  'dracula',
  'dracula-soft',
  'everforest-dark',
  'github-dark',
  'github-light',
  'houston',
  'material-theme-ocean',
  'min-dark',
  'monokai',
  'night-owl',
  'nord',
  'one-dark-pro',
  'rose-pine',
  'solarized-dark',
  'tokyo-night',
  'vitesse-dark',
]

interface UseShikiResult {
  highlightedCode: string
  isLoading: boolean
  error: Error | null
  highlight: (code: string, language: string, themeId: string) => Promise<string>
}

export function useShiki(
  code: string,
  language: string,
  themeId: string
): UseShikiResult {
  const [highlightedCode, setHighlightedCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const highlighterRef = useRef<Highlighter | null>(null)
  const initPromiseRef = useRef<Promise<Highlighter> | null>(null)

  const getHighlighter = useCallback(async (): Promise<Highlighter> => {
    if (highlighterRef.current) {
      return highlighterRef.current
    }

    if (initPromiseRef.current) {
      return initPromiseRef.current
    }

    initPromiseRef.current = createHighlighter({
      themes: AVAILABLE_THEMES,
      langs: PRELOAD_LANGUAGES,
    })

    highlighterRef.current = await initPromiseRef.current
    return highlighterRef.current
  }, [])

  const highlight = useCallback(
    async (codeToHighlight: string, lang: string, theme: string): Promise<string> => {
      try {
        const highlighter = await getHighlighter()
        const terminalTheme = getTheme(theme)

        let effectiveLang = lang
        if (lang === 'auto') {
          effectiveLang = detectLanguage(codeToHighlight)
        }

        const loadedLangs = highlighter.getLoadedLanguages()
        if (!loadedLangs.includes(effectiveLang as never)) {
          try {
            await highlighter.loadLanguage(effectiveLang as never)
          } catch {
            effectiveLang = 'plaintext'
          }
        }

        const html = highlighter.codeToHtml(codeToHighlight, {
          lang: effectiveLang,
          theme: terminalTheme.shikiTheme as BundledTheme,
        })

        return html
      } catch (err) {
        console.error('Highlighting error:', err)
        throw err
      }
    },
    [getHighlighter]
  )

  useEffect(() => {
    let cancelled = false

    const doHighlight = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const html = await highlight(code, language, themeId)
        if (!cancelled) {
          setHighlightedCode(html)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to highlight'))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    doHighlight()

    return () => {
      cancelled = true
    }
  }, [code, language, themeId, highlight])

  return {
    highlightedCode,
    isLoading,
    error,
    highlight,
  }
}
