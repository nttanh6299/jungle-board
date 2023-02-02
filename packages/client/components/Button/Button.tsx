import { PropsWithChildren, ReactNode } from 'react'
import clsx from 'clsx'
import Show from 'components/Show'

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
    'primary-filled': 'border border-primary bg-primary text-white shadow-tight shadow-primary/25 fill-primary',
    'secondary-filled':
      'border border-secondary bg-secondary text-white shadow-tight shadow-secondary/25 fill-secondary',
    'primary-outlined': 'border border-primary text-primary shadow-tight shadow-primary/25 fill-primary',
    'secondary-outlined': 'border border-secondary text-secondary shadow-tight shadow-secondary/25 fill-secondary',
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
  loading?: boolean
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
  loading,
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
      <Show when={loading}>
        <div className="h-[24px] flex justify-center items-center w-full">
          <svg
            aria-hidden="true"
            className="inline w-[16px] h-[16px] animate-spin fill-corange"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="white"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
              fillOpacity="0.5"
            />
          </svg>
        </div>
      </Show>
      <Show when={!loading}>
        {iconLeft && <span className="mr-3">{iconLeft}</span>}
        <span>{children}</span>
        {iconRight && <span className="ml-3">{iconRight}</span>}
      </Show>
    </button>
  )
}

export default Button
