import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { ToastProvider } from './components/common/Toast'
import './assets/styles/globals.css'

const App: React.FC = () => {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  )
}

export default App
