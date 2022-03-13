import React from 'react'
import clsx from 'clsx'
import styles from '../menuSettings.module.scss'

interface IToggleProps {
  value: boolean
  change: (value: boolean) => void
}

const Toggle: React.FC<IToggleProps> = ({ value, change }) => {
  return (
    <>
      <button onClick={() => change(false)} className={clsx([styles.item], { [styles.selected]: !value })}>
        Off
      </button>
      <button onClick={() => change(true)} className={clsx([styles.item], { [styles.selected]: value })}>
        On
      </button>
    </>
  )
}

export default Toggle
