export type OutputFormat = 'png' | 'jpeg' | 'webp'

export type ResizeMode = 'pixels' | 'percentage'

export type BackgroundRemovalModel = 'isnet' | 'isnet_fp16' | 'isnet_quint8'

export interface ImageToolsSettings {
  // Input
  sourceImage: string | null
  sourceFileName: string | null
  originalWidth: number
  originalHeight: number

  // Output format
  outputFormat: OutputFormat
  quality: number // 0-100 for JPEG/WebP

  // Resize
  targetWidth: number
  targetHeight: number
  maintainAspectRatio: boolean
  resizeMode: ResizeMode

  // Background removal
  removeBackground: boolean
  bgRemovalModel: BackgroundRemovalModel

  // Processing state
  isProcessing: boolean
  processingStep: string | null
  processingProgress: number // 0-100
  processedImage: string | null
  error: string | null
}

export interface ImageDimensions {
  width: number
  height: number
}

export interface ProcessingResult {
  success: boolean
  image?: string
  error?: string
}
