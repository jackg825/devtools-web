'use client'

import { useTranslations } from 'next-intl'
import { Sparkles, Info } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
  useRemoveBackground,
  useBgRemovalModel,
  useSetRemoveBackground,
  useSetBgRemovalModel,
} from '@/stores/imageToolsStore'
import type { BackgroundRemovalModel } from '@/types/imageTools'

const models: { value: BackgroundRemovalModel; labelKey: string; desc: string }[] = [
  { value: 'isnet', labelKey: 'standard', desc: '~3-5s' },
  { value: 'isnet_fp16', labelKey: 'fast', desc: '~2-3s' },
  { value: 'isnet_quint8', labelKey: 'fastest', desc: '~1-2s' },
]

export function BackgroundRemovalPanel() {
  const t = useTranslations('imageTools.controls.background')

  const removeBackground = useRemoveBackground()
  const bgRemovalModel = useBgRemovalModel()
  const setRemoveBackground = useSetRemoveBackground()
  const setBgRemovalModel = useSetBgRemovalModel()

  return (
    <div className="space-y-4">
      {/* Enable Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--accent)]" />
          <Label>{t('enable')}</Label>
        </div>
        <Switch checked={removeBackground} onCheckedChange={setRemoveBackground} />
      </div>

      {/* Model Selection */}
      {removeBackground && (
        <div className="space-y-2">
          <Label>{t('model')}</Label>
          <div className="space-y-2">
            {models.map((model) => (
              <button
                key={model.value}
                onClick={() => setBgRemovalModel(model.value)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left',
                  bgRemovalModel === model.value
                    ? 'bg-[var(--accent-light)] border border-[var(--accent)]'
                    : 'bg-[var(--muted)] hover:bg-[var(--muted)]/80'
                )}
              >
                <span
                  className={cn(
                    'text-sm font-medium',
                    bgRemovalModel === model.value
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--foreground)]'
                  )}
                >
                  {t(model.labelKey)}
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">{model.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="flex items-start gap-2 p-3 bg-[var(--muted)] rounded-lg">
        <Info className="w-4 h-4 text-[var(--muted-foreground)] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-[var(--muted-foreground)]">{t('note')}</p>
      </div>
    </div>
  )
}
