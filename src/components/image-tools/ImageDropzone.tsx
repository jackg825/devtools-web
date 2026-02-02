'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Upload, X, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useImageUpload } from '@/hooks/useImageUpload'
import { useSourceImage, useSourceFileName } from '@/stores/imageToolsStore'

export function ImageDropzone() {
  const t = useTranslations('imageTools')
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const sourceImage = useSourceImage()
  const sourceFileName = useSourceFileName()

  const { handleDrop, handleFileSelect, handlePaste, clearImage } = useImageUpload()

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      setIsDragging(false)
      await handleDrop(e)
    },
    [handleDrop]
  )

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  // Listen for paste events
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => handlePaste(e)
    document.addEventListener('paste', onPaste)
    return () => document.removeEventListener('paste', onPaste)
  }, [handlePaste])

  if (sourceImage) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sourceImage}
          alt={sourceFileName || 'Uploaded image'}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
        <button
          onClick={clearImage}
          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          title="Remove image"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={onDrop}
      className={cn(
        'relative w-full h-full min-h-[300px] flex flex-col items-center justify-center gap-4',
        'border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200',
        isDragging
          ? 'border-[var(--accent)] bg-[var(--accent-light)]'
          : 'border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--muted)]'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        className={cn(
          'p-4 rounded-full transition-colors',
          isDragging ? 'bg-[var(--accent)] text-white' : 'bg-[var(--muted)]'
        )}
      >
        {isDragging ? (
          <Upload className="w-8 h-8" />
        ) : (
          <ImageIcon className="w-8 h-8 text-[var(--muted-foreground)]" />
        )}
      </div>

      <div className="text-center">
        <p className="text-base font-medium text-[var(--foreground)]">
          {t('dropzone.title')}
        </p>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          {t('dropzone.subtitle')}
        </p>
      </div>

      <div className="text-xs text-[var(--muted-foreground)] space-y-0.5 text-center">
        <p>{t('dropzone.formats')}</p>
        <p>{t('dropzone.maxSize')}</p>
      </div>
    </div>
  )
}
