'use client'

import { memo } from 'react'
import { useTranslations } from 'next-intl'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useLanguage,
  useTheme,
  useFontFamily,
  useFontSize,
  useLineHeight,
  usePadding,
  useBorderRadius,
  useShowLineNumbers,
  useWindowStyle,
  useShowBackground,
  useBackgroundColor,
  useShadowIntensity,
  useVisualEffect,
  useEffectColor,
  useSetLanguage,
  useSetTheme,
  useSetFontFamily,
  useSetFontSize,
  useSetLineHeight,
  useSetPadding,
  useSetBorderRadius,
  useSetShowLineNumbers,
  useSetWindowStyle,
  useSetShowBackground,
  useSetBackgroundColor,
  useSetShadowIntensity,
  useSetVisualEffect,
  useSetEffectColor,
} from '@/stores/codeCanvasStore'
import { languages } from '@/utils/languages'
import { themeList } from '@/themes'
import { EFFECT_OPTIONS } from '@/styles/effects'

const fonts = [
  'JetBrains Mono',
  'Fira Code',
  'Source Code Pro',
  'IBM Plex Mono',
  'Consolas',
  'Monaco',
  'Menlo',
  'DejaVu Sans Mono',
  'Cascadia Code',
  'Hack',
  'Anonymous Pro',
  'Inconsolata',
]

const windowStyles = [
  { value: 'macos', label: 'macOS' },
  { value: 'windows', label: 'Windows' },
  { value: 'none', label: 'None' },
]

const shadowOptions = [
  { value: 'none', label: 'None' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
]

export const ControlPanel = memo(function ControlPanel() {
  const t = useTranslations('codeCanvas.controls')

  const language = useLanguage()
  const theme = useTheme()
  const fontFamily = useFontFamily()
  const fontSize = useFontSize()
  const lineHeight = useLineHeight()
  const padding = usePadding()
  const borderRadius = useBorderRadius()
  const showLineNumbers = useShowLineNumbers()
  const windowStyle = useWindowStyle()
  const showBackground = useShowBackground()
  const backgroundColor = useBackgroundColor()
  const shadowIntensity = useShadowIntensity()
  const visualEffect = useVisualEffect()
  const effectColor = useEffectColor()

  const setLanguage = useSetLanguage()
  const setTheme = useSetTheme()
  const setFontFamily = useSetFontFamily()
  const setFontSize = useSetFontSize()
  const setLineHeight = useSetLineHeight()
  const setPadding = useSetPadding()
  const setBorderRadius = useSetBorderRadius()
  const setShowLineNumbers = useSetShowLineNumbers()
  const setWindowStyle = useSetWindowStyle()
  const setShowBackground = useSetShowBackground()
  const setBackgroundColor = useSetBackgroundColor()
  const setShadowIntensity = useSetShadowIntensity()
  const setVisualEffect = useSetVisualEffect()
  const setEffectColor = useSetEffectColor()

  return (
    <div className="space-y-5">
      {/* Language */}
      <div className="space-y-2">
        <Label>{t('language')}</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.id} value={lang.id}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Theme */}
      <div className="space-y-2">
        <Label>{t('theme')}</Label>
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {themeList.map((th) => (
              <SelectItem key={th.id} value={th.id}>
                {th.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font */}
      <div className="space-y-2">
        <Label>{t('font')}</Label>
        <Select value={fontFamily} onValueChange={setFontFamily}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fonts.map((font) => (
              <SelectItem key={font} value={font}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>{t('fontSize')}</Label>
          <span className="text-xs text-[var(--muted-foreground)]">{fontSize}px</span>
        </div>
        <Slider
          value={[fontSize]}
          onValueChange={([v]) => setFontSize(v)}
          min={10}
          max={24}
          step={1}
        />
      </div>

      {/* Line Height */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>{t('lineHeight')}</Label>
          <span className="text-xs text-[var(--muted-foreground)]">{lineHeight}</span>
        </div>
        <Slider
          value={[lineHeight]}
          onValueChange={([v]) => setLineHeight(v)}
          min={1}
          max={2.5}
          step={0.1}
        />
      </div>

      {/* Padding */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>{t('padding')}</Label>
          <span className="text-xs text-[var(--muted-foreground)]">{padding}px</span>
        </div>
        <Slider
          value={[padding]}
          onValueChange={([v]) => setPadding(v)}
          min={8}
          max={64}
          step={4}
        />
      </div>

      {/* Border Radius */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>{t('borderRadius')}</Label>
          <span className="text-xs text-[var(--muted-foreground)]">{borderRadius}px</span>
        </div>
        <Slider
          value={[borderRadius]}
          onValueChange={([v]) => setBorderRadius(v)}
          min={0}
          max={32}
          step={2}
        />
      </div>

      {/* Line Numbers */}
      <div className="flex items-center justify-between">
        <Label>{t('lineNumbers')}</Label>
        <Switch checked={showLineNumbers} onCheckedChange={setShowLineNumbers} />
      </div>

      {/* Window Style */}
      <div className="space-y-2">
        <Label>{t('windowStyle')}</Label>
        <Select value={windowStyle} onValueChange={(v) => setWindowStyle(v as typeof windowStyle)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {windowStyles.map((ws) => (
              <SelectItem key={ws.value} value={ws.value}>
                {ws.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Show Background */}
      <div className="flex items-center justify-between">
        <Label>{t('showBackground')}</Label>
        <Switch checked={showBackground} onCheckedChange={setShowBackground} />
      </div>

      {showBackground && (
        <>
          {/* Background Color */}
          <div className="space-y-2">
            <Label>{t('backgroundColor')}</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>

          {/* Shadow */}
          <div className="space-y-2">
            <Label>{t('shadow')}</Label>
            <Select
              value={shadowIntensity}
              onValueChange={(v) => setShadowIntensity(v as typeof shadowIntensity)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {shadowOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Visual Effect */}
          <div className="space-y-2">
            <Label>{t('visualEffect')}</Label>
            <Select
              value={visualEffect}
              onValueChange={(v) => setVisualEffect(v as typeof visualEffect)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EFFECT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {visualEffect !== 'none' && (
            <div className="space-y-2">
              <Label>{t('effectColor')}</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={effectColor || EFFECT_OPTIONS.find((o) => o.value === visualEffect)?.color || '#ffffff'}
                  onChange={(e) => setEffectColor(e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={effectColor}
                  onChange={(e) => setEffectColor(e.target.value)}
                  placeholder="Use default"
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
})
