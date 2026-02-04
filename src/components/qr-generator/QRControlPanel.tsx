'use client'

import { memo, useState, useCallback, useId } from 'react'
import { useTranslations } from 'next-intl'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { QRLogoPanel } from './QRLogoPanel'
import {
  useQRType,
  useQRData,
  useQRSize,
  useQRColor,
  useQRBackgroundColor,
  useQRTransparentBackground,
  useQRErrorCorrectionLevel,
  useQRMargin,
  useQRDotStyle,
  useQRCornerSquareStyle,
  useQRCornerSquareColor,
  useQRCornerDotStyle,
  useQRCornerDotColor,
  useSetQRType,
  useSetQRData,
  useSetQRSize,
  useSetQRColor,
  useSetQRBackgroundColor,
  useSetQRTransparentBackground,
  useSetQRErrorCorrectionLevel,
  useSetQRMargin,
  useSetQRDotStyle,
  useSetQRCornerSquareStyle,
  useSetQRCornerSquareColor,
  useSetQRCornerDotStyle,
  useSetQRCornerDotColor,
} from '@/stores/qrGeneratorStore'
import type { QRType, DotStyle, CornerSquareStyle, CornerDotStyle, ErrorCorrectionLevel } from '@/types/qr'

const qrTypes: { value: QRType; labelKey: string }[] = [
  { value: 'url', labelKey: 'url' },
  { value: 'text', labelKey: 'text' },
  { value: 'wifi', labelKey: 'wifi' },
  { value: 'vcard', labelKey: 'vcard' },
  { value: 'event', labelKey: 'event' },
  { value: 'tel', labelKey: 'tel' },
  { value: 'sms', labelKey: 'sms' },
  { value: 'geo', labelKey: 'geo' },
  { value: 'crypto', labelKey: 'crypto' },
  { value: 'twqr', labelKey: 'twqr' },
  { value: 'copy', labelKey: 'copy' },
]

const dotStyles: { value: DotStyle; labelKey: string }[] = [
  { value: 'square', labelKey: 'square' },
  { value: 'rounded', labelKey: 'rounded' },
  { value: 'dots', labelKey: 'dots' },
  { value: 'classy', labelKey: 'classy' },
  { value: 'classy-rounded', labelKey: 'classyRounded' },
  { value: 'extra-rounded', labelKey: 'extraRounded' },
]

const cornerSquareStyles: { value: CornerSquareStyle; labelKey: string }[] = [
  { value: 'square', labelKey: 'square' },
  { value: 'dot', labelKey: 'dot' },
  { value: 'extra-rounded', labelKey: 'extraRounded' },
]

const cornerDotStyles: { value: CornerDotStyle; labelKey: string }[] = [
  { value: 'square', labelKey: 'square' },
  { value: 'dot', labelKey: 'dot' },
]

const errorCorrectionLevels: { value: ErrorCorrectionLevel; label: string }[] = [
  { value: 'L', label: 'L (7%)' },
  { value: 'M', label: 'M (15%)' },
  { value: 'Q', label: 'Q (25%)' },
  { value: 'H', label: 'H (30%)' },
]

export const QRControlPanel = memo(function QRControlPanel() {
  const t = useTranslations('qrGenerator')
  const tControls = useTranslations('qrGenerator.controls')
  const tDotStyles = useTranslations('qrGenerator.dotStyles')
  const tCornerStyles = useTranslations('qrGenerator.cornerStyles')
  const tConfirm = useTranslations('qrGenerator.confirmTypeChange')

  const baseId = useId()

  const type = useQRType()
  const data = useQRData()
  const size = useQRSize()
  const color = useQRColor()
  const backgroundColor = useQRBackgroundColor()
  const transparentBackground = useQRTransparentBackground()
  const errorCorrectionLevel = useQRErrorCorrectionLevel()
  const margin = useQRMargin()
  const dotStyle = useQRDotStyle()
  const cornerSquareStyle = useQRCornerSquareStyle()
  const cornerSquareColor = useQRCornerSquareColor()
  const cornerDotStyle = useQRCornerDotStyle()
  const cornerDotColor = useQRCornerDotColor()

  const setType = useSetQRType()
  const setData = useSetQRData()
  const setSize = useSetQRSize()
  const setColor = useSetQRColor()
  const setBackgroundColor = useSetQRBackgroundColor()
  const setTransparentBackground = useSetQRTransparentBackground()
  const setErrorCorrectionLevel = useSetQRErrorCorrectionLevel()
  const setMargin = useSetQRMargin()
  const setDotStyle = useSetQRDotStyle()
  const setCornerSquareStyle = useSetQRCornerSquareStyle()
  const setCornerSquareColor = useSetQRCornerSquareColor()
  const setCornerDotStyle = useSetQRCornerDotStyle()
  const setCornerDotColor = useSetQRCornerDotColor()

  // State for type change confirmation dialog
  const [showTypeChangeDialog, setShowTypeChangeDialog] = useState(false)
  const [pendingType, setPendingType] = useState<QRType | null>(null)

  // Handle type change with confirmation if data exists
  const handleTypeChange = useCallback(
    (newType: QRType) => {
      if (newType === type) return

      // If there's data, show confirmation dialog
      if (data && data.trim() !== '') {
        setPendingType(newType)
        setShowTypeChangeDialog(true)
      } else {
        setType(newType)
      }
    },
    [type, data, setType]
  )

  // Confirm type change
  const confirmTypeChange = useCallback(() => {
    if (pendingType) {
      setData('') // Clear data
      setType(pendingType)
    }
    setShowTypeChangeDialog(false)
    setPendingType(null)
  }, [pendingType, setType, setData])

  // Cancel type change
  const cancelTypeChange = useCallback(() => {
    setShowTypeChangeDialog(false)
    setPendingType(null)
  }, [])

  // Handle slider value input changes
  const handleSizeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10)
      if (!isNaN(value) && value >= 100 && value <= 500) {
        setSize(value)
      }
    },
    [setSize]
  )

  const handleMarginInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10)
      if (!isNaN(value) && value >= 0 && value <= 50) {
        setMargin(value)
      }
    },
    [setMargin]
  )

  const sizeId = `${baseId}-size`
  const marginId = `${baseId}-margin`

  return (
    <>
      {/* Type Change Confirmation Dialog */}
      <Dialog open={showTypeChangeDialog} onOpenChange={setShowTypeChangeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tConfirm('title')}</DialogTitle>
            <DialogDescription>{tConfirm('description')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelTypeChange}>
              {tConfirm('cancel')}
            </Button>
            <Button onClick={confirmTypeChange}>{tConfirm('confirm')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="basic">{tControls('tabs.basic')}</TabsTrigger>
          <TabsTrigger value="style">{tControls('tabs.style')}</TabsTrigger>
          <TabsTrigger value="corners">{tControls('tabs.corners')}</TabsTrigger>
          <TabsTrigger value="logo">{tControls('tabs.logo')}</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          {/* Type */}
          <div className="space-y-2">
            <Label>{tControls('type')}</Label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {qrTypes.map((qt) => (
                  <SelectItem key={qt.value} value={qt.value}>
                    {t(`types.${qt.labelKey}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor={sizeId}>{tControls('size')}</Label>
              <div className="flex items-center gap-1">
                <Input
                  id={sizeId}
                  type="number"
                  min={100}
                  max={500}
                  step={10}
                  value={size}
                  onChange={handleSizeInput}
                  className="w-16 h-6 text-xs text-center px-1"
                  aria-label={`${tControls('size')} value`}
                />
                <span className="text-xs text-[var(--muted-foreground)]">px</span>
              </div>
            </div>
            <Slider
              value={[size]}
              onValueChange={([v]) => setSize(v)}
              min={100}
              max={500}
              step={10}
              aria-label={tControls('size')}
            />
          </div>

        {/* Color */}
        <div className="space-y-2">
          <Label>{tControls('color')}</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 font-mono text-sm"
            />
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <Label>{tControls('backgroundColor')}</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
              disabled={transparentBackground}
            />
            <Input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="flex-1 font-mono text-sm"
              disabled={transparentBackground}
            />
          </div>
        </div>

        {/* Transparent Background */}
        <div className="flex items-center justify-between">
          <Label>{tControls('transparent')}</Label>
          <Switch checked={transparentBackground} onCheckedChange={setTransparentBackground} />
        </div>

        {/* Error Correction */}
        <div className="space-y-2">
          <Label>{tControls('errorCorrection')}</Label>
          <Select
            value={errorCorrectionLevel}
            onValueChange={(v) => setErrorCorrectionLevel(v as ErrorCorrectionLevel)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {errorCorrectionLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Margin */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor={marginId}>{tControls('margin')}</Label>
            <div className="flex items-center gap-1">
              <Input
                id={marginId}
                type="number"
                min={0}
                max={50}
                step={5}
                value={margin}
                onChange={handleMarginInput}
                className="w-14 h-6 text-xs text-center px-1"
                aria-label={`${tControls('margin')} value`}
              />
              <span className="text-xs text-[var(--muted-foreground)]">px</span>
            </div>
          </div>
          <Slider
            value={[margin]}
            onValueChange={([v]) => setMargin(v)}
            min={0}
            max={50}
            step={5}
            aria-label={tControls('margin')}
          />
        </div>
      </TabsContent>

      <TabsContent value="style" className="space-y-4 mt-4">
        {/* Dot Style */}
        <div className="space-y-2">
          <Label>{tControls('dotStyle')}</Label>
          <Select value={dotStyle} onValueChange={(v) => setDotStyle(v as DotStyle)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dotStyles.map((ds) => (
                <SelectItem key={ds.value} value={ds.value}>
                  {tDotStyles(ds.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="corners" className="space-y-4 mt-4">
        {/* Corner Square Style */}
        <div className="space-y-2">
          <Label>{tControls('cornerSquareStyle')}</Label>
          <Select
            value={cornerSquareStyle}
            onValueChange={(v) => setCornerSquareStyle(v as CornerSquareStyle)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cornerSquareStyles.map((cs) => (
                <SelectItem key={cs.value} value={cs.value}>
                  {tCornerStyles(cs.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Corner Square Color */}
        <div className="space-y-2">
          <Label>{tControls('cornerSquareColor')}</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={cornerSquareColor}
              onChange={(e) => setCornerSquareColor(e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={cornerSquareColor}
              onChange={(e) => setCornerSquareColor(e.target.value)}
              className="flex-1 font-mono text-sm"
            />
          </div>
        </div>

        {/* Corner Dot Style */}
        <div className="space-y-2">
          <Label>{tControls('cornerDotStyle')}</Label>
          <Select
            value={cornerDotStyle}
            onValueChange={(v) => setCornerDotStyle(v as CornerDotStyle)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cornerDotStyles.map((cd) => (
                <SelectItem key={cd.value} value={cd.value}>
                  {tCornerStyles(cd.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Corner Dot Color */}
        <div className="space-y-2">
          <Label>{tControls('cornerDotColor')}</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={cornerDotColor}
              onChange={(e) => setCornerDotColor(e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={cornerDotColor}
              onChange={(e) => setCornerDotColor(e.target.value)}
              className="flex-1 font-mono text-sm"
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="logo" className="space-y-4 mt-4">
          <QRLogoPanel />
        </TabsContent>
      </Tabs>
    </>
  )
})
