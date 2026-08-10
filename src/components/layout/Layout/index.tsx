import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header'
import { useTranslation } from '../../../i18n'

const Layout: React.FC = () => {
  const t = useTranslation()

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-gold/20 py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-text-muted text-sm">
            {t.FOOTER_UI.disclaimer}
          </p>
          <p className="text-text-muted text-xs mt-2">
            {t.FOOTER_UI.rational}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
