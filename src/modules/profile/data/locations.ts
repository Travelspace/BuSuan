// 位置数据
// - 中国地区: 使用 true-solar-time 库内置数据 (含经度, 标准经线 120°, 时区 Asia/Shanghai)
// - 海外城市: 库未提供海外数据, 此处补充经度与 IANA 时区, 用于夏令时处理
//
// 显示: 内部统一用中文名作为语言无关的 key (select value / 持久化);
//       展示层根据语言切换为中文或英文/拼音。

import cnchar from 'cnchar'
import { getChinaRegions, type SolarRegion } from 'true-solar-time'

export type Lang = 'zh-CN' | 'en-US'

export interface IntlCityLocation {
  name: string
  nameEn: string
  longitude: number
  timezone: string
}

export interface CountryData {
  name: string
  nameEn: string
  cities: IntlCityLocation[]
}

export const CHINA_TIMEZONE_VALUE = 'Asia/Shanghai'

// 34 个省级行政区 (简体)
// 库内置数据包含繁体重复项 (如 重慶/重庆), 此处仅保留简体以避免下拉重复
const SIMPLIFIED_PROVINCES = new Set([
  '北京', '上海', '天津', '重庆', '香港', '澳门',
  '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江',
  '江苏', '浙江', '安徽', '福建', '江西', '山东',
  '河南', '湖北', '湖南', '广东', '海南', '广西',
  '四川', '贵州', '云南', '西藏', '陕西', '甘肃',
  '青海', '宁夏', '新疆', '台湾',
])

// ============ 显示用英文名映射 ============

// 34 个省级行政区标准英文名 (避免 cnchar 多音字错误, 如 重庆/陕西/西藏)
const PROVINCE_EN: Record<string, string> = {
  '北京': 'Beijing', '上海': 'Shanghai', '天津': 'Tianjin', '重庆': 'Chongqing',
  '香港': 'Hong Kong', '澳门': 'Macao', '河北': 'Hebei', '山西': 'Shanxi',
  '内蒙古': 'Inner Mongolia', '辽宁': 'Liaoning', '吉林': 'Jilin', '黑龙江': 'Heilongjiang',
  '江苏': 'Jiangsu', '浙江': 'Zhejiang', '安徽': 'Anhui', '福建': 'Fujian',
  '江西': 'Jiangxi', '山东': 'Shandong', '河南': 'Henan', '湖北': 'Hubei',
  '湖南': 'Hunan', '广东': 'Guangdong', '海南': 'Hainan', '广西': 'Guangxi',
  '四川': 'Sichuan', '贵州': 'Guizhou', '云南': 'Yunnan', '西藏': 'Tibet',
  '陕西': 'Shaanxi', '甘肃': 'Gansu', '青海': 'Qinghai', '宁夏': 'Ningxia',
  '新疆': 'Xinjiang', '台湾': 'Taiwan',
}

// 主要城市英文名 (省会/大城市, 含多音字修正如 重庆/厦门/拉萨/哈尔滨)
const CITY_EN: Record<string, string> = {
  '北京': 'Beijing', '上海': 'Shanghai', '天津': 'Tianjin', '重庆': 'Chongqing',
  '香港': 'Hong Kong', '澳门': 'Macao',
  '石家庄': 'Shijiazhuang', '唐山': 'Tangshan', '保定': 'Baoding',
  '太原': 'Taiyuan', '大同': 'Datong',
  '呼和浩特': 'Hohhot', '包头': 'Baotou',
  '沈阳': 'Shenyang', '大连': 'Dalian', '鞍山': 'Anshan',
  '长春': 'Changchun', '吉林': 'Jilin',
  '哈尔滨': 'Harbin', '齐齐哈尔': 'Qiqihar',
  '南京': 'Nanjing', '苏州': 'Suzhou', '无锡': 'Wuxi', '常州': 'Changzhou',
  '徐州': 'Xuzhou', '南通': 'Nantong',
  '杭州': 'Hangzhou', '宁波': 'Ningbo', '温州': 'Wenzhou',
  '合肥': 'Hefei', '芜湖': 'Wuhu',
  '福州': 'Fuzhou', '厦门': 'Xiamen', '泉州': 'Quanzhou',
  '南昌': 'Nanchang', '九江': 'Jiujiang',
  '济南': 'Jinan', '青岛': 'Qingdao', '烟台': 'Yantai', '威海': 'Weihai',
  '郑州': 'Zhengzhou', '洛阳': 'Luoyang',
  '武汉': 'Wuhan', '宜昌': 'Yichang',
  '长沙': 'Changsha', '株洲': 'Zhuzhou',
  '广州': 'Guangzhou', '深圳': 'Shenzhen', '佛山': 'Foshan', '东莞': 'Dongguan',
  '珠海': 'Zhuhai', '汕头': 'Shantou',
  '南宁': 'Nanning', '桂林': 'Guilin', '柳州': 'Liuzhou',
  '海口': 'Haikou', '三亚': 'Sanya',
  '成都': 'Chengdu', '绵阳': 'Mianyang',
  '贵阳': 'Guiyang', '遵义': 'Zunyi',
  '昆明': 'Kunming', '大理': 'Dali', '曲靖': 'Qujing',
  '拉萨': 'Lhasa', '日喀则': 'Shigatse',
  '西安': "Xi'an", '宝鸡': 'Baoji',
  '兰州': 'Lanzhou', '天水': 'Tianshui',
  '西宁': 'Xining',
  '银川': 'Yinchuan',
  '乌鲁木齐': 'Urumqi', '喀什': 'Kashgar',
  '台北': 'Taipei', '高雄': 'Kaohsiung', '台中': 'Taichung', '台南': 'Tainan',
}

// 海外国家英文名
const COUNTRY_EN: Record<string, string> = {
  '美国': 'United States', '加拿大': 'Canada', '英国': 'United Kingdom',
  '法国': 'France', '德国': 'Germany', '意大利': 'Italy', '荷兰': 'Netherlands',
  '西班牙': 'Spain', '俄罗斯': 'Russia', '澳大利亚': 'Australia', '新西兰': 'New Zealand',
  '日本': 'Japan', '韩国': 'South Korea', '新加坡': 'Singapore', '马来西亚': 'Malaysia',
  '泰国': 'Thailand', '越南': 'Vietnam', '印度尼西亚': 'Indonesia', '菲律宾': 'Philippines',
  '印度': 'India', '巴西': 'Brazil', '阿根廷': 'Argentina', '墨西哥': 'Mexico',
  '南非': 'South Africa', '阿联酋': 'United Arab Emirates', '土耳其': 'Turkey',
}

// ============ 海外城市数据 (库未提供海外数据, 此处补充) ============

export const INTERNATIONAL_COUNTRIES: CountryData[] = [
  { name: '美国', nameEn: 'United States', cities: [
    { name: '纽约', nameEn: 'New York', longitude: -74.01, timezone: 'America/New_York' },
    { name: '洛杉矶', nameEn: 'Los Angeles', longitude: -118.24, timezone: 'America/Los_Angeles' },
    { name: '旧金山', nameEn: 'San Francisco', longitude: -122.42, timezone: 'America/Los_Angeles' },
    { name: '西雅图', nameEn: 'Seattle', longitude: -122.33, timezone: 'America/Los_Angeles' },
    { name: '芝加哥', nameEn: 'Chicago', longitude: -87.63, timezone: 'America/Chicago' },
    { name: '休斯顿', nameEn: 'Houston', longitude: -95.37, timezone: 'America/Chicago' },
    { name: '达拉斯', nameEn: 'Dallas', longitude: -96.80, timezone: 'America/Chicago' },
    { name: '波士顿', nameEn: 'Boston', longitude: -71.06, timezone: 'America/New_York' },
    { name: '华盛顿', nameEn: 'Washington', longitude: -77.04, timezone: 'America/New_York' },
    { name: '费城', nameEn: 'Philadelphia', longitude: -75.17, timezone: 'America/New_York' },
    { name: '亚特兰大', nameEn: 'Atlanta', longitude: -84.39, timezone: 'America/New_York' },
    { name: '迈阿密', nameEn: 'Miami', longitude: -80.19, timezone: 'America/New_York' },
    { name: '丹佛', nameEn: 'Denver', longitude: -104.99, timezone: 'America/Denver' },
    { name: '凤凰城', nameEn: 'Phoenix', longitude: -112.07, timezone: 'America/Phoenix' },
    { name: '波特兰', nameEn: 'Portland', longitude: -122.68, timezone: 'America/Los_Angeles' },
    { name: '底特律', nameEn: 'Detroit', longitude: -83.05, timezone: 'America/Detroit' },
  ]},
  { name: '加拿大', nameEn: 'Canada', cities: [
    { name: '多伦多', nameEn: 'Toronto', longitude: -79.38, timezone: 'America/Toronto' },
    { name: '温哥华', nameEn: 'Vancouver', longitude: -123.12, timezone: 'America/Vancouver' },
    { name: '蒙特利尔', nameEn: 'Montreal', longitude: -73.57, timezone: 'America/Montreal' },
    { name: '卡尔加里', nameEn: 'Calgary', longitude: -114.07, timezone: 'America/Edmonton' },
    { name: '渥太华', nameEn: 'Ottawa', longitude: -75.70, timezone: 'America/Toronto' },
  ]},
  { name: '英国', nameEn: 'United Kingdom', cities: [
    { name: '伦敦', nameEn: 'London', longitude: -0.13, timezone: 'Europe/London' },
    { name: '曼彻斯特', nameEn: 'Manchester', longitude: -2.24, timezone: 'Europe/London' },
    { name: '爱丁堡', nameEn: 'Edinburgh', longitude: -3.19, timezone: 'Europe/London' },
  ]},
  { name: '法国', nameEn: 'France', cities: [
    { name: '巴黎', nameEn: 'Paris', longitude: 2.35, timezone: 'Europe/Paris' },
  ]},
  { name: '德国', nameEn: 'Germany', cities: [
    { name: '柏林', nameEn: 'Berlin', longitude: 13.41, timezone: 'Europe/Berlin' },
    { name: '慕尼黑', nameEn: 'Munich', longitude: 11.58, timezone: 'Europe/Berlin' },
    { name: '法兰克福', nameEn: 'Frankfurt', longitude: 8.68, timezone: 'Europe/Berlin' },
  ]},
  { name: '意大利', nameEn: 'Italy', cities: [
    { name: '罗马', nameEn: 'Rome', longitude: 12.50, timezone: 'Europe/Rome' },
    { name: '米兰', nameEn: 'Milan', longitude: 9.19, timezone: 'Europe/Rome' },
  ]},
  { name: '荷兰', nameEn: 'Netherlands', cities: [
    { name: '阿姆斯特丹', nameEn: 'Amsterdam', longitude: 4.90, timezone: 'Europe/Amsterdam' },
  ]},
  { name: '西班牙', nameEn: 'Spain', cities: [
    { name: '马德里', nameEn: 'Madrid', longitude: -3.70, timezone: 'Europe/Madrid' },
    { name: '巴塞罗那', nameEn: 'Barcelona', longitude: 2.17, timezone: 'Europe/Madrid' },
  ]},
  { name: '俄罗斯', nameEn: 'Russia', cities: [
    { name: '莫斯科', nameEn: 'Moscow', longitude: 37.62, timezone: 'Europe/Moscow' },
    { name: '圣彼得堡', nameEn: 'St. Petersburg', longitude: 30.31, timezone: 'Europe/Moscow' },
  ]},
  { name: '澳大利亚', nameEn: 'Australia', cities: [
    { name: '悉尼', nameEn: 'Sydney', longitude: 151.21, timezone: 'Australia/Sydney' },
    { name: '墨尔本', nameEn: 'Melbourne', longitude: 144.96, timezone: 'Australia/Melbourne' },
    { name: '布里斯班', nameEn: 'Brisbane', longitude: 153.03, timezone: 'Australia/Brisbane' },
    { name: '珀斯', nameEn: 'Perth', longitude: 115.86, timezone: 'Australia/Perth' },
  ]},
  { name: '新西兰', nameEn: 'New Zealand', cities: [
    { name: '奥克兰', nameEn: 'Auckland', longitude: 174.76, timezone: 'Pacific/Auckland' },
    { name: '惠灵顿', nameEn: 'Wellington', longitude: 174.78, timezone: 'Pacific/Auckland' },
  ]},
  { name: '日本', nameEn: 'Japan', cities: [
    { name: '东京', nameEn: 'Tokyo', longitude: 139.69, timezone: 'Asia/Tokyo' },
    { name: '大阪', nameEn: 'Osaka', longitude: 135.50, timezone: 'Asia/Tokyo' },
  ]},
  { name: '韩国', nameEn: 'South Korea', cities: [
    { name: '首尔', nameEn: 'Seoul', longitude: 126.98, timezone: 'Asia/Seoul' },
    { name: '釜山', nameEn: 'Busan', longitude: 129.08, timezone: 'Asia/Seoul' },
  ]},
  { name: '新加坡', nameEn: 'Singapore', cities: [
    { name: '新加坡', nameEn: 'Singapore', longitude: 103.85, timezone: 'Asia/Singapore' },
  ]},
  { name: '马来西亚', nameEn: 'Malaysia', cities: [
    { name: '吉隆坡', nameEn: 'Kuala Lumpur', longitude: 101.69, timezone: 'Asia/Kuala_Lumpur' },
    { name: '槟城', nameEn: 'Penang', longitude: 100.33, timezone: 'Asia/Kuala_Lumpur' },
  ]},
  { name: '泰国', nameEn: 'Thailand', cities: [
    { name: '曼谷', nameEn: 'Bangkok', longitude: 100.50, timezone: 'Asia/Bangkok' },
  ]},
  { name: '越南', nameEn: 'Vietnam', cities: [
    { name: '河内', nameEn: 'Hanoi', longitude: 105.85, timezone: 'Asia/Ho_Chi_Minh' },
    { name: '胡志明市', nameEn: 'Ho Chi Minh City', longitude: 106.63, timezone: 'Asia/Ho_Chi_Minh' },
  ]},
  { name: '印度尼西亚', nameEn: 'Indonesia', cities: [
    { name: '雅加达', nameEn: 'Jakarta', longitude: 106.85, timezone: 'Asia/Jakarta' },
  ]},
  { name: '菲律宾', nameEn: 'Philippines', cities: [
    { name: '马尼拉', nameEn: 'Manila', longitude: 120.98, timezone: 'Asia/Manila' },
  ]},
  { name: '印度', nameEn: 'India', cities: [
    { name: '新德里', nameEn: 'New Delhi', longitude: 77.21, timezone: 'Asia/Kolkata' },
    { name: '孟买', nameEn: 'Mumbai', longitude: 72.88, timezone: 'Asia/Kolkata' },
    { name: '班加罗尔', nameEn: 'Bangalore', longitude: 77.59, timezone: 'Asia/Kolkata' },
  ]},
  { name: '巴西', nameEn: 'Brazil', cities: [
    { name: '圣保罗', nameEn: 'São Paulo', longitude: -46.63, timezone: 'America/Sao_Paulo' },
    { name: '里约热内卢', nameEn: 'Rio de Janeiro', longitude: -43.20, timezone: 'America/Sao_Paulo' },
  ]},
  { name: '阿根廷', nameEn: 'Argentina', cities: [
    { name: '布宜诺斯艾利斯', nameEn: 'Buenos Aires', longitude: -58.38, timezone: 'America/Argentina/Buenos_Aires' },
  ]},
  { name: '墨西哥', nameEn: 'Mexico', cities: [
    { name: '墨西哥城', nameEn: 'Mexico City', longitude: -99.13, timezone: 'America/Mexico_City' },
  ]},
  { name: '南非', nameEn: 'South Africa', cities: [
    { name: '约翰内斯堡', nameEn: 'Johannesburg', longitude: 28.04, timezone: 'Africa/Johannesburg' },
    { name: '开普敦', nameEn: 'Cape Town', longitude: 18.42, timezone: 'Africa/Johannesburg' },
  ]},
  { name: '阿联酋', nameEn: 'United Arab Emirates', cities: [
    { name: '迪拜', nameEn: 'Dubai', longitude: 55.27, timezone: 'Asia/Dubai' },
  ]},
  { name: '土耳其', nameEn: 'Turkey', cities: [
    { name: '伊斯坦布尔', nameEn: 'Istanbul', longitude: 28.98, timezone: 'Europe/Istanbul' },
  ]},
]

// ============ 中国地区 (来自 true-solar-time 库) ============

let _chinaRegionsCache: SolarRegion[] | null = null
function chinaRegions(): SolarRegion[] {
  if (!_chinaRegionsCache) {
    _chinaRegionsCache = getChinaRegions().filter(r => SIMPLIFIED_PROVINCES.has(r.province))
  }
  return _chinaRegionsCache
}

export function getChinaProvinces(): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const r of chinaRegions()) {
    if (!seen.has(r.province)) {
      seen.add(r.province)
      result.push(r.province)
    }
  }
  return result
}

export function getChinaCities(province: string): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const r of chinaRegions()) {
    if (r.province === province && !seen.has(r.city)) {
      seen.add(r.city)
      result.push(r.city)
    }
  }
  return result
}

export function getChinaCityLongitude(province: string, city: string): number | undefined {
  return chinaRegions().find(r => r.province === province && r.city === city)?.longitude
}

// ============ 海外查询函数 ============

export function getInternationalCountries(): string[] {
  return INTERNATIONAL_COUNTRIES.map(c => c.name)
}

export function getInternationalCities(country: string): string[] {
  return INTERNATIONAL_COUNTRIES.find(c => c.name === country)?.cities.map(c => c.name) || []
}

export function getInternationalCityLocation(country: string, city: string): { longitude: number; timezone: string } | undefined {
  const countryData = INTERNATIONAL_COUNTRIES.find(c => c.name === country)
  if (!countryData) return undefined
  const cityData = countryData.cities.find(c => c.name === city)
  if (!cityData) return undefined
  return { longitude: cityData.longitude, timezone: cityData.timezone }
}

// ============ 显示名 (按语言) ============

// 中国城市拼音 (cnchar + 主要城市修正表), 带缓存
const _pinyinCache = new Map<string, string>()
function cityPinyin(zh: string): string {
  const cached = _pinyinCache.get(zh)
  if (cached) return cached
  let py = CITY_EN[zh]
  if (!py) {
    // cnchar.spell('up') 返回全大写无空格字符串, 转为首字母大写
    const up = String(cnchar.spell(zh, 'up'))
    py = up ? (up.charAt(0) + up.slice(1).toLowerCase()) : zh
  }
  _pinyinCache.set(zh, py)
  return py
}

/** 省份显示名 */
export function provinceLabel(name: string, lang: Lang): string {
  if (lang === 'en-US') return PROVINCE_EN[name] || name
  return name
}

/** 中国城市显示名 (英文模式为拼音) */
export function chinaCityLabel(name: string, lang: Lang): string {
  if (lang === 'en-US') return cityPinyin(name)
  return name
}

/** 国家显示名 */
export function countryLabel(name: string, lang: Lang): string {
  if (lang === 'en-US') return COUNTRY_EN[name] || name
  return name
}

/** 海外城市显示名 (英文模式为 nameEn) */
export function intlCityLabel(country: string, city: string, lang: Lang): string {
  if (lang === 'en-US') {
    const c = INTERNATIONAL_COUNTRIES.find(c => c.name === country)
    const cd = c?.cities.find(ci => ci.name === city)
    return cd?.nameEn || city
  }
  return city
}

/**
 * 将持久化的中文 location 字符串按语言格式化为显示文本
 * 格式: 中国 "省 市" / 海外 "国家 城市"
 */
export function formatLocation(locationStr: string, lang: Lang): string {
  if (!locationStr) return ''
  if (lang === 'zh-CN') return locationStr
  const parts = locationStr.split(' ')
  if (parts.length >= 2) {
    const a = parts[0]
    const b = parts.slice(1).join(' ')
    if (PROVINCE_EN[a]) return `${PROVINCE_EN[a]} ${cityPinyin(b)}`
    if (COUNTRY_EN[a]) {
      const c = INTERNATIONAL_COUNTRIES.find(c => c.name === a)
      const cd = c?.cities.find(ci => ci.name === b)
      return `${COUNTRY_EN[a]} ${cd?.nameEn || b}`
    }
  }
  return locationStr
}
