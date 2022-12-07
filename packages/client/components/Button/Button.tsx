import { PropsWithChildren, ReactNode } from 'react'
import clsx from 'clsx'

function generateButtonStyles({
  variant,
  type,
  size,
  disabled,
}: {
  variant: string
  type: string
  size: string
  disabled?: boolean
}) {
  const styles: Record<string, string> = {
    'primary-filled': 'border border-primary bg-primary text-white shadow-tight shadow-primary/25',
    'secondary-filled': 'border border-secondary bg-secondary text-white shadow-tight shadow-secondary/25',
    'primary-outlined': 'border border-primary text-primary shadow-tight shadow-primary/25',
    'secondary-outlined': 'border border-secondary text-secondary shadow-tight shadow-secondary/25',
    default: '',
  }
  const disabledStyles = {
    filled: 'border-placeholder bg-placeholder text-disabled shadow-placeholder/25',
    outlined: 'border border-disabled text-disabled shadow-placeholder/25',
    default: '',
  }
  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }
  const buttonStyles = styles[`${variant}-${type}`] || styles['default']
  const buttonDisabledStyles = disabled ? disabledStyles[type] : ''
  const buttonSizeStyles = sizeStyles[size] || sizeStyles.md
  return [buttonStyles, buttonDisabledStyles, buttonSizeStyles].filter(Boolean).join(' ')
}

type ButtonProps = PropsWithChildren<{
  variant?: 'primary' | 'secondary' | 'custom'
  type?: 'filled' | 'outlined'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  rounded?: boolean
  className?: string
  uppercase?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  onClick?: () => void
}>

const Button = ({
  children,
  iconLeft,
  iconRight,
  disabled,
  rounded,
  uppercase,
  className,
  onClick,
  variant = 'primary',
  type = 'filled',
  size = 'md',
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx('flex items-center transition duration-200 active:shadow-none', {
        'rounded-xl font-bold px-5 py-2': variant !== 'custom',
        '!rounded-full': rounded,
        uppercase: uppercase,
        [generateButtonStyles({ variant, type, disabled, size })]: true,
        [className]: !!className,
      })}
    >
      {iconLeft && <span className="mr-3">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className="ml-3">{iconRight}</span>}
    </button>
  )
}

export default Button
