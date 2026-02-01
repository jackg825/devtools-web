import type { ExportScale } from '@/types/settings'

export interface ExportOptions {
  scale?: ExportScale
  quality?: number
  backgroundColor?: string
}

const defaultOptions: ExportOptions = {
  scale: 2,
  quality: 1,
}

let htmlToImageModule: typeof import('html-to-image') | null = null

async function getHtmlToImage() {
  if (!htmlToImageModule) {
    htmlToImageModule = await import('html-to-image')
  }
  return htmlToImageModule
}

export async function exportToPng(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<string> {
  const { scale = 2, quality = 1, backgroundColor } = { ...defaultOptions, ...options }

  element.classList.add('exporting')

  try {
    const { toPng } = await getHtmlToImage()
    const dataUrl = await toPng(element, {
      pixelRatio: scale,
      quality,
      backgroundColor,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
    })

    return dataUrl
  } finally {
    element.classList.remove('exporting')
  }
}

export async function exportToSvg(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<string> {
  const { backgroundColor } = { ...defaultOptions, ...options }

  element.classList.add('exporting')

  try {
    const { toSvg } = await getHtmlToImage()
    const dataUrl = await toSvg(element, {
      backgroundColor,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
    })

    return dataUrl
  } finally {
    element.classList.remove('exporting')
  }
}

export async function exportToBlob(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<Blob | null> {
  const { scale = 2, quality = 1, backgroundColor } = { ...defaultOptions, ...options }

  element.classList.add('exporting')

  try {
    const { toBlob } = await getHtmlToImage()
    const blob = await toBlob(element, {
      pixelRatio: scale,
      quality,
      backgroundColor,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
    })

    return blob
  } finally {
    element.classList.remove('exporting')
  }
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}

export async function copyToClipboard(element: HTMLElement, options: ExportOptions = {}): Promise<boolean> {
  try {
    const blob = await exportToBlob(element, options)
    if (!blob) return false

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ])
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}
