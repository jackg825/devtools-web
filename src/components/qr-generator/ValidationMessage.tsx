'use client'

import { memo } from 'react'
import { useTranslations } from 'next-intl'
import { AlertCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getI18nKeyForCode } from '@/hooks/useQRValidation'

interface ValidationMessageProps {
  errors?: string[]
  warnings?: string[]
  className?: string
}

export const ValidationMessage = memo(function ValidationMessage({
  errors = [],
  warnings = [],
  className,
}: ValidationMessageProps) {
  const t = useTranslations('qrGenerator.validation')

  if (errors.length === 0 && warnings.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-1', className)}>
      {errors.map((code) => (
        <div
          key={code}
          role="alert"
          className="flex items-center gap-1.5 text-xs text-destructive"
        >
          <AlertCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
          <span>{t(getI18nKeyForCode(code))}</span>
        </div>
      ))}
      {warnings.map((code) => (
        <div
          key={code}
          role="status"
          className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-500"
        >
          <AlertTriangle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
          <span>{t(getI18nKeyForCode(code))}</span>
        </div>
      ))}
    </div>
  )
})

// Simple inline error for single field
interface FieldErrorProps {
  error?: string
  warning?: string
  className?: string
}

export const FieldError = memo(function FieldError({
  error,
  warning,
  className,
}: FieldErrorProps) {
  const t = useTranslations('qrGenerator.validation')

  if (!error && !warning) return null

  const code = error || warning
  const isError = !!error

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={cn(
        'flex items-center gap-1.5 text-xs mt-1',
        isError ? 'text-destructive' : 'text-amber-600 dark:text-amber-500',
        className
      )}
    >
      {isError ? (
        <AlertCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
      ) : (
        <AlertTriangle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
      )}
      <span>{t(getI18nKeyForCode(code!))}</span>
    </div>
  )
})
