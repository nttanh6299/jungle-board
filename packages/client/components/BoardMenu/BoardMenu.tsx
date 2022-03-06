import Show from 'components/Show'
import React from 'react'
import styles from './boardMenu.module.scss'

export type MenuType = 'cooldown' | 'menu'

interface IBoardMenuProps {
  menuType: MenuType
  cooldown?: number
  visible: boolean
  setVisible?: () => void
}

const BoardMenu: React.FC<IBoardMenuProps> = ({ menuType, cooldown, visible }) => {

  if (!visible) return null

  return (
    <div className={styles.container}>
      <Show when={menuType === 'cooldown'}>
        <div className={styles.cooldown}>
          {cooldown}
        </div>
      </Show>
    </div>
  )
}

export default BoardMenu
