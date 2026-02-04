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
// Helper Functions for RFC Compliance
// ============================================================================

/**
 * Escapes special characters for WiFi QR codes (de-facto standard)
 * Characters that need escaping: backslash, semicolon, colon, comma
 */
function escapeWiFiValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/:/g, '\\:')
    .replace(/,/g, '\\,')
}

/**
 * Escapes special characters for vCard (RFC 2426)
 * Characters that need escaping: backslash, semicolon, comma, newline
 */
function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/**
 * Escapes special characters for iCalendar (RFC 5545)
 * Characters that need escaping: backslash, semicolon, comma, newline
 */
function escapeICalValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/**
 * Folds long lines according to RFC 5545 (max 75 octets per line)
 * Continuation lines start with a space or tab
 */
function foldLine(line: string, maxLength = 75): string {
  if (line.length <= maxLength) return line

  const result: string[] = []
  let remaining = line

  // First line can be full length
  result.push(remaining.slice(0, maxLength))
  remaining = remaining.slice(maxLength)

  // Continuation lines start with space, so max content is maxLength - 1
  while (remaining.length > 0) {
    result.push(' ' + remaining.slice(0, maxLength - 1))
    remaining = remaining.slice(maxLength - 1)
  }

  return result.join('\r\n')
}

/**
 * Generates a unique identifier for iCalendar events (RFC 5545)
 */
function generateUID(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `${timestamp}-${random}@devtools-qr`
}

/**
 * Gets current timestamp in iCalendar format (DTSTAMP)
 */
function getCurrentDTSTAMP(): string {
  return new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

// ============================================================================
// QR Code Formatters
// ============================================================================

export function formatWiFi(data: WiFiData): string {
  const { ssid, password, encryption, hidden } = data
  const escapedSSID = escapeWiFiValue(ssid)
  const escapedPassword = escapeWiFiValue(password)
  return `WIFI:T:${encryption};S:${escapedSSID};P:${escapedPassword};H:${hidden ? 'true' : ''};;`
}

export function formatVCard(data: VCardData): string {
  const escapedFirstName = escapeVCardValue(data.firstName)
  const escapedLastName = escapeVCardValue(data.lastName)

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    foldLine(`N:${escapedLastName};${escapedFirstName};;;`),
    foldLine(`FN:${escapedFirstName} ${escapedLastName}`),
  ]

  if (data.org) lines.push(foldLine(`ORG:${escapeVCardValue(data.org)}`))
  if (data.title) lines.push(foldLine(`TITLE:${escapeVCardValue(data.title)}`))
  if (data.email) lines.push(foldLine(`EMAIL:${data.email}`))
  if (data.phone) lines.push(foldLine(`TEL:${data.phone}`))
  if (data.website) lines.push(foldLine(`URL:${data.website}`))
  if (data.address) lines.push(foldLine(`ADR:;;${escapeVCardValue(data.address)};;;;`))

  lines.push('END:VCARD')
  return lines.join('\r\n')
}

export function formatEvent(data: EventData): string {
  const formatDateTime = (dateStr: string): string => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const uid = generateUID()
  const dtstamp = getCurrentDTSTAMP()

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DevTools//QR Generator//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    foldLine(`UID:${uid}`),
    foldLine(`DTSTAMP:${dtstamp}`),
    foldLine(`SUMMARY:${escapeICalValue(data.title)}`),
  ]

  if (data.location) {
    lines.push(foldLine(`LOCATION:${escapeICalValue(data.location)}`))
  }
  if (data.startDate) {
    lines.push(foldLine(`DTSTART:${formatDateTime(data.startDate)}`))
  }
  if (data.endDate) {
    lines.push(foldLine(`DTEND:${formatDateTime(data.endDate)}`))
  }
  if (data.description) {
    lines.push(foldLine(`DESCRIPTION:${escapeICalValue(data.description)}`))
  }

  lines.push('END:VEVENT')
  lines.push('END:VCALENDAR')

  return lines.join('\r\n')
}

export function formatTel(phone: string): string {
  return `tel:${phone}`
}

export function formatSMS(data: SMSData): string {
  const { phone, message } = data
  if (message) {
    return `sms:${phone}?body=${encodeURIComponent(message)}`
  }
  return `sms:${phone}`
}

export function formatGeo(data: GeoData): string {
  return `geo:${data.latitude},${data.longitude}`
}

export function formatCrypto(data: CryptoData): string {
  const { currency, address, amount, label, message } = data
  let uri = `${currency}:${address}`

  const params: string[] = []
  if (amount) params.push(`amount=${amount}`)
  if (label) params.push(`label=${encodeURIComponent(label)}`)
  if (message) params.push(`message=${encodeURIComponent(message)}`)

  if (params.length > 0) {
    uri += '?' + params.join('&')
  }

  return uri
}

export function formatTWQR(data: TWQRData): string {
  // TWQR format based on FISC QR Code Common Payment Standard
  // Reference: https://www.fisc.com.tw/ and PTT MobilePay discussions
  const { bankCode, account, amount } = data

  // Pad account to 16 digits with leading zeros
  const paddedAccount = account.padStart(16, '0')

  // Build parameters: D5=BankCode, D6=Account(16 digits), D10=Currency(901=TWD)
  let params = `D5=${bankCode}&D6=${paddedAccount}&D10=901`

  // If amount is provided, add D1 parameter (amount × 100 for 2 decimal places)
  if (amount && parseFloat(amount) > 0) {
    const formattedAmount = Math.round(parseFloat(amount) * 100).toString()
    params = `D1=${formattedAmount}&${params}`
  }

  // Format: TWQRP://NTTransfer/[CountryCode=158]/[TransactionType=02]/V1?[params]
  return `TWQRP://NTTransfer/158/02/V1?${params}`
}
