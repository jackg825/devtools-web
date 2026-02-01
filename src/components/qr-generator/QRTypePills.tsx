'use client'

import { memo } from 'react'
import { useTranslations } from 'next-intl'
import {
  MdLink,
  MdTextFields,
  MdWifi,
  MdPerson,
  MdEvent,
  MdPhone,
  MdSms,
  MdLocationOn,
  MdCurrencyBitcoin,
  MdCreditCard,
  MdContentCopy,
} from 'react-icons/md'
import { cn } from '@/lib/utils'
import type { QRType } from '@/types/qr'

const qrTypeConfig: { value: QRType; labelKey: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'url', labelKey: 'url', icon: MdLink },
  { value: 'text', labelKey: 'text', icon: MdTextFields },
  { value: 'wifi', labelKey: 'wifi', icon: MdWifi },
  { value: 'vcard', labelKey: 'vcard', icon: MdPerson },
  { value: 'event', labelKey: 'event', icon: MdEvent },
  { value: 'tel', labelKey: 'tel', icon: MdPhone },
  { value: 'sms', labelKey: 'sms', icon: MdSms },
  { value: 'geo', labelKey: 'geo', icon: MdLocationOn },
  { value: 'crypto', labelKey: 'crypto', icon: MdCurrencyBitcoin },
  { value: 'twqr', labelKey: 'twqr', icon: MdCreditCard },
  { value: 'copy', labelKey: 'copy', icon: MdContentCopy },
]

interface QRTypePillsProps {
  value: QRType
  onChange: (value: QRType) => void
}

export const QRTypePills = memo(function QRTypePills({ value, onChange }: QRTypePillsProps) {
  const t = useTranslations('qrGenerator.types')

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {qrTypeConfig.map((type) => {
        const Icon = type.icon
        const isActive = value === type.value

        return (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={cn(
              'flex flex-col items-center gap-2 p-3 min-h-[70px] rounded-xl transition-all duration-[--duration-normal]',
              'border text-center',
              isActive
                ? 'bg-gradient-to-br from-[--accent]/15 to-[#764ba2]/10 border-[--accent]/30 text-[--accent] shadow-md'
                : 'bg-[--glass-bg] border-[--glass-border] text-[--muted-foreground] hover:bg-[--glass-bg-elevated] hover:border-[--border-hover] hover:text-[--foreground]'
            )}
          >
            <Icon className={cn(
              'w-5 h-5 flex-shrink-0 transition-transform duration-300',
              isActive && 'scale-110'
            )} />
            <span className="text-xs font-medium leading-tight text-center break-words">
              {t(type.labelKey)}
            </span>
          </button>
        )
      })}
    </div>
  )
})
