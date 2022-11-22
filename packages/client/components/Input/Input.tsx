import clsx from 'clsx'
import { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
}

function Input({
  id,
  name,
  placeholder,
  onChange,
  onBlur,
  value,
  disabled,
  readOnly,
  error = '',
  className = '',
  ...props
}: InputProps) {
  return (
    <input
      className={clsx(
        'w-full rounded-lg text-sm text-textPrimary placeholder:text-placeholder border border-placeholder px-4 py-3 outline-none',
        {
          [className]: !!className,
          'border-red-500': !!error,
          'bg-slate-50': disabled,
        },
      )}
      placeholder={placeholder}
      name={name}
      id={id}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      disabled={disabled}
      readOnly={readOnly}
      {...props}
    />
  )
}

export default Input
