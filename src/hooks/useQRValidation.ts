'use client'

import { useMemo } from 'react'
import type { QRType, WiFiData, VCardData, EventData, GeoData, CryptoData, TWQRData, SMSData } from '@/types/qr'
import {
  validateWiFi,
  validateVCard,
  validateEvent,
  validateGeo,
  validateCrypto,
  validateTWQR,
  validateSMS,
  validateTel,
  validateUrl,
  validateText,
  type ValidationResult,
} from '@/lib/qr-validators'

export type { ValidationResult }

// Map validation error codes to i18n keys
const errorCodeToI18nKey: Record<string, string> = {
  // WiFi
  WIFI_SSID_REQUIRED: 'wifi.ssidRequired',
  WIFI_SSID_TOO_LONG: 'wifi.ssidTooLong',
  WIFI_WPA_PASSWORD_TOO_SHORT: 'wifi.wpaPasswordTooShort',
  WIFI_WPA_PASSWORD_TOO_LONG: 'wifi.wpaPasswordTooLong',
  WIFI_WEP_PASSWORD_LENGTH: 'wifi.wepPasswordLength',
  // vCard
  VCARD_NAME_REQUIRED: 'vcard.nameRequired',
  VCARD_EMAIL_INVALID: 'vcard.emailInvalid',
  VCARD_PHONE_UNUSUAL: 'vcard.phoneUnusual',
  VCARD_WEBSITE_INVALID: 'vcard.websiteInvalid',
  // Event
  EVENT_TITLE_REQUIRED: 'event.titleRequired',
  EVENT_START_REQUIRED: 'event.startRequired',
  EVENT_START_INVALID: 'event.startInvalid',
  EVENT_END_INVALID: 'event.endInvalid',
  EVENT_END_BEFORE_START: 'event.endBeforeStart',
  EVENT_DESCRIPTION_LONG: 'event.descriptionLong',
  // Geo
  GEO_LATITUDE_REQUIRED: 'geo.latitudeRequired',
  GEO_LATITUDE_INVALID: 'geo.latitudeInvalid',
  GEO_LATITUDE_RANGE: 'geo.latitudeInvalid',
  GEO_LONGITUDE_REQUIRED: 'geo.longitudeRequired',
  GEO_LONGITUDE_INVALID: 'geo.longitudeInvalid',
  GEO_LONGITUDE_RANGE: 'geo.longitudeInvalid',
  // Crypto
  CRYPTO_ADDRESS_REQUIRED: 'crypto.addressRequired',
  CRYPTO_BTC_ADDRESS_FORMAT: 'crypto.addressFormat',
  CRYPTO_ETH_ADDRESS_FORMAT: 'crypto.addressFormat',
  CRYPTO_LTC_ADDRESS_FORMAT: 'crypto.addressFormat',
  CRYPTO_AMOUNT_INVALID: 'crypto.amountInvalid',
  // TWQR
  TWQR_BANK_CODE_REQUIRED: 'twqr.bankCodeRequired',
  TWQR_BANK_CODE_FORMAT: 'twqr.bankCodeFormat',
  TWQR_ACCOUNT_REQUIRED: 'twqr.accountRequired',
  TWQR_ACCOUNT_DIGITS_ONLY: 'twqr.accountDigitsOnly',
  TWQR_ACCOUNT_TOO_LONG: 'twqr.accountTooLong',
  TWQR_AMOUNT_INVALID: 'twqr.amountInvalid',
  TWQR_AMOUNT_TOO_LARGE: 'twqr.amountTooLarge',
  // SMS
  SMS_PHONE_REQUIRED: 'sms.phoneRequired',
  SMS_PHONE_UNUSUAL: 'sms.phoneUnusual',
  SMS_MESSAGE_LONG: 'sms.messageLong',
  // Tel
  TEL_PHONE_REQUIRED: 'tel.phoneRequired',
  TEL_PHONE_UNUSUAL: 'tel.phoneUnusual',
  // URL
  URL_REQUIRED: 'url.required',
  URL_INVALID: 'url.invalid',
  // Text
  TEXT_REQUIRED: 'text.required',
  TEXT_TOO_LONG: 'text.tooLong',
  TEXT_LONG: 'text.long',
}

export function getI18nKeyForCode(code: string): string {
  return errorCodeToI18nKey[code] || 'required'
}

// Helper to get field-specific errors from validation result
export function getFieldErrors(
  result: ValidationResult,
  field: string
): { errors: string[]; warnings: string[] } {
  return {
    errors: result.errors.filter(e => e.field === field).map(e => e.code),
    warnings: result.warnings.filter(w => w.field === field).map(w => w.code),
  }
}

// Validation hooks for each QR type
export function useWiFiValidation(data: WiFiData): ValidationResult {
  return useMemo(() => validateWiFi(data), [data])
}

export function useVCardValidation(data: VCardData): ValidationResult {
  return useMemo(() => validateVCard(data), [data])
}

export function useEventValidation(data: EventData): ValidationResult {
  return useMemo(() => validateEvent(data), [data])
}

export function useGeoValidation(data: GeoData): ValidationResult {
  return useMemo(() => validateGeo(data), [data])
}

export function useCryptoValidation(data: CryptoData): ValidationResult {
  return useMemo(() => validateCrypto(data), [data])
}

export function useTWQRValidation(data: TWQRData): ValidationResult {
  return useMemo(() => validateTWQR(data), [data])
}

export function useSMSValidation(data: SMSData): ValidationResult {
  return useMemo(() => validateSMS(data), [data])
}

export function useTelValidation(phone: string): ValidationResult {
  return useMemo(() => validateTel(phone), [phone])
}

export function useUrlValidation(url: string): ValidationResult {
  return useMemo(() => validateUrl(url), [url])
}

export function useTextValidation(text: string): ValidationResult {
  return useMemo(() => validateText(text), [text])
}

// Generic validation hook based on QR type
export function useQRValidation(
  type: QRType,
  data: unknown
): ValidationResult | null {
  return useMemo(() => {
    switch (type) {
      case 'wifi':
        return validateWiFi(data as WiFiData)
      case 'vcard':
        return validateVCard(data as VCardData)
      case 'event':
        return validateEvent(data as EventData)
      case 'geo':
        return validateGeo(data as GeoData)
      case 'crypto':
        return validateCrypto(data as CryptoData)
      case 'twqr':
        return validateTWQR(data as TWQRData)
      case 'sms':
        return validateSMS(data as SMSData)
      case 'tel':
        return validateTel(data as string)
      case 'url':
        return validateUrl(data as string)
      case 'text':
      case 'copy':
        return validateText(data as string)
      default:
        return null
    }
  }, [type, data])
}
