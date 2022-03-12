import Show from 'components/Show'
import React from 'react'
import styles from './boardMenu.module.scss'

export type MenuType = 'cooldown' | 'menu' | 'end'

interface IBoardMenuProps {
  menuType: MenuType
  visible: boolean
  setVisible?: () => void
  endLabel?: string | React.ReactNode
}

const BoardMenu: React.FC<IBoardMenuProps> = ({ menuType, visible, children }) => {
  if (!visible) return null

  return (
    <div className={styles.container}>
      <Show when={menuType === 'cooldown'}>
        <div className={styles.cooldown}>{children}</div>
      </Show>
      <Show when={menuType === 'end'}>{children}</Show>
    </div>
  )
}

export default BoardMenu
