'use client'

import { memo, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Upload, X } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
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

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        setLogoImage(base64)
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

  return (
    <div className="space-y-4">
      {/* Logo Mode Selection */}
      <div className="space-y-2">
        <Label>{tControls('logoMode')}</Label>
        <div className="flex gap-2">
          {logoModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setLogoMode(mode.value)}
              className={cn(
                'flex-1 px-2 py-2 text-xs sm:text-sm rounded-lg border transition-colors whitespace-nowrap',
                logoMode === mode.value
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                  : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--muted)]'
              )}
            >
              {tLogoOptions(mode.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Image */}
      {logoMode === 'upload' && (
        <div className="space-y-2">
          <Label>{tControls('uploadImage')}</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {logoImage ? (
            <div className="relative w-full aspect-square max-w-[120px] mx-auto">
              <Image
                src={logoImage}
                alt="Logo preview"
                fill
                className="object-contain rounded-lg border border-[var(--border)]"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-24 flex flex-col gap-2 whitespace-nowrap"
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm whitespace-nowrap">{tControls('uploadImage')}</span>
            </Button>
          )}
        </div>
      )}

      {/* Social Icon Grid */}
      {logoMode === 'social' && (
        <div className="space-y-2">
          <Label>{tControls('selectIcon')}</Label>
          <div className="grid grid-cols-4 gap-2">
            {socialIcons.map((icon) => (
              <button
                key={icon}
                onClick={() => handleSelectSocialIcon(icon)}
                className={cn(
                  'aspect-square p-2 rounded-lg border transition-all flex items-center justify-center',
                  selectedSocialIcon === icon
                    ? 'border-[var(--accent)] bg-[var(--accent-light)] ring-2 ring-[var(--accent)]'
                    : 'border-[var(--border)] hover:bg-[var(--muted)]'
                )}
                title={tSocialIcons(icon)}
              >
                <Image
                  src={getIconPath(icon)}
                  alt={tSocialIcons(icon)}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Logo Size */}
      {logoMode !== 'none' && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>{tControls('logoSize')}</Label>
            <span className="text-xs text-[var(--muted-foreground)]">{logoSize}%</span>
          </div>
          <Slider
            value={[logoSize]}
            onValueChange={([v]) => setLogoSize(v)}
            min={35}
            max={70}
            step={5}
          />
        </div>
      )}

      {/* Logo Border */}
      {logoMode !== 'none' && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>{tControls('logoMargin')}</Label>
            <span className="text-xs text-[var(--muted-foreground)]">{logoMargin}px</span>
          </div>
          <Slider
            value={[logoMargin]}
            onValueChange={([v]) => setLogoMargin(v)}
            min={0}
            max={8}
            step={1}
          />
        </div>
      )}
    </div>
  )
})
