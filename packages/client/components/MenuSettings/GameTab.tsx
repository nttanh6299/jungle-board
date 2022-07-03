import React from 'react'
import { useSettingsStore } from 'store/settings'
import Toggle from './components/Toggle'

const GameTab: React.FC = () => {
  const { game, onSetTutorials } = useSettingsStore((state) => ({
    game: state.game,
    onSetTutorials: state.actions.onSetTutorials,
  }))

  return (
    <div>
      <div className="flex items-center">
        <div className="mr-6">Tutorials</div>
        <div className="flex">
          <Toggle value={game.tutorials} change={onSetTutorials} />
        </div>
      </div>
    </div>
  )
}

export default React.memo(GameTab)
