import type { VisualEffect } from '@/types/settings'

export interface EffectPreset {
  color: string
  label: string
  description: string
}

export const EFFECT_PRESETS: Record<VisualEffect, EffectPreset> = {
  none: {
    color: '',
    label: 'None',
    description: 'No visual effect',
  },
  neon: {
    color: '#5FAFAF',
    label: 'Neon Glow',
    description: 'Morandi teal cyberpunk glow',
  },
  holographic: {
    color: '#A8927F',
    label: 'Holographic',
    description: 'Warm morandi shimmer border',
  },
  scanlines: {
    color: '#7FA897',
    label: 'Scanlines',
    description: 'Retro CRT effect',
  },
  cyberpunk: {
    color: '#4A9A9A',
    label: 'Cyberpunk',
    description: 'Teal borders with corner accents',
  },
  matrix: {
    color: '#6B8B7A',
    label: 'Matrix',
    description: 'Morandi sage digital aesthetic',
  },
  frosted: {
    color: '#E4E6EB',
    label: 'Frosted',
    description: 'Soft cold-gray glass glow',
  },
}

export const EFFECT_OPTIONS = Object.entries(EFFECT_PRESETS).map(([value, preset]) => ({
  value: value as VisualEffect,
  label: preset.label,
  color: preset.color,
  description: preset.description,
}))

export function getEffectColor(effect: VisualEffect, customColor: string): string {
  if (effect === 'none') return ''
  return customColor || EFFECT_PRESETS[effect].color
}

export function getEffectCSSVars(effect: VisualEffect, customColor: string): React.CSSProperties {
  const color = getEffectColor(effect, customColor)
  if (!color) return {}

  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return {
    '--effect-color': color,
    '--effect-color-rgb': `${r}, ${g}, ${b}`,
    '--effect-color-20': `rgba(${r}, ${g}, ${b}, 0.2)`,
    '--effect-color-40': `rgba(${r}, ${g}, ${b}, 0.4)`,
    '--effect-color-60': `rgba(${r}, ${g}, ${b}, 0.6)`,
  } as React.CSSProperties
}

export function getEffectClassName(effect: VisualEffect): string {
  if (effect === 'none') return ''
  return `effect-${effect}`
}
