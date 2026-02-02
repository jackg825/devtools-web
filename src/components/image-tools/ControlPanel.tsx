'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { FormatPanel } from './FormatPanel'
import { ResizePanel } from './ResizePanel'
import { BackgroundRemovalPanel } from './BackgroundRemovalPanel'

type TabId = 'format' | 'resize' | 'background'

const tabs: TabId[] = ['format', 'resize', 'background']

export function ControlPanel() {
  const t = useTranslations('imageTools.controls.tabs')
  const [activeTab, setActiveTab] = useState<TabId>('format')

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--muted)] rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              activeTab === tab
                ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            )}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'format' && <FormatPanel />}
        {activeTab === 'resize' && <ResizePanel />}
        {activeTab === 'background' && <BackgroundRemovalPanel />}
      </div>
    </div>
  )
}
