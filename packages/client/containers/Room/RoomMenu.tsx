import React, { useMemo } from 'react'
import GameMenu from 'components/BoardMenu'
import { useGameStore } from 'store/game'

const RoomMenu: React.FC = () => {
  const { cooldown, cooldownMenuVisible, endVisible, gameStatus, lastTurn, playerId, onAfterEndGame } = useGameStore(
    (state) => ({
      cooldownMenuVisible: state.cooldownMenuVisible,
      endVisible: state.endVisible,
      cooldown: state.cooldown,
      gameStatus: state.gameStatus,
      lastTurn: state.lastTurn,
      playerId: state.playerId,
      onAfterEndGame: state.actions.onAfterEndGame,
    }),
  )

  const gameStatusLabel = useMemo(() => {
    if (gameStatus === 'tie') return 'TIE'
    if (gameStatus === 'ending') {
      return lastTurn === playerId ? 'YOU WIN' : 'YOU LOSE'
    }
    return ''
  }, [gameStatus, lastTurn, playerId])

  return (
    <div>
      <GameMenu menuType="cooldown" visible={cooldownMenuVisible}>
        {cooldown}
      </GameMenu>
      <GameMenu menuType="end" visible={endVisible}>
        <div className="text-4xl">{gameStatusLabel}</div>
        <div className="text-2xl mt-4 cursor-pointer" onClick={onAfterEndGame}>
          OK
        </div>
      </GameMenu>
    </div>
  )
}

export default React.memo(RoomMenu)
