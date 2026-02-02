import type { OutputFormat } from '@/types/imageTools'

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

export function isValidImageFormat(file: File): boolean {
  return SUPPORTED_FORMATS.includes(file.type)
}

export function isFileSizeValid(file: File): boolean {
  return file.size <= MAX_FILE_SIZE
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function getMimeType(format: OutputFormat): string {
  const mimeTypes: Record<OutputFormat, string> = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
  }
  return mimeTypes[format]
}

export function getFileExtension(format: OutputFormat): string {
  return format === 'jpeg' ? 'jpg' : format
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function base64ToBlob(base64: string): Promise<Blob> {
  const response = await fetch(base64)
  return response.blob()
}

export async function convertFormat(
  imageSource: string | HTMLImageElement,
  format: OutputFormat,
  quality: number = 90
): Promise<string> {
  const img = typeof imageSource === 'string' ? await loadImage(imageSource) : imageSource

  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth || img.width
  canvas.height = img.naturalHeight || img.height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  // For PNG, ensure transparency is preserved
  if (format !== 'png') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  ctx.drawImage(img, 0, 0)

  const mimeType = getMimeType(format)
  const qualityValue = format === 'png' ? undefined : quality / 100

  return canvas.toDataURL(mimeType, qualityValue)
}

export async function downloadImage(
  dataUrl: string,
  filename: string,
  format: OutputFormat
): Promise<void> {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = `${filename}.${getFileExtension(format)}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export async function copyImageToClipboard(dataUrl: string): Promise<void> {
  const blob = await base64ToBlob(dataUrl)

  // Always convert to PNG for clipboard (best compatibility)
  if (!blob.type.includes('png')) {
    const img = await loadImage(dataUrl)
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')
    ctx.drawImage(img, 0, 0)

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Failed to create blob'))),
        'image/png'
      )
    })

    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': pngBlob }),
    ])
  } else {
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ])
  }
}

export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.width, height: img.height })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

export function calculateAspectRatioDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight

  if (targetWidth && !targetHeight) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio),
    }
  }

  if (targetHeight && !targetWidth) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight,
    }
  }

  if (targetWidth && targetHeight) {
    return { width: targetWidth, height: targetHeight }
  }

  return { width: originalWidth, height: originalHeight }
}
