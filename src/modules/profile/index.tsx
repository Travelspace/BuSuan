import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Input, useToast } from '../../components/common'
import { useAppStore } from '../../store'
import { useTranslation } from '../../i18n'
import {
  getChinaProvinces, getChinaCities, getChinaCityLongitude,
  getInternationalCountries, getInternationalCities, getInternationalCityLocation,
  provinceLabel, chinaCityLabel, countryLabel, intlCityLabel, formatLocation,
  CHINA_TIMEZONE_VALUE,
} from './data/locations'
import { getCorrectedSolarTime, formatCorrectionDetail } from '../../utils/trueSolarTime'
import type { BirthInfo, CalendarType, Gender } from '../../types'

type RegionType = 'china' | 'overseas'

const ProfileModule: React.FC = () => {
  const { birthInfo, setBirthInfo } = useAppStore()
  const language = useAppStore((s) => s.language)
  const navigate = useNavigate()
  const { showToast } = useToast()
  const t = useTranslation()

  const [name, setName] = useState(birthInfo.name || '')
  const [calendar, setCalendar] = useState<CalendarType>(birthInfo.calendar)
  const [gender, setGender] = useState<Gender>(birthInfo.gender)
  const [dateStr, setDateStr] = useState(birthInfo.date || '')
  const [regionType, setRegionType] = useState<RegionType>('china')
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [intlCity, setIntlCity] = useState('')
  const [saved, setSaved] = useState(false)
  const dateInputRef = useRef<HTMLInputElement>(null)

  /** 点击整个日期展示框（而非仅右侧日历图标）即可打开时间选择器 */
  const handleDateBoxClick = useCallback(() => {
    const el = dateInputRef.current
    if (!el) return
    const withPicker = el as HTMLInputElement & { showPicker?: () => void }
    if (typeof withPicker.showPicker === 'function') {
      try {
        withPicker.showPicker()
      } catch {
        el.focus()
      }
    } else {
      el.focus()
    }
  }, [])

  useEffect(() => {
    if (birthInfo.timezone && birthInfo.timezone !== CHINA_TIMEZONE_VALUE) {
      setRegionType('overseas')
      if (birthInfo.location) {
        const parts = birthInfo.location.split(' ')
        if (parts.length >= 2) {
          setCountry(parts[0])
          setIntlCity(parts.slice(1).join(' '))
        }
      }
    } else if (birthInfo.location) {
      setRegionType('china')
      const parts = birthInfo.location.split(' ')
      if (parts.length >= 2) {
        setProvince(parts[0])
        setCity(parts[1])
      } else if (parts.length === 1) {
        setProvince(parts[0])
        setCity('')
      }
    }
  }, [])

  const provinces = getChinaProvinces()
  const cities = province ? getChinaCities(province) : []
  const countries = getInternationalCountries()
  const intlCities = country ? getInternationalCities(country) : []

  const handleProvinceChange = (p: string) => {
    setProvince(p)
    setCity('')
  }

  const handleCountryChange = (c: string) => {
    setCountry(c)
    setIntlCity('')
  }

  // 计算当前选择的经度和时区
  function getCurrentLocationInfo(): { longitude?: number; timezone?: string; locationStr: string } {
    if (regionType === 'china') {
      if (city && province) {
        const lng = getChinaCityLongitude(province, city)
        return { longitude: lng, timezone: CHINA_TIMEZONE_VALUE, locationStr: `${province} ${city}` }
      }
      return { locationStr: province || '' }
    } else {
      if (intlCity && country) {
        const loc = getInternationalCityLocation(country, intlCity)
        return { longitude: loc?.longitude, timezone: loc?.timezone, locationStr: `${country} ${intlCity}` }
      }
      return { locationStr: country || '' }
    }
  }

  const locInfo = getCurrentLocationInfo()

  // 预览真太阳时校正
  let tstPreview: string | null = null
  if (dateStr && locInfo.longitude !== undefined && locInfo.timezone) {
    const result = getCorrectedSolarTime(dateStr, calendar, locInfo.longitude, locInfo.timezone)
    if (result.corrected && result.detail) {
      tstPreview = formatCorrectionDetail(result.detail, language)
    }
  }

  const handleSave = () => {
    if (!dateStr) return

    const info: BirthInfo = {
      name: name.trim(),
      date: dateStr,
      calendar,
      gender,
      location: locInfo.locationStr || undefined,
      longitude: locInfo.longitude,
      timezone: locInfo.timezone,
    }
    setBirthInfo(info)
    setSaved(true)
    showToast(t.PROFILE_UI.savedToast, 'success')
    setTimeout(() => setSaved(false), 2000)
  }

  const handleStartBazi = () => {
    handleSave()
    navigate('/bazi')
  }

  const handleStartZiwei = () => {
    handleSave()
    navigate('/ziwei')
  }

  const isFormValid = !!dateStr

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gold mb-2">{t.PROFILE_UI.title}</h2>
        <p className="text-text-secondary">{t.PROFILE_UI.subtitle}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card hover={false}>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave() }}>
            <Input
              label={t.PROFILE_UI.nameLabel}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.PROFILE_UI.namePlaceholder}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-text-primary text-sm font-medium mb-2">{t.PROFILE_UI.calendarTypeLabel}</label>
                <div className="flex rounded-button overflow-hidden border border-white/10">
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm font-medium transition-all duration-300 ${
                      calendar === 'solar'
                        ? 'bg-gold text-bg-primary'
                        : 'bg-transparent text-text-secondary hover:text-gold'
                    }`}
                    onClick={() => setCalendar('solar')}
                  >
                    {t.PROFILE_UI.solar}
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm font-medium transition-all duration-300 ${
                      calendar === 'lunar'
                        ? 'bg-gold text-bg-primary'
                        : 'bg-transparent text-text-secondary hover:text-gold'
                    }`}
                    onClick={() => setCalendar('lunar')}
                  >
                    {t.PROFILE_UI.lunar}
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-text-primary text-sm font-medium mb-2">{t.PROFILE_UI.genderLabel}</label>
                <div className="flex rounded-button overflow-hidden border border-white/10">
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm font-medium transition-all duration-300 ${
                      gender === 'male'
                        ? 'bg-gold text-bg-primary'
                        : 'bg-transparent text-text-secondary hover:text-gold'
                    }`}
                    onClick={() => setGender('male')}
                  >
                    {t.PROFILE_UI.male}
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm font-medium transition-all duration-300 ${
                      gender === 'female'
                        ? 'bg-gold text-bg-primary'
                        : 'bg-transparent text-text-secondary hover:text-gold'
                    }`}
                    onClick={() => setGender('female')}
                  >
                    {t.PROFILE_UI.female}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-text-primary text-sm font-medium mb-2">
                {t.PROFILE_UI.birthDatetimeLabel}
                <span className="text-text-muted text-xs ml-2">
                  ({calendar === 'solar' ? t.PROFILE_UI.solar : t.PROFILE_UI.lunar})
                </span>
              </label>
              <div
                onClick={handleDateBoxClick}
                className="relative cursor-pointer"
              >
                <input
                  ref={dateInputRef}
                  type="datetime-local"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full bg-bg-secondary/50 border border-white/10 rounded-button px-4 py-2 text-text-primary focus:border-gold focus:outline-none transition-all duration-300 cursor-pointer"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-text-primary text-sm font-medium mb-2">
                {t.PROFILE_UI.birthLocationLabel}
                <span className="text-text-muted text-xs ml-2">{t.PROFILE_UI.locationHint}</span>
              </label>

              {/* 国内 / 海外 切换 */}
              <div className="flex rounded-button overflow-hidden border border-white/10 mb-3">
                <button
                  type="button"
                  className={`flex-1 py-1.5 text-sm font-medium transition-all duration-300 ${
                    regionType === 'china'
                      ? 'bg-gold/20 text-gold'
                      : 'bg-transparent text-text-secondary hover:text-gold'
                  }`}
                  onClick={() => setRegionType('china')}
                >
                  {t.PROFILE_UI.regionChina}
                </button>
                <button
                  type="button"
                  className={`flex-1 py-1.5 text-sm font-medium transition-all duration-300 ${
                    regionType === 'overseas'
                      ? 'bg-gold/20 text-gold'
                      : 'bg-transparent text-text-secondary hover:text-gold'
                  }`}
                  onClick={() => setRegionType('overseas')}
                >
                  {t.PROFILE_UI.regionOverseas}
                </button>
              </div>

              {regionType === 'china' ? (
                <div className="flex gap-3">
                  <select
                    value={province}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="flex-1 bg-bg-secondary/50 border border-white/10 rounded-button px-3 py-2 text-text-primary focus:border-gold focus:outline-none transition-all duration-300 appearance-none"
                  >
                    <option value="">{t.PROFILE_UI.selectProvince}</option>
                    {provinces.map(p => (
                      <option key={p} value={p}>{provinceLabel(p, language)}</option>
                    ))}
                  </select>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="flex-1 bg-bg-secondary/50 border border-white/10 rounded-button px-3 py-2 text-text-primary focus:border-gold focus:outline-none transition-all duration-300 appearance-none"
                    disabled={!province}
                  >
                    <option value="">{t.PROFILE_UI.selectCity}</option>
                    {cities.map(c => (
                      <option key={c} value={c}>{chinaCityLabel(c, language)}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex gap-3">
                  <select
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="flex-1 bg-bg-secondary/50 border border-white/10 rounded-button px-3 py-2 text-text-primary focus:border-gold focus:outline-none transition-all duration-300 appearance-none"
                  >
                    <option value="">{t.PROFILE_UI.selectCountry}</option>
                    {countries.map(c => (
                      <option key={c} value={c}>{countryLabel(c, language)}</option>
                    ))}
                  </select>
                  <select
                    value={intlCity}
                    onChange={(e) => setIntlCity(e.target.value)}
                    className="flex-1 bg-bg-secondary/50 border border-white/10 rounded-button px-3 py-2 text-text-primary focus:border-gold focus:outline-none transition-all duration-300 appearance-none"
                    disabled={!country}
                  >
                    <option value="">{t.PROFILE_UI.selectCity}</option>
                    {intlCities.map(c => (
                      <option key={c} value={c}>{intlCityLabel(country, c, language)}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* 真太阳时校正预览 */}
              {tstPreview && (
                <div className="mt-2 px-3 py-2 bg-gold/5 border border-gold/20 rounded-button text-xs text-gold">
                  {tstPreview}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1"
                disabled={!isFormValid}
              >
                {saved ? t.PROFILE_UI.saved : t.PROFILE_UI.save}
              </Button>
            </div>

            {isFormValid && (
              <div className="border-t border-gold/10 pt-4 space-y-3">
                <p className="text-text-secondary text-sm">{t.PROFILE_UI.quickStart}</p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={handleStartBazi}
                  >
                    {t.MODULE_NAMES.bazi}
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={handleStartZiwei}
                  >
                    {t.MODULE_NAMES.ziwei}
                  </Button>
                </div>
              </div>
            )}

            <div className="border-t border-gold/10 pt-4">
              <p className="text-text-muted text-xs mb-2">{t.PROFILE_UI.shichenTableTitle}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                {t.SHICHEN_MAP.map((item) => (
                  <div
                    key={item.index}
                    className="text-xs text-text-secondary bg-bg-secondary/30 rounded px-2 py-1 flex justify-between"
                  >
                    <span>{item.label}</span>
                    <span className="text-text-muted">{item.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </Card>

        {birthInfo.date && (
          <Card hover={false} className="mt-6">
            <h3 className="text-lg font-serif text-gold mb-4">{t.PROFILE_UI.savedInfoTitle}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {birthInfo.name && (
                <div>
                  <span className="text-text-muted">{t.PROFILE_UI.nameLabel}</span>
                  <div className="text-text-primary">{birthInfo.name}</div>
                </div>
              )}
              <div>
                <span className="text-text-muted">{t.PROFILE_UI.genderLabel}</span>
                <div className="text-text-primary">{birthInfo.gender === 'male' ? t.PROFILE_UI.male : t.PROFILE_UI.female}</div>
              </div>
              <div>
                <span className="text-text-muted">{t.PROFILE_UI.calendarTypeLabel}</span>
                <div className="text-text-primary">{birthInfo.calendar === 'solar' ? t.PROFILE_UI.solar : t.PROFILE_UI.lunar}</div>
              </div>
              <div>
                <span className="text-text-muted">{t.PROFILE_UI.birthDatetimeLabel}</span>
                <div className="text-text-primary">{birthInfo.date.replace('T', ' ')}</div>
              </div>
              {birthInfo.location && (
                <div>
                  <span className="text-text-muted">{t.PROFILE_UI.birthLocationLabel}</span>
                  <div className="text-text-primary">{formatLocation(birthInfo.location, language)}</div>
                </div>
              )}
              {birthInfo.longitude !== undefined && birthInfo.timezone && (
                <div className="col-span-2">
                  <span className="text-text-muted">{t.PROFILE_UI.tstLabel}</span>
                  {(() => {
                    const result = getCorrectedSolarTime(
                      birthInfo.date, birthInfo.calendar,
                      birthInfo.longitude, birthInfo.timezone,
                    )
                    if (result.corrected && result.detail) {
                      return <div className="text-gold text-xs mt-1">{formatCorrectionDetail(result.detail, language)}</div>
                    }
                    return <div className="text-text-muted text-xs mt-1">{t.PROFILE_UI.tstNotApplied}</div>
                  })()}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ProfileModule
