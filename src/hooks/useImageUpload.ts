'use client'

import { useCallback } from 'react'
import {
  useSetSourceImage,
  useSetOriginalDimensions,
  useSetError,
  useClearImage,
} from '@/stores/imageToolsStore'
import {
  isValidImageFormat,
  isFileSizeValid,
  fileToBase64,
  getImageDimensions,
} from '@/utils/imageUtils'

interface UseImageUploadOptions {
  onUploadStart?: () => void
  onUploadComplete?: () => void
  onError?: (error: string) => void
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const setSourceImage = useSetSourceImage()
  const setOriginalDimensions = useSetOriginalDimensions()
  const setError = useSetError()
  const clearImage = useClearImage()

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!isValidImageFormat(file)) {
        return 'invalidFormat'
      }
      if (!isFileSizeValid(file)) {
        return 'fileTooLarge'
      }
      return null
    },
    []
  )

  const uploadFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        options.onError?.(validationError)
        return false
      }

      try {
        options.onUploadStart?.()

        const [base64, dimensions] = await Promise.all([
          fileToBase64(file),
          getImageDimensions(file),
        ])

        setSourceImage(base64, file.name)
        setOriginalDimensions(dimensions.width, dimensions.height)
        setError(null)

        options.onUploadComplete?.()
        return true
      } catch {
        const errorKey = 'processingFailed'
        setError(errorKey)
        options.onError?.(errorKey)
        return false
      }
    },
    [validateFile, setSourceImage, setOriginalDimensions, setError, options]
  )

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()

      const files = e.dataTransfer.files
      if (files.length > 0) {
        await uploadFile(files[0])
      }
    },
    [uploadFile]
  )

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        await uploadFile(files[0])
      }
      // Reset input so same file can be selected again
      e.target.value = ''
    },
    [uploadFile]
  )

  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) {
            await uploadFile(file)
            break
          }
        }
      }
    },
    [uploadFile]
  )

  return {
    uploadFile,
    handleDrop,
    handleFileSelect,
    handlePaste,
    clearImage,
    validateFile,
  }
}
