'use client'

import { memo, useCallback, useRef, useState, useId, KeyboardEvent } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Upload, X, Check, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  useQRLogoMode,
  useQRLogoImage,
  useQRLogoSize,
  useQRLogoMargin,
  useQRSelectedSocialIcon,
  useSetQRLogoMode,
  useSetQRLogoImage,
  useSetQRLogoSize,
  useSetQRLogoMargin,
  useSetQRSelectedSocialIcon,
} from '@/stores/qrGeneratorStore'
import type { LogoMode, SocialIcon } from '@/types/qr'

const logoModes: { value: LogoMode; labelKey: string }[] = [
  { value: 'none', labelKey: 'none' },
  { value: 'upload', labelKey: 'upload' },
  { value: 'social', labelKey: 'social' },
]

const socialIcons: SocialIcon[] = [
  'facebook',
  'instagram',
  'x',
  'youtube',
  'linkedin',
  'line',
  'telegram',
  'whatsapp',
  'wechat',
  'weibo',
  'tiktok',
  'discord',
  'slack',
  'reddit',
  'pinterest',
  'github',
  'medium',
  'google-map',
  'twqr',
]

export const QRLogoPanel = memo(function QRLogoPanel() {
  const tControls = useTranslations('qrGenerator.controls')
  const tLogoOptions = useTranslations('qrGenerator.logoOptions')
  const tSocialIcons = useTranslations('qrGenerator.socialIcons')

  const logoMode = useQRLogoMode()
  const logoImage = useQRLogoImage()
  const logoSize = useQRLogoSize()
  const logoMargin = useQRLogoMargin()
  const selectedSocialIcon = useQRSelectedSocialIcon()

  const setLogoMode = useSetQRLogoMode()
  const setLogoImage = useSetQRLogoImage()
  const setLogoSize = useSetQRLogoSize()
  const setLogoMargin = useSetQRLogoMargin()
  const setSelectedSocialIcon = useSetQRSelectedSocialIcon()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const iconGridRef = useRef<HTMLDivElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [focusedIconIndex, setFocusedIconIndex] = useState(-1)

  const baseId = useId()
  const logoSizeId = `${baseId}-logo-size`
  const logoMarginId = `${baseId}-logo-margin`

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        setLogoImage(base64)
        setIsUploading(false)
      }
      reader.onerror = () => {
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    },
    [setLogoImage]
  )

  const handleRemoveImage = useCallback(() => {
    setLogoImage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [setLogoImage])

  const getIconPath = useCallback((icon: SocialIcon) => {
    return `/icons/social/${icon}.png`
  }, [])

  const handleSelectSocialIcon = useCallback(
    (icon: SocialIcon) => {
      setSelectedSocialIcon(icon)
      setLogoImage(getIconPath(icon))
    },
    [setSelectedSocialIcon, setLogoImage, getIconPath]
  )

  // Keyboard navigation for social icon grid (roving tabindex pattern)
  const handleIconKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const cols = 4
      let newIndex = index

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          newIndex = (index + 1) % socialIcons.length
          break
        case 'ArrowLeft':
          e.preventDefault()
          newIndex = (index - 1 + socialIcons.length) % socialIcons.length
          break
        case 'ArrowDown':
          e.preventDefault()
          newIndex = (index + cols) % socialIcons.length
          break
        case 'ArrowUp':
          e.preventDefault()
          newIndex = (index - cols + socialIcons.length) % socialIcons.length
          break
        case 'Home':
          e.preventDefault()
          newIndex = 0
          break
        case 'End':
          e.preventDefault()
          newIndex = socialIcons.length - 1
          break
        default:
          return
      }

      setFocusedIconIndex(newIndex)
      const buttons = iconGridRef.current?.querySelectorAll('button')
      buttons?.[newIndex]?.focus()
    },
    []
  )

  // Handle direct input for slider values
  const handleLogoSizeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10)
      if (!isNaN(value) && value >= 35 && value <= 70) {
        setLogoSize(value)
      }
    },
    [setLogoSize]
  )

  const handleLogoMarginInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10)
      if (!isNaN(value) && value >= 0 && value <= 8) {
        setLogoMargin(value)
      }
    },
    [setLogoMargin]
  )

  return (
    <div className="space-y-4">
      {/* Logo Mode Selection */}
      <div className="space-y-2">
        <Label id={`${baseId}-mode-label`}>{tControls('logoMode')}</Label>
        <div
          className="flex gap-2"
          role="radiogroup"
          aria-labelledby={`${baseId}-mode-label`}
        >
          {logoModes.map((mode) => (
            <button
              key={mode.value}
              role="radio"
              aria-checked={logoMode === mode.value}
              onClick={() => setLogoMode(mode.value)}
              className={cn(
                'flex-1 px-2 py-2 text-xs sm:text-sm rounded-lg border transition-colors whitespace-nowrap relative',
                logoMode === mode.value
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                  : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--muted)]'
              )}
            >
              {tLogoOptions(mode.labelKey)}
              {logoMode === mode.value && (
                <Check
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3"
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Image */}
      {logoMode === 'upload' && (
        <div className="space-y-2">
          <Label htmlFor={`${baseId}-file-input`}>{tControls('uploadImage')}</Label>
          <input
            id={`${baseId}-file-input`}
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-describedby={`${baseId}-upload-desc`}
          />
          {isUploading ? (
            <div className="w-full h-24 flex flex-col gap-2 items-center justify-center border border-dashed border-[var(--border)] rounded-lg">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" aria-hidden="true" />
              <span className="text-sm text-[var(--muted-foreground)]">Loading...</span>
            </div>
          ) : logoImage ? (
            <div className="relative w-full aspect-square max-w-[120px] mx-auto">
              <Image
                src={logoImage}
                alt="Logo preview"
                fill
                className="object-contain rounded-lg border border-[var(--border)]"
              />
              <button
                onClick={handleRemoveImage}
                aria-label="Remove logo"
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-24 flex flex-col gap-2 whitespace-nowrap"
              aria-describedby={`${baseId}-upload-desc`}
            >
              <Upload className="w-6 h-6" aria-hidden="true" />
              <span className="text-sm whitespace-nowrap">{tControls('uploadImage')}</span>
            </Button>
          )}
          <span id={`${baseId}-upload-desc`} className="sr-only">
            Upload an image to use as QR code logo
          </span>
        </div>
      )}

      {/* Social Icon Grid */}
      {logoMode === 'social' && (
        <div className="space-y-2">
          <Label id={`${baseId}-icon-label`}>{tControls('selectIcon')}</Label>
          <TooltipProvider delayDuration={300}>
            <div
              ref={iconGridRef}
              className="grid grid-cols-4 gap-2"
              role="grid"
              aria-labelledby={`${baseId}-icon-label`}
            >
              {socialIcons.map((icon, index) => {
                const isSelected = selectedSocialIcon === icon
                const isFocusable = focusedIconIndex === -1 ? index === 0 : focusedIconIndex === index

                return (
                  <Tooltip key={icon}>
                    <TooltipTrigger asChild>
                      <button
                        role="gridcell"
                        aria-selected={isSelected}
                        tabIndex={isFocusable ? 0 : -1}
                        onClick={() => handleSelectSocialIcon(icon)}
                        onKeyDown={(e) => handleIconKeyDown(e, index)}
                        onFocus={() => setFocusedIconIndex(index)}
                        className={cn(
                          'aspect-square p-2 rounded-lg border transition-all flex items-center justify-center relative',
                          isSelected
                            ? 'border-[var(--accent)] bg-[var(--accent-light)] ring-2 ring-[var(--accent)]'
                            : 'border-[var(--border)] hover:bg-[var(--muted)]'
                        )}
                        aria-label={tSocialIcons(icon)}
                      >
                        <Image
                          src={getIconPath(icon)}
                          alt=""
                          width={24}
                          height={24}
                          className="w-6 h-6"
                          aria-hidden="true"
                        />
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--accent)] text-white rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3" aria-hidden="true" />
                          </span>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      {tSocialIcons(icon)}
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </TooltipProvider>
        </div>
      )}

      {/* Logo Size */}
      {logoMode !== 'none' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor={logoSizeId}>{tControls('logoSize')}</Label>
            <div className="flex items-center gap-1">
              <Input
                id={logoSizeId}
                type="number"
                min={35}
                max={70}
                step={5}
                value={logoSize}
                onChange={handleLogoSizeInput}
                className="w-14 h-6 text-xs text-center px-1"
                aria-label={`${tControls('logoSize')} value`}
              />
              <span className="text-xs text-[var(--muted-foreground)]">%</span>
            </div>
          </div>
          <Slider
            value={[logoSize]}
            onValueChange={([v]) => setLogoSize(v)}
            min={35}
            max={70}
            step={5}
            aria-label={tControls('logoSize')}
          />
        </div>
      )}

      {/* Logo Border */}
      {logoMode !== 'none' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor={logoMarginId}>{tControls('logoMargin')}</Label>
            <div className="flex items-center gap-1">
              <Input
                id={logoMarginId}
                type="number"
                min={0}
                max={8}
                step={1}
                value={logoMargin}
                onChange={handleLogoMarginInput}
                className="w-14 h-6 text-xs text-center px-1"
                aria-label={`${tControls('logoMargin')} value`}
              />
              <span className="text-xs text-[var(--muted-foreground)]">px</span>
            </div>
          </div>
          <Slider
            value={[logoMargin]}
            onValueChange={([v]) => setLogoMargin(v)}
            min={0}
            max={8}
            step={1}
            aria-label={tControls('logoMargin')}
          />
        </div>
      )}
    </div>
  )
})
