import clsx from 'clsx'
import { PropsWithChildren, ReactNode, useRef } from 'react'

type TooltipProps = PropsWithChildren<{
  title: ReactNode
  className?: string
  position?: 'top' | 'bottom'
  variant?: 'primary' | 'white'
}>

const Tooltip = ({ children, title, className, position, variant }: TooltipProps) => {
  const tipRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    tipRef.current.style.opacity = '1'
  }

  const handleMouseLeave = () => {
    tipRef.current.style.opacity = '0'
  }

  return (
    <div className="relative z-10">
      <div
        className={clsx(
          'opacity-0 absolute w-max left-1/2 -translate-x-1/2 px-3 py-2 text-xs rounded flex items-center transition-all duration-150',
          {
            'text-white bg-primary shadow-tight shadow-primary/25': !variant || variant === 'primary',
            'text-textPrimary bg-white': variant === 'white',
            '-top-full': !position || position === 'top',
            'top-full': position === 'bottom',
            [className]: !!className,
          },
        )}
        ref={tipRef}
      >
        <div
          className={clsx('bg-primary h-2 w-2 absolute left-1/2 -translate-x-1/2 rotate-45', {
            'bg-primary shadow-tight shadow-primary/25': !variant || variant === 'primary',
            'bg-white': variant === 'white',
            '-bottom-1': !position || position === 'top',
            '-top-1': position === 'bottom',
          })}
        />
        {title}
      </div>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
    </div>
  )
}

export default Tooltip
