'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/shallow'
import type { CodeCanvasSettings, WindowStyle, ShadowIntensity, VisualEffect } from '@/types/settings'
import { DEFAULT_CODE } from '@/types/settings'

interface CodeCanvasStore extends CodeCanvasSettings {
  setCode: (code: string) => void
  setLanguage: (language: string) => void
  setTheme: (theme: string) => void
  setFontSize: (size: number) => void
  setLineHeight: (height: number) => void
  setPadding: (padding: number) => void
  setBorderRadius: (radius: number) => void
  setShowLineNumbers: (show: boolean) => void
  setWindowStyle: (style: WindowStyle) => void
  setShowBackground: (show: boolean) => void
  setBackgroundColor: (color: string) => void
  setShadowIntensity: (intensity: ShadowIntensity) => void
  setFontFamily: (font: string) => void
  setTabTitle: (title: string) => void
  setVisualEffect: (effect: VisualEffect) => void
  setEffectColor: (color: string) => void
  reset: () => void
}

const defaultSettings: CodeCanvasSettings = {
  code: DEFAULT_CODE,
  language: 'typescript',
  theme: 'dracula',
  fontSize: 14,
  lineHeight: 1.5,
  padding: 32,
  borderRadius: 12,
  showLineNumbers: false,
  windowStyle: 'macos',
  showBackground: true,
  backgroundColor: '#1a1a2e',
  shadowIntensity: 'medium',
  fontFamily: 'JetBrains Mono',
  tabTitle: 'terminal',
  visualEffect: 'none',
  effectColor: '',
}

export const useCodeCanvasStore = create<CodeCanvasStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setCode: (code) => set({ code }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setLineHeight: (lineHeight) => set({ lineHeight }),
      setPadding: (padding) => set({ padding }),
      setBorderRadius: (borderRadius) => set({ borderRadius }),
      setShowLineNumbers: (showLineNumbers) => set({ showLineNumbers }),
      setWindowStyle: (windowStyle) => set({ windowStyle }),
      setShowBackground: (showBackground) => set({ showBackground }),
      setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
      setShadowIntensity: (shadowIntensity) => set({ shadowIntensity }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setTabTitle: (tabTitle) => set({ tabTitle }),
      setVisualEffect: (visualEffect) => set({ visualEffect }),
      setEffectColor: (effectColor) => set({ effectColor }),
      reset: () => set(defaultSettings),
    }),
    {
      name: 'devtools-code-canvas',
      skipHydration: true,
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        fontSize: state.fontSize,
        lineHeight: state.lineHeight,
        padding: state.padding,
        borderRadius: state.borderRadius,
        showLineNumbers: state.showLineNumbers,
        windowStyle: state.windowStyle,
        showBackground: state.showBackground,
        backgroundColor: state.backgroundColor,
        shadowIntensity: state.shadowIntensity,
        fontFamily: state.fontFamily,
        visualEffect: state.visualEffect,
        effectColor: state.effectColor,
      }),
    }
  )
)

// Atomic Selectors
export const useCode = () => useCodeCanvasStore((s) => s.code)
export const useLanguage = () => useCodeCanvasStore((s) => s.language)
export const useTheme = () => useCodeCanvasStore((s) => s.theme)
export const useFontSize = () => useCodeCanvasStore((s) => s.fontSize)
export const useLineHeight = () => useCodeCanvasStore((s) => s.lineHeight)
export const usePadding = () => useCodeCanvasStore((s) => s.padding)
export const useBorderRadius = () => useCodeCanvasStore((s) => s.borderRadius)
export const useShowLineNumbers = () => useCodeCanvasStore((s) => s.showLineNumbers)
export const useWindowStyle = () => useCodeCanvasStore((s) => s.windowStyle)
export const useShowBackground = () => useCodeCanvasStore((s) => s.showBackground)
export const useBackgroundColor = () => useCodeCanvasStore((s) => s.backgroundColor)
export const useShadowIntensity = () => useCodeCanvasStore((s) => s.shadowIntensity)
export const useFontFamily = () => useCodeCanvasStore((s) => s.fontFamily)
export const useTabTitle = () => useCodeCanvasStore((s) => s.tabTitle)
export const useVisualEffect = () => useCodeCanvasStore((s) => s.visualEffect)
export const useEffectColor = () => useCodeCanvasStore((s) => s.effectColor)

// Action Selectors
export const useSetCode = () => useCodeCanvasStore((s) => s.setCode)
export const useSetLanguage = () => useCodeCanvasStore((s) => s.setLanguage)
export const useSetTheme = () => useCodeCanvasStore((s) => s.setTheme)
export const useSetFontSize = () => useCodeCanvasStore((s) => s.setFontSize)
export const useSetLineHeight = () => useCodeCanvasStore((s) => s.setLineHeight)
export const useSetPadding = () => useCodeCanvasStore((s) => s.setPadding)
export const useSetBorderRadius = () => useCodeCanvasStore((s) => s.setBorderRadius)
export const useSetShowLineNumbers = () => useCodeCanvasStore((s) => s.setShowLineNumbers)
export const useSetWindowStyle = () => useCodeCanvasStore((s) => s.setWindowStyle)
export const useSetShowBackground = () => useCodeCanvasStore((s) => s.setShowBackground)
export const useSetBackgroundColor = () => useCodeCanvasStore((s) => s.setBackgroundColor)
export const useSetShadowIntensity = () => useCodeCanvasStore((s) => s.setShadowIntensity)
export const useSetFontFamily = () => useCodeCanvasStore((s) => s.setFontFamily)
export const useSetTabTitle = () => useCodeCanvasStore((s) => s.setTabTitle)
export const useSetVisualEffect = () => useCodeCanvasStore((s) => s.setVisualEffect)
export const useSetEffectColor = () => useCodeCanvasStore((s) => s.setEffectColor)

// Grouped Selectors
export const usePreviewSettings = () =>
  useCodeCanvasStore(
    useShallow((s) => ({
      code: s.code,
      language: s.language,
      theme: s.theme,
      fontSize: s.fontSize,
      lineHeight: s.lineHeight,
      padding: s.padding,
      borderRadius: s.borderRadius,
      showLineNumbers: s.showLineNumbers,
      windowStyle: s.windowStyle,
      showBackground: s.showBackground,
      backgroundColor: s.backgroundColor,
      shadowIntensity: s.shadowIntensity,
      fontFamily: s.fontFamily,
      tabTitle: s.tabTitle,
      visualEffect: s.visualEffect,
      effectColor: s.effectColor,
    }))
  )

export const usePreviewActions = () =>
  useCodeCanvasStore(
    useShallow((s) => ({
      setCode: s.setCode,
      setTabTitle: s.setTabTitle,
    }))
  )
