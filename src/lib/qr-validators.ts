import type {
  WiFiData,
  VCardData,
  EventData,
  GeoData,
  CryptoData,
  TWQRData,
  SMSData,
} from '@/types/qr'

// ============================================================================
// Validation Result Interface
// ============================================================================

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ValidationWarning {
  field: string
  message: string
  code: string
}

// ============================================================================
// Validation Helper Functions
// ============================================================================

function createResult(): ValidationResult {
  return { isValid: true, errors: [], warnings: [] }
}

function addError(
  result: ValidationResult,
  field: string,
  message: string,
  code: string
): void {
  result.isValid = false
  result.errors.push({ field, message, code })
}

function addWarning(
  result: ValidationResult,
  field: string,
  message: string,
  code: string
): void {
  result.warnings.push({ field, message, code })
}

// ============================================================================
// WiFi Validation
// ============================================================================

export function validateWiFi(data: WiFiData): ValidationResult {
  const result = createResult()

  // SSID is required
  if (!data.ssid || data.ssid.trim() === '') {
    addError(result, 'ssid', 'SSID is required', 'WIFI_SSID_REQUIRED')
  } else if (data.ssid.length > 32) {
    addWarning(result, 'ssid', 'SSID exceeds 32 characters, may cause issues on some devices', 'WIFI_SSID_TOO_LONG')
  }

  // Password validation based on encryption type
  if (data.encryption === 'WPA') {
    if (!data.password || data.password.length < 8) {
      addError(result, 'password', 'WPA password must be at least 8 characters', 'WIFI_WPA_PASSWORD_TOO_SHORT')
    } else if (data.password.length > 63) {
      addError(result, 'password', 'WPA password must not exceed 63 characters', 'WIFI_WPA_PASSWORD_TOO_LONG')
    }
  } else if (data.encryption === 'WEP') {
    // WEP keys are typically 10 or 26 hex characters, or 5 or 13 ASCII characters
    const len = data.password?.length || 0
    if (len !== 5 && len !== 10 && len !== 13 && len !== 26) {
      addWarning(result, 'password', 'WEP key should be 5, 10, 13, or 26 characters', 'WIFI_WEP_PASSWORD_LENGTH')
    }
  }
  // nopass doesn't require password validation

  return result
}

// ============================================================================
// vCard Validation (RFC 2426)
// ============================================================================

export function validateVCard(data: VCardData): ValidationResult {
  const result = createResult()

  // At least one name field is required
  if ((!data.firstName || data.firstName.trim() === '') &&
      (!data.lastName || data.lastName.trim() === '')) {
    addError(result, 'firstName', 'At least first name or last name is required', 'VCARD_NAME_REQUIRED')
  }

  // Email format validation (basic)
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    addError(result, 'email', 'Invalid email format', 'VCARD_EMAIL_INVALID')
  }

  // Phone format validation (basic - allows common formats)
  if (data.phone && !/^[\d\s+\-().]+$/.test(data.phone)) {
    addWarning(result, 'phone', 'Phone number contains unusual characters', 'VCARD_PHONE_UNUSUAL')
  }

  // Website URL validation
  if (data.website && !isValidUrl(data.website)) {
    addError(result, 'website', 'Invalid website URL', 'VCARD_WEBSITE_INVALID')
  }

  return result
}

// ============================================================================
// Event Validation (RFC 5545)
// ============================================================================

export function validateEvent(data: EventData): ValidationResult {
  const result = createResult()

  // Title is required
  if (!data.title || data.title.trim() === '') {
    addError(result, 'title', 'Event title is required', 'EVENT_TITLE_REQUIRED')
  }

  // Start date is required
  if (!data.startDate) {
    addError(result, 'startDate', 'Start date is required', 'EVENT_START_REQUIRED')
  }

  // Date validation
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)

    if (isNaN(start.getTime())) {
      addError(result, 'startDate', 'Invalid start date format', 'EVENT_START_INVALID')
    }
    if (isNaN(end.getTime())) {
      addError(result, 'endDate', 'Invalid end date format', 'EVENT_END_INVALID')
    }
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
      addError(result, 'endDate', 'End date must be after start date', 'EVENT_END_BEFORE_START')
    }
  }

  // Description length warning (QR codes have capacity limits)
  if (data.description && data.description.length > 500) {
    addWarning(result, 'description', 'Long description may result in a dense QR code', 'EVENT_DESCRIPTION_LONG')
  }

  return result
}

// ============================================================================
// Geo Validation (RFC 5870)
// ============================================================================

export function validateGeo(data: GeoData): ValidationResult {
  const result = createResult()

  const lat = parseFloat(data.latitude)
  const lng = parseFloat(data.longitude)

  // Latitude validation
  if (!data.latitude || data.latitude.trim() === '') {
    addError(result, 'latitude', 'Latitude is required', 'GEO_LATITUDE_REQUIRED')
  } else if (isNaN(lat)) {
    addError(result, 'latitude', 'Latitude must be a number', 'GEO_LATITUDE_INVALID')
  } else if (lat < -90 || lat > 90) {
    addError(result, 'latitude', 'Latitude must be between -90 and 90', 'GEO_LATITUDE_RANGE')
  }

  // Longitude validation
  if (!data.longitude || data.longitude.trim() === '') {
    addError(result, 'longitude', 'Longitude is required', 'GEO_LONGITUDE_REQUIRED')
  } else if (isNaN(lng)) {
    addError(result, 'longitude', 'Longitude must be a number', 'GEO_LONGITUDE_INVALID')
  } else if (lng < -180 || lng > 180) {
    addError(result, 'longitude', 'Longitude must be between -180 and 180', 'GEO_LONGITUDE_RANGE')
  }

  return result
}

// ============================================================================
// Crypto Validation (BIP 70 / BIP 21)
// ============================================================================

export function validateCrypto(data: CryptoData): ValidationResult {
  const result = createResult()

  // Address is required
  if (!data.address || data.address.trim() === '') {
    addError(result, 'address', 'Wallet address is required', 'CRYPTO_ADDRESS_REQUIRED')
  } else {
    // Basic address format validation by currency
    switch (data.currency) {
      case 'bitcoin':
        // Bitcoin addresses: Legacy (1...), SegWit (3... or bc1...)
        if (!/^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,62}$/.test(data.address)) {
          addWarning(result, 'address', 'Bitcoin address format may be invalid', 'CRYPTO_BTC_ADDRESS_FORMAT')
        }
        break
      case 'ethereum':
        // Ethereum addresses: 0x followed by 40 hex characters
        if (!/^0x[a-fA-F0-9]{40}$/.test(data.address)) {
          addWarning(result, 'address', 'Ethereum address format may be invalid', 'CRYPTO_ETH_ADDRESS_FORMAT')
        }
        break
      case 'litecoin':
        // Litecoin addresses: Legacy (L... or M...), SegWit (ltc1...)
        if (!/^(L|M|ltc1)[a-zA-HJ-NP-Z0-9]{25,62}$/.test(data.address)) {
          addWarning(result, 'address', 'Litecoin address format may be invalid', 'CRYPTO_LTC_ADDRESS_FORMAT')
        }
        break
    }
  }

  // Amount validation (if provided)
  if (data.amount) {
    const amt = parseFloat(data.amount)
    if (isNaN(amt) || amt < 0) {
      addError(result, 'amount', 'Amount must be a positive number', 'CRYPTO_AMOUNT_INVALID')
    }
  }

  return result
}

// ============================================================================
// TWQR Validation (FISC Standard)
// ============================================================================

export function validateTWQR(data: TWQRData): ValidationResult {
  const result = createResult()

  // Bank code validation (3 digits)
  if (!data.bankCode || data.bankCode.trim() === '') {
    addError(result, 'bankCode', 'Bank code is required', 'TWQR_BANK_CODE_REQUIRED')
  } else if (!/^\d{3}$/.test(data.bankCode)) {
    addError(result, 'bankCode', 'Bank code must be 3 digits', 'TWQR_BANK_CODE_FORMAT')
  }

  // Account number validation (max 16 digits per FISC standard)
  if (!data.account || data.account.trim() === '') {
    addError(result, 'account', 'Account number is required', 'TWQR_ACCOUNT_REQUIRED')
  } else if (!/^\d+$/.test(data.account)) {
    addError(result, 'account', 'Account number must contain only digits', 'TWQR_ACCOUNT_DIGITS_ONLY')
  } else if (data.account.length > 16) {
    addError(result, 'account', 'Account number must not exceed 16 digits', 'TWQR_ACCOUNT_TOO_LONG')
  }

  // Amount validation (if provided)
  if (data.amount) {
    const amt = parseFloat(data.amount)
    if (isNaN(amt) || amt < 0) {
      addError(result, 'amount', 'Amount must be a positive number', 'TWQR_AMOUNT_INVALID')
    } else if (amt > 999999999.99) {
      addError(result, 'amount', 'Amount exceeds maximum allowed value', 'TWQR_AMOUNT_TOO_LARGE')
    }
  }

  return result
}

// ============================================================================
// SMS Validation (RFC 5724)
// ============================================================================

export function validateSMS(data: SMSData): ValidationResult {
  const result = createResult()

  // Phone is required
  if (!data.phone || data.phone.trim() === '') {
    addError(result, 'phone', 'Phone number is required', 'SMS_PHONE_REQUIRED')
  } else if (!/^[\d\s+\-().]+$/.test(data.phone)) {
    addWarning(result, 'phone', 'Phone number contains unusual characters', 'SMS_PHONE_UNUSUAL')
  }

  // Message length warning
  if (data.message && data.message.length > 160) {
    addWarning(result, 'message', 'Message exceeds SMS limit (160 chars), may be split', 'SMS_MESSAGE_LONG')
  }

  return result
}

// ============================================================================
// Tel Validation (RFC 3966)
// ============================================================================

export function validateTel(phone: string): ValidationResult {
  const result = createResult()

  if (!phone || phone.trim() === '') {
    addError(result, 'phone', 'Phone number is required', 'TEL_PHONE_REQUIRED')
  } else if (!/^[\d\s+\-().]+$/.test(phone)) {
    addWarning(result, 'phone', 'Phone number contains unusual characters', 'TEL_PHONE_UNUSUAL')
  }

  return result
}

// ============================================================================
// URL Validation
// ============================================================================

export function validateUrl(url: string): ValidationResult {
  const result = createResult()

  if (!url || url.trim() === '') {
    addError(result, 'url', 'URL is required', 'URL_REQUIRED')
  } else if (!isValidUrl(url)) {
    addError(result, 'url', 'Invalid URL format', 'URL_INVALID')
  }

  return result
}

// ============================================================================
// Text Validation
// ============================================================================

export function validateText(text: string): ValidationResult {
  const result = createResult()

  if (!text || text.trim() === '') {
    addError(result, 'text', 'Text content is required', 'TEXT_REQUIRED')
  } else if (text.length > 2953) {
    // Max QR Code capacity for alphanumeric at version 40
    addError(result, 'text', 'Text exceeds QR code capacity', 'TEXT_TOO_LONG')
  } else if (text.length > 1000) {
    addWarning(result, 'text', 'Long text may result in a dense QR code', 'TEXT_LONG')
  }

  return result
}

// ============================================================================
// Utility Functions
// ============================================================================

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    // If URL parsing fails, try adding https:// prefix
    try {
      const withProtocol = url.startsWith('//') ? `https:${url}` : `https://${url}`
      new URL(withProtocol)
      return true
    } catch {
      return false
    }
  }
}
