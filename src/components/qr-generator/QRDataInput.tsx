'use client'

import { memo, useState, useCallback, useEffect } from 'react'
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
import type { WiFiData, VCardData, EventData, GeoData, CryptoData, TWQRData, SMSData } from '@/types/qr'

export const QRDataInput = memo(function QRDataInput() {
  const t = useTranslations('qrGenerator.inputs')
  const type = useQRType()
  const data = useQRData()
  const setData = useSetQRData()

  return (
    <div className="space-y-3">
      {type === 'url' && (
        <Input
          type="url"
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder={t('url.placeholder')}
          className="font-mono text-sm"
        />
      )}

      {type === 'text' && (
        <Textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder={t('text.placeholder')}
          rows={4}
          className="font-mono text-sm"
        />
      )}

      {type === 'copy' && (
        <Textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder={t('copy.placeholder')}
          rows={4}
          className="font-mono text-sm"
        />
      )}

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

// Tel Input
const TelInput = memo(function TelInput() {
  const t = useTranslations('qrGenerator.inputs.tel')
  const setData = useSetQRData()
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (phone) {
      setData(formatTel(phone))
    }
  }, [phone, setData])

  return (
    <div className="space-y-2">
      <Label>{t('phone')}</Label>
      <Input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+886912345678"
        className="font-mono text-sm"
      />
    </div>
  )
})

// WiFi Input
const WiFiInput = memo(function WiFiInput() {
  const t = useTranslations('qrGenerator.inputs.wifi')
  const setData = useSetQRData()
  const [wifiData, setWifiData] = useState<WiFiData>({
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  })

  const updateField = useCallback(<K extends keyof WiFiData>(key: K, value: WiFiData[K]) => {
    setWifiData(prev => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    if (wifiData.ssid) {
      setData(formatWiFi(wifiData))
    }
  }, [wifiData, setData])

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('ssid')}</Label>
        <Input
          value={wifiData.ssid}
          onChange={(e) => updateField('ssid', e.target.value)}
          placeholder="Network Name"
        />
      </div>
      <div className="space-y-2">
        <Label>{t('password')}</Label>
        <Input
          type="password"
          value={wifiData.password}
          onChange={(e) => updateField('password', e.target.value)}
          placeholder="Password"
        />
      </div>
      <div className="space-y-2">
        <Label>{t('encryption')}</Label>
        <Select
          value={wifiData.encryption}
          onValueChange={(value) => updateField('encryption', value as WiFiData['encryption'])}
        >
          <SelectTrigger>
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
        <Label>{t('hidden')}</Label>
        <Switch
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

  const updateField = useCallback(<K extends keyof VCardData>(key: K, value: VCardData[K]) => {
    setVcardData(prev => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    if (vcardData.firstName || vcardData.lastName) {
      setData(formatVCard(vcardData))
    }
  }, [vcardData, setData])

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>{t('firstName')}</Label>
          <Input
            value={vcardData.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            placeholder="John"
          />
        </div>
        <div className="space-y-2">
          <Label>{t('lastName')}</Label>
          <Input
            value={vcardData.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            placeholder="Doe"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>{t('org')}</Label>
          <Input
            value={vcardData.org}
            onChange={(e) => updateField('org', e.target.value)}
            placeholder="Company"
          />
        </div>
        <div className="space-y-2">
          <Label>{t('title')}</Label>
          <Input
            value={vcardData.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Job Title"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>{t('email')}</Label>
        <Input
          type="email"
          value={vcardData.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="john@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label>{t('phone')}</Label>
        <Input
          type="tel"
          value={vcardData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="+886912345678"
        />
      </div>
      <div className="space-y-2">
        <Label>{t('website')}</Label>
        <Input
          type="url"
          value={vcardData.website}
          onChange={(e) => updateField('website', e.target.value)}
          placeholder="https://example.com"
        />
      </div>
      <div className="space-y-2">
        <Label>{t('address')}</Label>
        <Textarea
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
  const [smsData, setSmsData] = useState<SMSData>({
    phone: '',
    message: '',
  })

  const updateField = useCallback(<K extends keyof SMSData>(key: K, value: SMSData[K]) => {
    setSmsData(prev => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    if (smsData.phone) {
      setData(formatSMS(smsData))
    }
  }, [smsData, setData])

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('phone')}</Label>
        <Input
          type="tel"
          value={smsData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="+886912345678"
        />
      </div>
      <div className="space-y-2">
        <Label>{t('message')}</Label>
        <Textarea
          value={smsData.message}
          onChange={(e) => updateField('message', e.target.value)}
          placeholder="Your message..."
          rows={3}
        />
      </div>
    </div>
  )
})

// Geo Input
const GeoInput = memo(function GeoInput() {
  const t = useTranslations('qrGenerator.inputs.geo')
  const setData = useSetQRData()
  const [geoData, setGeoData] = useState<GeoData>({
    latitude: '',
    longitude: '',
  })

  const updateField = useCallback(<K extends keyof GeoData>(key: K, value: GeoData[K]) => {
    setGeoData(prev => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    if (geoData.latitude && geoData.longitude) {
      setData(formatGeo(geoData))
    }
  }, [geoData, setData])

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>{t('latitude')}</Label>
          <Input
            type="number"
            step="any"
            value={geoData.latitude}
            onChange={(e) => updateField('latitude', e.target.value)}
            placeholder="25.0330"
          />
        </div>
        <div className="space-y-2">
          <Label>{t('longitude')}</Label>
          <Input
            type="number"
            step="any"
            value={geoData.longitude}
            onChange={(e) => updateField('longitude', e.target.value)}
            placeholder="121.5654"
          />
        </div>
      </div>
    </div>
  )
})

// Event Input
const EventInput = memo(function EventInput() {
  const t = useTranslations('qrGenerator.inputs.event')
  const setData = useSetQRData()
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
  })

  const updateField = useCallback(<K extends keyof EventData>(key: K, value: EventData[K]) => {
    setEventData(prev => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    if (eventData.title) {
      setData(formatEvent(eventData))
    }
  }, [eventData, setData])

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('title')}</Label>
        <Input
          value={eventData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Event Title"
        />
      </div>
      <div className="space-y-2">
        <Label>{t('location')}</Label>
        <Input
          value={eventData.location}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder="Location"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>{t('startDate')}</Label>
          <Input
            type="datetime-local"
            value={eventData.startDate}
            onChange={(e) => updateField('startDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('endDate')}</Label>
          <Input
            type="datetime-local"
            value={eventData.endDate}
            onChange={(e) => updateField('endDate', e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>{t('description')}</Label>
        <Textarea
          value={eventData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Event description..."
          rows={2}
        />
      </div>
    </div>
  )
})

// Crypto Input
const CryptoInput = memo(function CryptoInput() {
  const t = useTranslations('qrGenerator.inputs.crypto')
  const setData = useSetQRData()
  const [cryptoData, setCryptoData] = useState<CryptoData>({
    currency: 'bitcoin',
    address: '',
    amount: '',
    label: '',
    message: '',
  })

  const updateField = useCallback(<K extends keyof CryptoData>(key: K, value: CryptoData[K]) => {
    setCryptoData(prev => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    if (cryptoData.address) {
      setData(formatCrypto(cryptoData))
    }
  }, [cryptoData, setData])

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('currency')}</Label>
        <Select
          value={cryptoData.currency}
          onValueChange={(value) => updateField('currency', value as CryptoData['currency'])}
        >
          <SelectTrigger>
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
        <Label>{t('address')}</Label>
        <Input
          value={cryptoData.address}
          onChange={(e) => updateField('address', e.target.value)}
          placeholder="Wallet Address"
          className="font-mono text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label>{t('amount')}</Label>
        <Input
          type="number"
          step="any"
          value={cryptoData.amount}
          onChange={(e) => updateField('amount', e.target.value)}
          placeholder="0.001"
        />
      </div>
      <div className="space-y-2">
        <Label>{t('label')}</Label>
        <Input
          value={cryptoData.label}
          onChange={(e) => updateField('label', e.target.value)}
          placeholder="Payment label"
        />
      </div>
      <div className="space-y-2">
        <Label>{t('message')}</Label>
        <Input
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
  const [open, setOpen] = useState(false)
  const [twqrData, setTwqrData] = useState<TWQRData>({
    bankCode: '',
    account: '',
    amount: '',
  })

  const updateField = useCallback(<K extends keyof TWQRData>(key: K, value: TWQRData[K]) => {
    setTwqrData(prev => ({ ...prev, [key]: value }))
  }, [])

  useEffect(() => {
    if (twqrData.bankCode && twqrData.account) {
      setData(formatTWQR(twqrData))
    }
  }, [twqrData, setData])

  const selectedBank = twqrData.bankCode ? getBankByCode(twqrData.bankCode) : null

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('bankCode')}</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between font-normal"
            >
              {selectedBank ? formatBankDisplay(selectedBank) : t('selectBank')}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                      />
                      {formatBankDisplay(bank)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label>{t('account')}</Label>
        <Input
          value={twqrData.account}
          onChange={(e) => updateField('account', e.target.value)}
          placeholder="Account Number"
          className="font-mono text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label>{t('amount')}</Label>
        <Input
          type="number"
          value={twqrData.amount}
          onChange={(e) => updateField('amount', e.target.value)}
          placeholder="100"
        />
      </div>
    </div>
  )
})
