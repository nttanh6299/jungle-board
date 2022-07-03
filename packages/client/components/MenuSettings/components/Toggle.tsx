import React from 'react'
import clsx from 'clsx'

interface IToggleProps {
  value: boolean
  change: (value: boolean) => void
}

const Toggle: React.FC<IToggleProps> = ({ value, change }) => {
  return (
    <>
      <button onClick={() => change(false)} className={clsx('block p-2 sibling:ml-4', { 'bg-yellow-400': !value })}>
        Off
      </button>
      <button onClick={() => change(true)} className={clsx('block p-2 sibling:ml-4', { 'bg-yellow-400': value })}>
        On
      </button>
    </>
  )
}

export default Toggle
