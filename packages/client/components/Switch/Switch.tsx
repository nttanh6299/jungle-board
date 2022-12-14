import { Switch as HSwitch } from '@headlessui/react'
import clsx from 'clsx'

type SwitchProps = {
  enabled: boolean
  toggle: (enabled: boolean) => void
}

const Switch = ({ enabled, toggle }: SwitchProps) => {
  return (
    <HSwitch
      checked={enabled}
      onChange={toggle}
      className={clsx(
        'relative flex items-center px-1 h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-1 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:outline-none',
        `${enabled ? 'bg-primary' : 'bg-placeholder'}`,
      )}
    >
      <span
        className={`${enabled ? 'translate-x-6' : 'translate-x-0'}
            pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white transition duration-200 ease-in-out`}
      />
    </HSwitch>
  )
}

export default Switch
