import clsx from 'clsx'

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  color?: 'player' | 'opponent'
}

const Avatar = ({ size, onClick, color }: AvatarProps) => {
  return (
    <div
      className={clsx('bg-primary rounded-full', {
        'border-player': !color || color === 'player',
        'border-opponent': color === 'opponent',
        'w-[40px] h-[40px] border-[2px]': size === 'sm',
        'w-[60px] h-[60px] border-[3px]': !size || size === 'md',
        'w-[80px] h-[80px] border-[4px]': size === 'lg',
      })}
      onClick={onClick}
    />
  )
}

export default Avatar
