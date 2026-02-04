'use client'

import { memo, useState, useCallback, useEffect, useId } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useQRType, useQRData, useSetQRData } from '@/stores/qrGeneratorStore'
import {
  formatWiFi,
  formatVCard,
  formatEvent,
  formatTel,
  formatSMS,
  formatGeo,
  formatCrypto,
  formatTWQR,
} from '@/lib/qr-formatters'
import { TAIWAN_BANKS, formatBankDisplay, getBankByCode } from '@/lib/taiwan-banks'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FieldError } from './ValidationMessage'
import {
  useWiFiValidation,
  useVCardValidation,
  useEventValidation,
  useGeoValidation,
  useCryptoValidation,
  useTWQRValidation,
  useSMSValidation,
  useTelValidation,
  useUrlValidation,
  useTextValidation,
  getFieldErrors,
} from '@/hooks/useQRValidation'
import type { WiFiData, VCardData, EventData, GeoData, CryptoData, TWQRData, SMSData } from '@/types/qr'

export const QRDataInput = memo(function QRDataInput() {
  const type = useQRType()

  return (
    <div className="space-y-3">
      {type === 'url' && <UrlInput />}
      {type === 'text' && <TextInput />}
      {type === 'copy' && <CopyInput />}
      {type === 'tel' && <TelInput />}
      {type === 'wifi' && <WiFiInput />}
      {type === 'vcard' && <VCardInput />}
      {type === 'sms' && <SMSInput />}
      {type === 'geo' && <GeoInput />}
      {type === 'event' && <EventInput />}
      {type === 'crypto' && <CryptoInput />}
      {type === 'twqr' && <TWQRInput />}
    </div>
  )
})

// URL Input with validation
const UrlInput = memo(function UrlInput() {
  const t = useTranslations('qrGenerator.inputs')
  const data = useQRData()
  const setData = useSetQRData()
  const id = useId()
  const errorId = `${id}-error`

  const validation = useUrlValidation(data)
  const fieldErrors = getFieldErrors(validation, 'url')
  const hasError = fieldErrors.errors.length > 0

  return (
    <div className="space-y-1">
      <Input
        id={id}
        type="url"
        value={data}
        onChange={(e) => setData(e.target.value)}
        placeholder={t('url.placeholder')}
        className="font-mono text-sm"
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
      />
      <div id={errorId}>
        <FieldError
          error={fieldErrors.errors[0]}
          warning={fieldErrors.warnings[0]}
        />
      </div>
    </div>
  )
})

// Text Input with validation
const TextInput = memo(function TextInput() {
  const t = useTranslations('qrGenerator.inputs')
  const data = useQRData()
  const setData = useSetQRData()
  const id = useId()
  const errorId = `${id}-error`

  const validation = useTextValidation(data)
  const fieldErrors = getFieldErrors(validation, 'text')
  const hasError = fieldErrors.errors.length > 0

  return (
    <div className="space-y-1">
      <Textarea
        id={id}
        value={data}
        onChange={(e) => setData(e.target.value)}
        placeholder={t('text.placeholder')}
        rows={4}
        className="font-mono text-sm"
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
      />
      <div id={errorId}>
        <FieldError
          error={fieldErrors.errors[0]}
          warning={fieldErrors.warnings[0]}
        />
      </div>
    </div>
  )
})

// Copy Input with validation
const CopyInput = memo(function CopyInput() {
  const t = useTranslations('qrGenerator.inputs')
  const data = useQRData()
  const setData = useSetQRData()
  const id = useId()
  const errorId = `${id}-error`

  const validation = useTextValidation(data)
  const fieldErrors = getFieldErrors(validation, 'text')
  const hasError = fieldErrors.errors.length > 0

  return (
    <div className="space-y-1">
      <Textarea
        id={id}
        value={data}
        onChange={(e) => setData(e.target.value)}
        placeholder={t('copy.placeholder')}
        rows={4}
        className="font-mono text-sm"
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
      />
      <div id={errorId}>
        <FieldError
          error={fieldErrors.errors[0]}
          warning={fieldErrors.warnings[0]}
        />
      </div>
    </div>
  )
})

// Tel Input
const TelInput = memo(function TelInput() {
  const t = useTranslations('qrGenerator.inputs.tel')
  const setData = useSetQRData()
  const [phone, setPhone] = useState('')
  const id = useId()
  const errorId = `${id}-error`

  const validation = useTelValidation(phone)
  const fieldErrors = getFieldErrors(validation, 'phone')
  const hasError = fieldErrors.errors.length > 0

  useEffect(() => {
    if (phone) {
      setData(formatTel(phone))
    }
  }, [phone, setData])

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{t('phone')}</Label>
      <Input
        id={id}
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+886912345678"
        className="font-mono text-sm"
        aria-required="true"
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
      />
      <div id={errorId}>
        <FieldError
          error={fieldErrors.errors[0]}
          warning={fieldErrors.warnings[0]}
        />
      </div>
    </div>
  )
})

// WiFi Input
const WiFiInput = memo(function WiFiInput() {
  const t = useTranslations('qrGenerator.inputs.wifi')
  const setData = useSetQRData()
  const baseId = useId()
  const [wifiData, setWifiData] = useState<WiFiData>({
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  })

  const validation = useWiFiValidation(wifiData)
  const ssidErrors = getFieldErrors(validation, 'ssid')
  const passwordErrors = getFieldErrors(validation, 'password')

  const updateField = useCallback(<K extends keyof WiFiData>(key: K, value: WiFiData[K]) => {
    setWifiData(prev => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    if (wifiData.ssid) {
      setData(formatWiFi(wifiData))
    }
  }, [wifiData, setData])

  const ssidId = `${baseId}-ssid`
  const ssidErrorId = `${ssidId}-error`
  const passwordId = `${baseId}-password`
  const passwordErrorId = `${passwordId}-error`
  const encryptionId = `${baseId}-encryption`
  const hiddenId = `${baseId}-hidden`

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={ssidId}>{t('ssid')}</Label>
        <Input
          id={ssidId}
          value={wifiData.ssid}
          onChange={(e) => updateField('ssid', e.target.value)}
          placeholder="Network Name"
          aria-required="true"
          aria-invalid={ssidErrors.errors.length > 0}
          aria-describedby={ssidErrors.errors.length > 0 ? ssidErrorId : undefined}
        />
        <div id={ssidErrorId}>
          <FieldError
            error={ssidErrors.errors[0]}
            warning={ssidErrors.warnings[0]}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={passwordId}>{t('password')}</Label>
        <Input
          id={passwordId}
          type="password"
          value={wifiData.password}
          onChange={(e) => updateField('password', e.target.value)}
          placeholder="Password"
          aria-required={wifiData.encryption !== 'nopass'}
          aria-invalid={passwordErrors.errors.length > 0}
          aria-describedby={passwordErrors.errors.length > 0 ? passwordErrorId : undefined}
        />
        <div id={passwordErrorId}>
          <FieldError
            error={passwordErrors.errors[0]}
            warning={passwordErrors.warnings[0]}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={encryptionId}>{t('encryption')}</Label>
        <Select
          value={wifiData.encryption}
          onValueChange={(value) => updateField('encryption', value as WiFiData['encryption'])}
        >
          <SelectTrigger id={encryptionId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WPA">WPA/WPA2</SelectItem>
            <SelectItem value="WEP">WEP</SelectItem>
            <SelectItem value="nopass">{t('noPassword')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor={hiddenId}>{t('hidden')}</Label>
        <Switch
          id={hiddenId}
          checked={wifiData.hidden}
          onCheckedChange={(checked) => updateField('hidden', checked)}
        />
      </div>
    </div>
  )
})

// VCard Input
const VCardInput = memo(function VCardInput() {
  const t = useTranslations('qrGenerator.inputs.vcard')
  const setData = useSetQRData()
  const baseId = useId()
  const [vcardData, setVcardData] = useState<VCardData>({
    firstName: '',
    lastName: '',
    org: '',
    title: '',
    email: '',
    phone: '',
    website: '',
    address: '',
  })

  const validation = useVCardValidation(vcardData)
  const firstNameErrors = getFieldErrors(validation, 'firstName')
  const emailErrors = getFieldErrors(validation, 'email')
  const phoneErrors = getFieldErrors(validation, 'phone')
  const websiteErrors = getFieldErrors(validation, 'website')

  const updateField = useCallback(<K extends keyof VCardData>(key: K, value: VCardData[K]) => {
    setVcardData(prev => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    if (vcardData.firstName || vcardData.lastName) {
      setData(formatVCard(vcardData))
    }
  }, [vcardData, setData])

  const firstNameId = `${baseId}-firstName`
  const firstNameErrorId = `${firstNameId}-error`
  const lastNameId = `${baseId}-lastName`
  const orgId = `${baseId}-org`
  const titleId = `${baseId}-title`
  const emailId = `${baseId}-email`
  const emailErrorId = `${emailId}-error`
  const phoneId = `${baseId}-phone`
  const phoneErrorId = `${phoneId}-error`
  const websiteId = `${baseId}-website`
  const websiteErrorId = `${websiteId}-error`
  const addressId = `${baseId}-address`

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor={firstNameId}>{t('firstName')}</Label>
          <Input
            id={firstNameId}
            value={vcardData.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            placeholder="John"
            aria-required="true"
            aria-invalid={firstNameErrors.errors.length > 0}
            aria-describedby={firstNameErrors.errors.length > 0 ? firstNameErrorId : undefined}
          />
          <div id={firstNameErrorId}>
            <FieldError error={firstNameErrors.errors[0]} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={lastNameId}>{t('lastName')}</Label>
          <Input
            id={lastNameId}
            value={vcardData.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            placeholder="Doe"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor={orgId}>{t('org')}</Label>
          <Input
            id={orgId}
            value={vcardData.org}
            onChange={(e) => updateField('org', e.target.value)}
            placeholder="Company"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={titleId}>{t('title')}</Label>
          <Input
            id={titleId}
            value={vcardData.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Job Title"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={emailId}>{t('email')}</Label>
        <Input
          id={emailId}
          type="email"
          value={vcardData.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="john@example.com"
          aria-invalid={emailErrors.errors.length > 0}
          aria-describedby={emailErrors.errors.length > 0 ? emailErrorId : undefined}
        />
        <div id={emailErrorId}>
          <FieldError error={emailErrors.errors[0]} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={phoneId}>{t('phone')}</Label>
        <Input
          id={phoneId}
          type="tel"
          value={vcardData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="+886912345678"
          aria-invalid={phoneErrors.warnings.length > 0}
          aria-describedby={phoneErrors.warnings.length > 0 ? phoneErrorId : undefined}
        />
        <div id={phoneErrorId}>
          <FieldError warning={phoneErrors.warnings[0]} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={websiteId}>{t('website')}</Label>
        <Input
          id={websiteId}
          type="url"
          value={vcardData.website}
          onChange={(e) => updateField('website', e.target.value)}
          placeholder="https://example.com"
          aria-invalid={websiteErrors.errors.length > 0}
          aria-describedby={websiteErrors.errors.length > 0 ? websiteErrorId : undefined}
        />
        <div id={websiteErrorId}>
          <FieldError error={websiteErrors.errors[0]} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={addressId}>{t('address')}</Label>
        <Textarea
          id={addressId}
          value={vcardData.address}
          onChange={(e) => updateField('address', e.target.value)}
          placeholder="123 Main St, City, Country"
          rows={2}
        />
      </div>
    </div>
  )
})

// SMS Input
const SMSInput = memo(function SMSInput() {
  const t = useTranslations('qrGenerator.inputs.sms')
  const setData = useSetQRData()
  const baseId = useId()
  const [smsData, setSmsData] = useState<SMSData>({
    phone: '',
    message: '',
  })

  const validation = useSMSValidation(smsData)
  const phoneErrors = getFieldErrors(validation, 'phone')
  const messageErrors = getFieldErrors(validation, 'message')

  const updateField = useCallback(<K extends keyof SMSData>(key: K, value: SMSData[K]) => {
    setSmsData(prev => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    if (smsData.phone) {
      setData(formatSMS(smsData))
    }
  }, [smsData, setData])

  const phoneId = `${baseId}-phone`
  const phoneErrorId = `${phoneId}-error`
  const messageId = `${baseId}-message`
  const messageErrorId = `${messageId}-error`

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={phoneId}>{t('phone')}</Label>
        <Input
          id={phoneId}
          type="tel"
          value={smsData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="+886912345678"
          aria-required="true"
          aria-invalid={phoneErrors.errors.length > 0}
          aria-describedby={phoneErrors.errors.length > 0 ? phoneErrorId : undefined}
        />
        <div id={phoneErrorId}>
          <FieldError
            error={phoneErrors.errors[0]}
            warning={phoneErrors.warnings[0]}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={messageId}>{t('message')}</Label>
        <Textarea
          id={messageId}
          value={smsData.message}
          onChange={(e) => updateField('message', e.target.value)}
          placeholder="Your message..."
          rows={3}
          aria-describedby={messageErrors.warnings.length > 0 ? messageErrorId : undefined}
        />
        <div id={messageErrorId}>
          <FieldError warning={messageErrors.warnings[0]} />
        </div>
      </div>
    </div>
  )
})

// Geo Input
const GeoInput = memo(function GeoInput() {
  const t = useTranslations('qrGenerator.inputs.geo')
  const setData = useSetQRData()
  const baseId = useId()
  const [geoData, setGeoData] = useState<GeoData>({
    latitude: '',
    longitude: '',
  })

  const validation = useGeoValidation(geoData)
  const latErrors = getFieldErrors(validation, 'latitude')
  const lngErrors = getFieldErrors(validation, 'longitude')

  const updateField = useCallback(<K extends keyof GeoData>(key: K, value: GeoData[K]) => {
    setGeoData(prev => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    if (geoData.latitude && geoData.longitude) {
      setData(formatGeo(geoData))
    }
  }, [geoData, setData])

  const latId = `${baseId}-lat`
  const latErrorId = `${latId}-error`
  const lngId = `${baseId}-lng`
  const lngErrorId = `${lngId}-error`

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor={latId}>{t('latitude')}</Label>
          <Input
            id={latId}
            type="number"
            step="any"
            value={geoData.latitude}
            onChange={(e) => updateField('latitude', e.target.value)}
            placeholder="25.0330"
            aria-required="true"
            aria-invalid={latErrors.errors.length > 0}
            aria-describedby={latErrors.errors.length > 0 ? latErrorId : undefined}
          />
          <div id={latErrorId}>
            <FieldError error={latErrors.errors[0]} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={lngId}>{t('longitude')}</Label>
          <Input
            id={lngId}
            type="number"
            step="any"
            value={geoData.longitude}
            onChange={(e) => updateField('longitude', e.target.value)}
            placeholder="121.5654"
            aria-required="true"
            aria-invalid={lngErrors.errors.length > 0}
            aria-describedby={lngErrors.errors.length > 0 ? lngErrorId : undefined}
          />
          <div id={lngErrorId}>
            <FieldError error={lngErrors.errors[0]} />
          </div>
        </div>
      </div>
    </div>
  )
})

// Event Input
const EventInput = memo(function EventInput() {
  const t = useTranslations('qrGenerator.inputs.event')
  const setData = useSetQRData()
  const baseId = useId()
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
  })

  const validation = useEventValidation(eventData)
  const titleErrors = getFieldErrors(validation, 'title')
  const startErrors = getFieldErrors(validation, 'startDate')
  const endErrors = getFieldErrors(validation, 'endDate')
  const descErrors = getFieldErrors(validation, 'description')

  const updateField = useCallback(<K extends keyof EventData>(key: K, value: EventData[K]) => {
    setEventData(prev => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    if (eventData.title) {
      setData(formatEvent(eventData))
    }
  }, [eventData, setData])

  const titleId = `${baseId}-title`
  const titleErrorId = `${titleId}-error`
  const locationId = `${baseId}-location`
  const startId = `${baseId}-start`
  const startErrorId = `${startId}-error`
  const endId = `${baseId}-end`
  const endErrorId = `${endId}-error`
  const descId = `${baseId}-desc`
  const descErrorId = `${descId}-error`

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={titleId}>{t('title')}</Label>
        <Input
          id={titleId}
          value={eventData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Event Title"
          aria-required="true"
          aria-invalid={titleErrors.errors.length > 0}
          aria-describedby={titleErrors.errors.length > 0 ? titleErrorId : undefined}
        />
        <div id={titleErrorId}>
          <FieldError error={titleErrors.errors[0]} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={locationId}>{t('location')}</Label>
        <Input
          id={locationId}
          value={eventData.location}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder="Location"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor={startId}>{t('startDate')}</Label>
          <Input
            id={startId}
            type="datetime-local"
            value={eventData.startDate}
            onChange={(e) => updateField('startDate', e.target.value)}
            aria-required="true"
            aria-invalid={startErrors.errors.length > 0}
            aria-describedby={startErrors.errors.length > 0 ? startErrorId : undefined}
          />
          <div id={startErrorId}>
            <FieldError error={startErrors.errors[0]} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={endId}>{t('endDate')}</Label>
          <Input
            id={endId}
            type="datetime-local"
            value={eventData.endDate}
            onChange={(e) => updateField('endDate', e.target.value)}
            aria-invalid={endErrors.errors.length > 0}
            aria-describedby={endErrors.errors.length > 0 ? endErrorId : undefined}
          />
          <div id={endErrorId}>
            <FieldError error={endErrors.errors[0]} />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={descId}>{t('description')}</Label>
        <Textarea
          id={descId}
          value={eventData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Event description..."
          rows={2}
          aria-describedby={descErrors.warnings.length > 0 ? descErrorId : undefined}
        />
        <div id={descErrorId}>
          <FieldError warning={descErrors.warnings[0]} />
        </div>
      </div>
    </div>
  )
})

// Crypto Input
const CryptoInput = memo(function CryptoInput() {
  const t = useTranslations('qrGenerator.inputs.crypto')
  const setData = useSetQRData()
  const baseId = useId()
  const [cryptoData, setCryptoData] = useState<CryptoData>({
    currency: 'bitcoin',
    address: '',
    amount: '',
    label: '',
    message: '',
  })

  const validation = useCryptoValidation(cryptoData)
  const addressErrors = getFieldErrors(validation, 'address')
  const amountErrors = getFieldErrors(validation, 'amount')

  const updateField = useCallback(<K extends keyof CryptoData>(key: K, value: CryptoData[K]) => {
    setCryptoData(prev => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    if (cryptoData.address) {
      setData(formatCrypto(cryptoData))
    }
  }, [cryptoData, setData])

  const currencyId = `${baseId}-currency`
  const addressId = `${baseId}-address`
  const addressErrorId = `${addressId}-error`
  const amountId = `${baseId}-amount`
  const amountErrorId = `${amountId}-error`
  const labelId = `${baseId}-label`
  const messageId = `${baseId}-message`

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={currencyId}>{t('currency')}</Label>
        <Select
          value={cryptoData.currency}
          onValueChange={(value) => updateField('currency', value as CryptoData['currency'])}
        >
          <SelectTrigger id={currencyId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
            <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
            <SelectItem value="litecoin">Litecoin (LTC)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={addressId}>{t('address')}</Label>
        <Input
          id={addressId}
          value={cryptoData.address}
          onChange={(e) => updateField('address', e.target.value)}
          placeholder="Wallet Address"
          className="font-mono text-sm"
          aria-required="true"
          aria-invalid={addressErrors.errors.length > 0}
          aria-describedby={
            addressErrors.errors.length > 0 || addressErrors.warnings.length > 0
              ? addressErrorId
              : undefined
          }
        />
        <div id={addressErrorId}>
          <FieldError
            error={addressErrors.errors[0]}
            warning={addressErrors.warnings[0]}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={amountId}>{t('amount')}</Label>
        <Input
          id={amountId}
          type="number"
          step="any"
          value={cryptoData.amount}
          onChange={(e) => updateField('amount', e.target.value)}
          placeholder="0.001"
          aria-invalid={amountErrors.errors.length > 0}
          aria-describedby={amountErrors.errors.length > 0 ? amountErrorId : undefined}
        />
        <div id={amountErrorId}>
          <FieldError error={amountErrors.errors[0]} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={labelId}>{t('label')}</Label>
        <Input
          id={labelId}
          value={cryptoData.label}
          onChange={(e) => updateField('label', e.target.value)}
          placeholder="Payment label"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={messageId}>{t('message')}</Label>
        <Input
          id={messageId}
          value={cryptoData.message}
          onChange={(e) => updateField('message', e.target.value)}
          placeholder="Payment message"
        />
      </div>
    </div>
  )
})

// TWQR Input (Taiwan QR Payment)
const TWQRInput = memo(function TWQRInput() {
  const t = useTranslations('qrGenerator.inputs.twqr')
  const setData = useSetQRData()
  const baseId = useId()
  const [open, setOpen] = useState(false)
  const [twqrData, setTwqrData] = useState<TWQRData>({
    bankCode: '',
    account: '',
    amount: '',
  })

  const validation = useTWQRValidation(twqrData)
  const bankErrors = getFieldErrors(validation, 'bankCode')
  const accountErrors = getFieldErrors(validation, 'account')
  const amountErrors = getFieldErrors(validation, 'amount')

  const updateField = useCallback(<K extends keyof TWQRData>(key: K, value: TWQRData[K]) => {
    setTwqrData(prev => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    if (twqrData.bankCode && twqrData.account && validation.isValid) {
      setData(formatTWQR(twqrData))
    }
  }, [twqrData, validation.isValid, setData])

  const selectedBank = twqrData.bankCode ? getBankByCode(twqrData.bankCode) : null

  const bankId = `${baseId}-bank`
  const bankErrorId = `${bankId}-error`
  const accountId = `${baseId}-account`
  const accountErrorId = `${accountId}-error`
  const amountId = `${baseId}-amount`
  const amountErrorId = `${amountId}-error`

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={bankId}>{t('bankCode')}</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={bankId}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-required="true"
              aria-invalid={bankErrors.errors.length > 0}
              aria-describedby={bankErrors.errors.length > 0 ? bankErrorId : undefined}
              aria-label={selectedBank ? formatBankDisplay(selectedBank) : t('selectBank')}
              className="w-full justify-between font-normal"
            >
              {selectedBank ? formatBankDisplay(selectedBank) : t('selectBank')}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command
              filter={(value, search) => {
                const bank = TAIWAN_BANKS.find(b => b.code === value)
                if (!bank) return 0
                const searchLower = search.toLowerCase()
                if (bank.code.includes(searchLower) || bank.name.toLowerCase().includes(searchLower)) {
                  return 1
                }
                return 0
              }}
            >
              <CommandInput placeholder={t('searchBank')} />
              <CommandList>
                <CommandEmpty>{t('noBank')}</CommandEmpty>
                <CommandGroup>
                  {TAIWAN_BANKS.map((bank) => (
                    <CommandItem
                      key={bank.code}
                      value={bank.code}
                      onSelect={(value) => {
                        updateField('bankCode', value)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          twqrData.bankCode === bank.code ? "opacity-100" : "opacity-0"
                        )}
                        aria-hidden="true"
                      />
                      {formatBankDisplay(bank)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div id={bankErrorId}>
          <FieldError error={bankErrors.errors[0]} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={accountId}>{t('account')}</Label>
        <Input
          id={accountId}
          value={twqrData.account}
          onChange={(e) => updateField('account', e.target.value)}
          placeholder="Account Number"
          className="font-mono text-sm"
          maxLength={16}
          aria-required="true"
          aria-invalid={accountErrors.errors.length > 0}
          aria-describedby={accountErrors.errors.length > 0 ? accountErrorId : undefined}
        />
        <div id={accountErrorId}>
          <FieldError error={accountErrors.errors[0]} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={amountId}>{t('amount')}</Label>
        <Input
          id={amountId}
          type="number"
          value={twqrData.amount}
          onChange={(e) => updateField('amount', e.target.value)}
          placeholder="100"
          aria-invalid={amountErrors.errors.length > 0}
          aria-describedby={amountErrors.errors.length > 0 ? amountErrorId : undefined}
        />
        <div id={amountErrorId}>
          <FieldError error={amountErrors.errors[0]} />
        </div>
      </div>
    </div>
  )
})
