export type QRType = 'url' | 'text' | 'wifi' | 'vcard' | 'event' | 'tel' | 'sms' | 'geo' | 'crypto' | 'twqr' | 'copy'

export type DotStyle = 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded'
export type CornerSquareStyle = 'square' | 'dot' | 'extra-rounded'
export type CornerDotStyle = 'square' | 'dot'
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

export type LogoMode = 'none' | 'upload' | 'social'
export type SocialIcon =
  | 'facebook' | 'instagram' | 'x' | 'youtube' | 'linkedin'
  | 'line' | 'telegram' | 'whatsapp' | 'wechat' | 'weibo'
  | 'tiktok' | 'discord' | 'slack' | 'reddit' | 'pinterest'
  | 'github' | 'medium' | 'google-map' | 'twqr'

export interface QRSettings {
  type: QRType
  data: string
  size: number
  color: string
  backgroundColor: string
  transparentBackground: boolean
  version: number // 0 = auto, 1-40
  errorCorrectionLevel: ErrorCorrectionLevel
  margin: number
  dotStyle: DotStyle
  cornerSquareStyle: CornerSquareStyle
  cornerSquareColor: string
  cornerDotStyle: CornerDotStyle
  cornerDotColor: string
  logoMode: LogoMode
  logoImage: string // base64 or URL
  logoSize: number // percentage 35-70
  logoMargin: number // margin around logo in pixels
  selectedSocialIcon: SocialIcon | null
}

// Type-specific data interfaces
export interface WiFiData {
  ssid: string
  password: string
  encryption: 'WPA' | 'WEP' | 'nopass'
  hidden: boolean
}

export interface VCardData {
  firstName: string
  lastName: string
  org: string
  title: string
  email: string
  phone: string
  website: string
  address: string
}

export interface EventData {
  title: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export interface GeoData {
  latitude: string
  longitude: string
}

export interface CryptoData {
  currency: 'bitcoin' | 'ethereum' | 'litecoin'
  address: string
  amount: string
  label: string
  message: string
}

export interface TWQRData {
  bankCode: string
  account: string
  amount: string
}

export interface SMSData {
  phone: string
  message: string
}
