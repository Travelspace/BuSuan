import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-text-primary text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-bg-secondary/50 border rounded-button px-4 py-2 text-text-primary placeholder-text-muted focus:outline-none transition-all duration-300 ${
          error ? 'border-red' : 'border-white/10 focus:border-gold'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-text-muted">{helperText}</p>
      )}
    </div>
  )
}

export default Input
