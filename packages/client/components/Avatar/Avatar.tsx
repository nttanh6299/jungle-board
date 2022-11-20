import clsx from 'clsx'

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const Avatar = ({ size, onClick }: AvatarProps) => {
  return (
    <div
      className={clsx('bg-primary border-cred rounded-full', {
        'w-[40px] h-[40px] border-[2px]': size === 'sm',
        'w-[60px] h-[60px] border-[3px]': !size || size === 'md',
        'w-[80px] h-[80px] border-[4px]': size === 'lg',
      })}
      onClick={onClick}
    />
  )
}

export default Avatar
