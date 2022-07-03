import Show from 'components/Show'
import React from 'react'

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
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[700px] max-h-[500px] bg-black/[.75] text-white flex flex-col justify-center items-center">
      <Show when={menuType === 'cooldown'}>
        <div className="text-7xl">{children}</div>
      </Show>
      <Show when={menuType === 'end'}>{children}</Show>
    </div>
  )
}

export default BoardMenu
