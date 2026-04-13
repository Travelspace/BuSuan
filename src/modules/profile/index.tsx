import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Input, useToast } from '../../components/common'
import { useAppStore } from '../../store'
import { SHICHEN_MAP } from '../bazi/utils/constants'
import { getProvinces, getCities } from './data/regions'
import type { BirthInfo, CalendarType, Gender } from '../../types'

const ProfileModule: React.FC = () => {
  const { birthInfo, setBirthInfo } = useAppStore()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [name, setName] = useState(birthInfo.name || '')
  const [calendar, setCalendar] = useState<CalendarType>(birthInfo.calendar)
  const [gender, setGender] = useState<Gender>(birthInfo.gender)
  const [dateStr, setDateStr] = useState(birthInfo.date || '')
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (birthInfo.location) {
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

  const provinces = getProvinces()
  const cities = province ? getCities(province) : []

  const handleProvinceChange = (p: string) => {
    setProvince(p)
    setCity('')
  }

  const handleSave = () => {
    if (!dateStr) return

    const location = province ? (city ? `${province} ${city}` : province) : ''

    const info: BirthInfo = {
      name: name.trim(),
      date: dateStr,
      calendar,
      gender,
      location,
    }
    setBirthInfo(info)
    setSaved(true)
    showToast('信息已保存', 'success')
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
        <h2 className="text-3xl font-serif text-gold mb-2">信息填写</h2>
        <p className="text-text-secondary">录入个人信息，各功能模块将自动读取</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card hover={false}>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave() }}>
            <Input
              label="姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入姓名（可选）"
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-text-primary text-sm font-medium mb-2">日历类型</label>
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
                    公历
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
                    农历
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-text-primary text-sm font-medium mb-2">性别</label>
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
                    男
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
                    女
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-text-primary text-sm font-medium mb-2">
                出生日期时间
                <span className="text-text-muted text-xs ml-2">
                  {calendar === 'solar' ? '(公历)' : '(农历)'}
                </span>
              </label>
              <input
                type="datetime-local"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full bg-bg-secondary/50 border border-white/10 rounded-button px-4 py-2 text-text-primary focus:border-gold focus:outline-none transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-text-primary text-sm font-medium mb-2">
                出生地点
                <span className="text-text-muted text-xs ml-2">可选，用于真太阳时校正</span>
              </label>
              <div className="flex gap-3">
                <select
                  value={province}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="flex-1 bg-bg-secondary/50 border border-white/10 rounded-button px-3 py-2 text-text-primary focus:border-gold focus:outline-none transition-all duration-300 appearance-none"
                >
                  <option value="">选择省份</option>
                  {provinces.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="flex-1 bg-bg-secondary/50 border border-white/10 rounded-button px-3 py-2 text-text-primary focus:border-gold focus:outline-none transition-all duration-300 appearance-none"
                  disabled={!province}
                >
                  <option value="">选择城市</option>
                  {cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1"
                disabled={!isFormValid}
              >
                {saved ? '✓ 已保存' : '保存信息'}
              </Button>
            </div>

            {isFormValid && (
              <div className="border-t border-gold/10 pt-4 space-y-3">
                <p className="text-text-secondary text-sm">保存后快速开始：</p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={handleStartBazi}
                  >
                    八字排盘
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={handleStartZiwei}
                  >
                    紫微斗数
                  </Button>
                </div>
              </div>
            )}

            <div className="border-t border-gold/10 pt-4">
              <p className="text-text-muted text-xs mb-2">时辰对照表：</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                {SHICHEN_MAP.map((item) => (
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
            <h3 className="text-lg font-serif text-gold mb-4">已保存的信息</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {birthInfo.name && (
                <div>
                  <span className="text-text-muted">姓名</span>
                  <div className="text-text-primary">{birthInfo.name}</div>
                </div>
              )}
              <div>
                <span className="text-text-muted">性别</span>
                <div className="text-text-primary">{birthInfo.gender === 'male' ? '男' : '女'}</div>
              </div>
              <div>
                <span className="text-text-muted">日历类型</span>
                <div className="text-text-primary">{birthInfo.calendar === 'solar' ? '公历' : '农历'}</div>
              </div>
              <div>
                <span className="text-text-muted">出生时间</span>
                <div className="text-text-primary">{birthInfo.date.replace('T', ' ')}</div>
              </div>
              {birthInfo.location && (
                <div>
                  <span className="text-text-muted">出生地点</span>
                  <div className="text-text-primary">{birthInfo.location}</div>
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
