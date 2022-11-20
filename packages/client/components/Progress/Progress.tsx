import clsx from 'clsx'

type ProgressProps = {
  percent: number
  color: 'primary' | 'cred' | 'corange' | 'disabled'
}

const Progress = ({ percent, color }: ProgressProps) => {
  return (
    <div
      className={clsx('w-full rounded-full h-[8px] transition-[background-color]', {
        'bg-primary/25': color === 'primary',
        'bg-cred/25': color === 'cred',
        'bg-corange/25': color === 'corange',
        'bg-disabled/25': color === 'disabled',
      })}
    >
      <div
        className={clsx('bg-${color} h-[8px] rounded-full', {
          'bg-primary': color === 'primary',
          'bg-cred': color === 'cred',
          'bg-corange': color === 'corange',
          'bg-disabled': color === 'disabled',
        })}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  )
}

export default Progress
