import clsx from 'clsx'
import React from 'react'

interface ButtonProps {
  onClick: () => void
  disabled?: boolean
  className?: string
}

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled, className }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx('px-6 py-3 text-2xl rounded-lg bg-slate-900 hover:bg-slate-800 text-white', className)}
    >
      {children}
    </button>
  )
}

export default Button
