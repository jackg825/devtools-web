'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/shallow'
import type {
  QRSettings,
  QRType,
  DotStyle,
  CornerSquareStyle,
  CornerDotStyle,
  ErrorCorrectionLevel,
  LogoMode,
  SocialIcon,
} from '@/types/qr'

interface QRGeneratorStore extends QRSettings {
  setType: (type: QRType) => void
  setData: (data: string) => void
  setSize: (size: number) => void
  setColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  setTransparentBackground: (transparent: boolean) => void
  setVersion: (version: number) => void
  setErrorCorrectionLevel: (level: ErrorCorrectionLevel) => void
  setMargin: (margin: number) => void
  setDotStyle: (style: DotStyle) => void
  setCornerSquareStyle: (style: CornerSquareStyle) => void
  setCornerSquareColor: (color: string) => void
  setCornerDotStyle: (style: CornerDotStyle) => void
  setCornerDotColor: (color: string) => void
  setLogoMode: (mode: LogoMode) => void
  setLogoImage: (image: string) => void
  setLogoSize: (size: number) => void
  setSelectedSocialIcon: (icon: SocialIcon | null) => void
  reset: () => void
}

const defaultSettings: QRSettings = {
  type: 'url',
  data: 'https://example.com',
  size: 300,
  color: '#000000',
  backgroundColor: '#ffffff',
  transparentBackground: false,
  version: 0, // auto
  errorCorrectionLevel: 'M',
  margin: 10,
  dotStyle: 'square',
  cornerSquareStyle: 'square',
  cornerSquareColor: '#000000',
  cornerDotStyle: 'square',
  cornerDotColor: '#000000',
  logoMode: 'none',
  logoImage: '',
  logoSize: 20,
  selectedSocialIcon: null,
}

export const useQRGeneratorStore = create<QRGeneratorStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setType: (type) => set({ type, data: '' }),
      setData: (data) => set({ data }),
      setSize: (size) => set({ size }),
      setColor: (color) => set({ color }),
      setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
      setTransparentBackground: (transparentBackground) => set({ transparentBackground }),
      setVersion: (version) => set({ version }),
      setErrorCorrectionLevel: (errorCorrectionLevel) => set({ errorCorrectionLevel }),
      setMargin: (margin) => set({ margin }),
      setDotStyle: (dotStyle) => set({ dotStyle }),
      setCornerSquareStyle: (cornerSquareStyle) => set({ cornerSquareStyle }),
      setCornerSquareColor: (cornerSquareColor) => set({ cornerSquareColor }),
      setCornerDotStyle: (cornerDotStyle) => set({ cornerDotStyle }),
      setCornerDotColor: (cornerDotColor) => set({ cornerDotColor }),
      setLogoMode: (logoMode) => set({ logoMode, logoImage: '', selectedSocialIcon: null }),
      setLogoImage: (logoImage) => set({ logoImage }),
      setLogoSize: (logoSize) => set({ logoSize }),
      setSelectedSocialIcon: (selectedSocialIcon) => set({ selectedSocialIcon }),
      reset: () => set(defaultSettings),
    }),
    {
      name: 'devtools-qr-generator',
      skipHydration: true,
      partialize: (state) => ({
        size: state.size,
        color: state.color,
        backgroundColor: state.backgroundColor,
        transparentBackground: state.transparentBackground,
        errorCorrectionLevel: state.errorCorrectionLevel,
        margin: state.margin,
        dotStyle: state.dotStyle,
        cornerSquareStyle: state.cornerSquareStyle,
        cornerSquareColor: state.cornerSquareColor,
        cornerDotStyle: state.cornerDotStyle,
        cornerDotColor: state.cornerDotColor,
        logoSize: state.logoSize,
      }),
    }
  )
)

// Atomic Selectors
export const useQRType = () => useQRGeneratorStore((s) => s.type)
export const useQRData = () => useQRGeneratorStore((s) => s.data)
export const useQRSize = () => useQRGeneratorStore((s) => s.size)
export const useQRColor = () => useQRGeneratorStore((s) => s.color)
export const useQRBackgroundColor = () => useQRGeneratorStore((s) => s.backgroundColor)
export const useQRTransparentBackground = () => useQRGeneratorStore((s) => s.transparentBackground)
export const useQRVersion = () => useQRGeneratorStore((s) => s.version)
export const useQRErrorCorrectionLevel = () => useQRGeneratorStore((s) => s.errorCorrectionLevel)
export const useQRMargin = () => useQRGeneratorStore((s) => s.margin)
export const useQRDotStyle = () => useQRGeneratorStore((s) => s.dotStyle)
export const useQRCornerSquareStyle = () => useQRGeneratorStore((s) => s.cornerSquareStyle)
export const useQRCornerSquareColor = () => useQRGeneratorStore((s) => s.cornerSquareColor)
export const useQRCornerDotStyle = () => useQRGeneratorStore((s) => s.cornerDotStyle)
export const useQRCornerDotColor = () => useQRGeneratorStore((s) => s.cornerDotColor)
export const useQRLogoMode = () => useQRGeneratorStore((s) => s.logoMode)
export const useQRLogoImage = () => useQRGeneratorStore((s) => s.logoImage)
export const useQRLogoSize = () => useQRGeneratorStore((s) => s.logoSize)
export const useQRSelectedSocialIcon = () => useQRGeneratorStore((s) => s.selectedSocialIcon)

// Action Selectors
export const useSetQRType = () => useQRGeneratorStore((s) => s.setType)
export const useSetQRData = () => useQRGeneratorStore((s) => s.setData)
export const useSetQRSize = () => useQRGeneratorStore((s) => s.setSize)
export const useSetQRColor = () => useQRGeneratorStore((s) => s.setColor)
export const useSetQRBackgroundColor = () => useQRGeneratorStore((s) => s.setBackgroundColor)
export const useSetQRTransparentBackground = () => useQRGeneratorStore((s) => s.setTransparentBackground)
export const useSetQRVersion = () => useQRGeneratorStore((s) => s.setVersion)
export const useSetQRErrorCorrectionLevel = () => useQRGeneratorStore((s) => s.setErrorCorrectionLevel)
export const useSetQRMargin = () => useQRGeneratorStore((s) => s.setMargin)
export const useSetQRDotStyle = () => useQRGeneratorStore((s) => s.setDotStyle)
export const useSetQRCornerSquareStyle = () => useQRGeneratorStore((s) => s.setCornerSquareStyle)
export const useSetQRCornerSquareColor = () => useQRGeneratorStore((s) => s.setCornerSquareColor)
export const useSetQRCornerDotStyle = () => useQRGeneratorStore((s) => s.setCornerDotStyle)
export const useSetQRCornerDotColor = () => useQRGeneratorStore((s) => s.setCornerDotColor)
export const useSetQRLogoMode = () => useQRGeneratorStore((s) => s.setLogoMode)
export const useSetQRLogoImage = () => useQRGeneratorStore((s) => s.setLogoImage)
export const useSetQRLogoSize = () => useQRGeneratorStore((s) => s.setLogoSize)
export const useSetQRSelectedSocialIcon = () => useQRGeneratorStore((s) => s.setSelectedSocialIcon)

// Grouped Selectors
export const useQRPreviewSettings = () =>
  useQRGeneratorStore(
    useShallow((s) => ({
      data: s.data,
      size: s.size,
      color: s.color,
      backgroundColor: s.backgroundColor,
      transparentBackground: s.transparentBackground,
      version: s.version,
      errorCorrectionLevel: s.errorCorrectionLevel,
      margin: s.margin,
      dotStyle: s.dotStyle,
      cornerSquareStyle: s.cornerSquareStyle,
      cornerSquareColor: s.cornerSquareColor,
      cornerDotStyle: s.cornerDotStyle,
      cornerDotColor: s.cornerDotColor,
      logoMode: s.logoMode,
      logoImage: s.logoImage,
      logoSize: s.logoSize,
      selectedSocialIcon: s.selectedSocialIcon,
    }))
  )
