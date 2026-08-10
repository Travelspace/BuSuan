import React, { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  UserCircle,
  Calendar,
  Hash,
  Sparkles,
  User,
  Compass,
  Hexagon,
  Languages
} from 'lucide-react'
import { useAppStore } from '../../../store'
import { useTranslation } from '../../../i18n'
import type { ModuleType } from '../../../types'

const Header: React.FC = () => {
  const { activeModule, setActiveModule, language, setLanguage } = useAppStore()
  const location = useLocation()
  const t = useTranslation()

  useEffect(() => {
    const path = location.pathname.replace(/^\/BuSuan\//, '').replace(/^\//, '') || 'profile'
    const modulePath = NAV_ITEMS.find(item => item.path === path)?.path
    if (modulePath && modulePath !== activeModule) {
      setActiveModule(modulePath)
    }
  }, [location.pathname, activeModule, setActiveModule])

  const navItems = NAV_ITEMS

  const toggleLanguage = () => {
    setLanguage(language === 'zh-CN' ? 'en-US' : 'zh-CN')
  }

  return (
    <header className="bg-bg-secondary/80 backdrop-blur-sm border-b border-gold/20 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
              <span className="text-bg-primary font-serif text-xl font-bold">卜</span>
            </div>
            <div>
              <h1 className="text-xl font-serif text-gold">BuSuan</h1>
              <p className="text-xs text-text-muted">传统命理研究工具</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={`/${item.path}`}
                onClick={() => setActiveModule(item.path)}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-button transition-all duration-300 ${
                    isActive
                      ? 'bg-gold text-bg-primary'
                      : 'text-text-secondary hover:text-gold hover:bg-gold/10'
                  }`
                }
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleLanguage}
              title={t.HEADER_UI.langSwitchTitle}
              className="flex items-center justify-center w-9 h-9 rounded-button border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
              aria-label={t.HEADER_UI.langSwitchTitle}
            >
              <Languages size={18} />
              <span className="ml-1 text-xs font-medium">
                {language === 'zh-CN' ? 'EN' : '中'}
              </span>
            </button>

            <div className="lg:hidden">
              <MobileNav navItems={navItems} setActiveModule={setActiveModule} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

const NAV_ITEMS: { path: ModuleType; icon: React.ReactNode; label: string }[] = [
  { path: 'profile', icon: <UserCircle size={20} />, label: '信息' },
  { path: 'bazi', icon: <Hexagon size={20} />, label: '八字' },
  { path: 'ziwei', icon: <Sparkles size={20} />, label: '紫微' },
  { path: 'fortune', icon: <Compass size={20} />, label: '运势' },
  { path: 'name', icon: <User size={20} />, label: '姓名' },
  { path: 'calendar', icon: <Calendar size={20} />, label: '黄历' },
  { path: 'liuyao', icon: <Hash size={20} />, label: '六爻' },
]

interface MobileNavProps {
  navItems: { path: ModuleType; icon: React.ReactNode; label: string }[]
  setActiveModule: (module: ModuleType) => void
}

const MobileNav: React.FC<MobileNavProps> = ({ navItems, setActiveModule }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-text-secondary hover:text-gold transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-bg-card rounded-card shadow-card-hover border border-gold/20 animate-fade-in">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={`/${item.path}`}
              onClick={() => {
                setActiveModule(item.path)
                setIsOpen(false)
              }}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-4 py-3 transition-all duration-300 ${
                  isActive
                    ? 'bg-gold/10 text-gold'
                    : 'text-text-secondary hover:text-gold hover:bg-gold/5'
                }`
              }
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default Header
