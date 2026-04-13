import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setVisible(true)
      setAnimating(true)
    } else if (visible) {
      setAnimating(true)
      const timer = setTimeout(() => {
        setVisible(false)
        setAnimating(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    if (!visible) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [visible, onClose])

  if (!visible) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  const isEntering = isOpen && animating
  const isLeaving = !isOpen && animating

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <div
          className={`fixed inset-0 bg-black/60 transition-opacity duration-200 ${
            isLeaving ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={onClose}
        />
        
        <div
          className={`relative bg-bg-card rounded-card shadow-card-hover border border-gold/20 w-full ${sizes[size]} transition-all duration-200 ${
            isLeaving
              ? 'opacity-0 scale-95'
              : isEntering
              ? 'animate-fade-in-scale'
              : ''
          }`}
        >
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gold/20">
              <h3 className="text-xl font-serif text-gold">{title}</h3>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-gold transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          )}
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
