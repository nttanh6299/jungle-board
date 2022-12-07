import React from 'react'

interface IGameMenuProps {
  visible: boolean
  setVisible?: () => void
}

const GameMenu: React.FC<IGameMenuProps> = ({ visible, children }) => {
  if (!visible) return null

  return <div className="w-full h-full bg-black/[.75] text-white flex flex-col items-center py-5 px-2">{children}</div>
}

export default GameMenu
