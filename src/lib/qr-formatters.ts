import type {
  WiFiData,
  VCardData,
  EventData,
  GeoData,
  CryptoData,
  TWQRData,
  SMSData,
} from '@/types/qr'

export function formatWiFi(data: WiFiData): string {
  const { ssid, password, encryption, hidden } = data
  return `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden ? 'true' : ''};;`
}

export function formatVCard(data: VCardData): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${data.lastName};${data.firstName};;;`,
    `FN:${data.firstName} ${data.lastName}`,
  ]

  if (data.org) lines.push(`ORG:${data.org}`)
  if (data.title) lines.push(`TITLE:${data.title}`)
  if (data.email) lines.push(`EMAIL:${data.email}`)
  if (data.phone) lines.push(`TEL:${data.phone}`)
  if (data.website) lines.push(`URL:${data.website}`)
  if (data.address) lines.push(`ADR:;;${data.address};;;;`)

  lines.push('END:VCARD')
  return lines.join('\n')
}

export function formatEvent(data: EventData): string {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const lines = [
    'BEGIN:VEVENT',
    `SUMMARY:${data.title}`,
  ]

  if (data.location) lines.push(`LOCATION:${data.location}`)
  if (data.startDate) lines.push(`DTSTART:${formatDate(data.startDate)}`)
  if (data.endDate) lines.push(`DTEND:${formatDate(data.endDate)}`)
  if (data.description) lines.push(`DESCRIPTION:${data.description}`)

  lines.push('END:VEVENT')
  return lines.join('\n')
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
