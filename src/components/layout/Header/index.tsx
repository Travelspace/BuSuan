import React, { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  UserCircle, 
  Calendar, 
  Hash, 
  Sparkles, 
  User, 
  Compass, 
  Hexagon 
} from 'lucide-react'
import { useAppStore } from '../../../store'
import { MODULE_NAMES } from '../../../utils/constants'
import type { ModuleType } from '../../../types'

const NAV_ITEMS: { path: ModuleType; icon: React.ReactNode; label: string }[] = [
  { path: 'profile', icon: <UserCircle size={20} />, label: MODULE_NAMES.profile },
  { path: 'bazi', icon: <Hexagon size={20} />, label: MODULE_NAMES.bazi },
  { path: 'ziwei', icon: <Sparkles size={20} />, label: MODULE_NAMES.ziwei },
  { path: 'fortune', icon: <Compass size={20} />, label: MODULE_NAMES.fortune },
  { path: 'name', icon: <User size={20} />, label: MODULE_NAMES.name },
  { path: 'calendar', icon: <Calendar size={20} />, label: MODULE_NAMES.calendar },
  { path: 'liuyao', icon: <Hash size={20} />, label: MODULE_NAMES.liuyao },
]

const Header: React.FC = () => {
  const { activeModule, setActiveModule } = useAppStore()
  const location = useLocation()

  useEffect(() => {
    const path = location.pathname.replace(/^\/BuSuan\//, '').replace(/^\//, '') || 'profile'
    const modulePath = NAV_ITEMS.find(item => item.path === path)?.path
    if (modulePath && modulePath !== activeModule) {
      setActiveModule(modulePath)
    }
  }, [location.pathname, activeModule, setActiveModule])

  const navItems = NAV_ITEMS

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
              <p className="text-xs text-text-muted">传统命理文化研究工具</p>
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

          <div className="lg:hidden">
            <MobileNav navItems={navItems} setActiveModule={setActiveModule} />
          </div>
        </div>
      </div>
    </header>
  )
}

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
