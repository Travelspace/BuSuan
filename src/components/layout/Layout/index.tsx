import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header'

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-gold/20 py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-text-muted text-sm">
            本工具仅供个人学习与娱乐使用，命理分析结果仅供参考，不作为人生决策依据
          </p>
          <p className="text-text-muted text-xs mt-2">
            请理性对待传统文化，相信科学，积极向上
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
