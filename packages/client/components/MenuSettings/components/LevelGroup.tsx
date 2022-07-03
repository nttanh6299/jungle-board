import React from 'react'
import clsx from 'clsx'
import { SettingLevel } from 'store/settings'

const levelOptions: Utils.IOption<SettingLevel>[] = [
  {
    label: 'Low',
    value: 'low',
  },
  {
    label: 'Medium',
    value: 'medium',
  },
  {
    label: 'High',
    value: 'high',
  },
]

interface IToggleProps {
  value: string
  change: (value: string) => void
}

const Toggle: React.FC<IToggleProps> = ({ value, change }) => {
  return (
    <>
      {levelOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => change(option.value)}
          className={clsx('block p-2 sibling:ml-4', { 'bg-yellow-400': option.value === value })}
        >
          {option.label}
        </button>
      ))}
    </>
  )
}

export default Toggle
