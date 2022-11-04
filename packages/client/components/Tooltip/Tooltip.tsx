import clsx from 'clsx'
import { PropsWithChildren, useRef } from 'react'

type TooltipProps = PropsWithChildren<{
  title: string
  className?: string
}>

const Tooltip = ({ children, title, className }: TooltipProps) => {
  const tipRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    tipRef.current.style.opacity = '1'
  }

  const handleMouseLeave = () => {
    tipRef.current.style.opacity = '0'
  }

  return (
    <div className="relative inline-flex">
      <div
        className={clsx(
          'opacity-0 absolute w-max shadow-tight shadow-primary/25 -top-full left-1/2 -translate-x-1/2 text-white bg-primary px-3 py-2 text-xs rounded flex items-center transition-all duration-150',
          className,
        )}
        ref={tipRef}
      >
        <div className="bg-primary shadow-tight shadow-primary/25 h-2 w-2 absolute -bottom-1 left-1/2 rotate-45 -translate-x-1/2" />
        {title}
      </div>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
    </div>
  )
}

export default Tooltip
