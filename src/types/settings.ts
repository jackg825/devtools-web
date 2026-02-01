export type WindowStyle = 'macos' | 'windows' | 'none'
export type ShadowIntensity = 'none' | 'light' | 'medium' | 'heavy'
export type ExportScale = 1 | 2 | 3
export type VisualEffect = 'none' | 'neon' | 'holographic' | 'scanlines' | 'cyberpunk' | 'matrix' | 'frosted'

export interface CodeCanvasSettings {
  code: string
  language: string
  theme: string
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
}

export const DEFAULT_CODE = `// Welcome to Code Canvas
// Transform your code into beautiful images

function greet(name: string) {
  console.log(\`Hello, \${name}!\`)
}

greet('World')`
