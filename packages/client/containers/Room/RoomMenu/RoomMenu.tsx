import React, { useEffect, useMemo } from 'react'
import GameMenu from 'components/BoardMenu'
import { useGameStore } from 'store/game'
import Show from 'components/Show'

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

  // End game overlay
  useEffect(() => {
    let timeout
    if (endVisible) {
      timeout = setTimeout(() => {
        onAfterEndGame()
      }, 10000)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [endVisible, onAfterEndGame])

  const gameStatusLabel = useMemo(() => {
    if (gameStatus === 'tie')
      return {
        title: 'Tie',
        subtitle: 'You are going to be amazing',
      }
    if (gameStatus === 'end') {
      return lastTurn === playerId
        ? {
            title: 'You win',
            subtitle: 'You played very well',
          }
        : {
            title: 'You lose',
            subtitle: 'Better luck next time',
          }
    }
    return {
      title: '',
      subtitle: '',
    }
  }, [gameStatus, lastTurn, playerId])

  return (
    <Show when={cooldownMenuVisible || endVisible}>
      <div className="absolute top-0 w-full h-full">
        <GameMenu visible={cooldownMenuVisible}>
          <h2 className="text-lg mt-10">The match is ready</h2>
          <div className="text-4xl mt-2">{cooldown}</div>
          <div className="text-base mt-10">Do your best</div>
        </GameMenu>
        <GameMenu visible={endVisible}>
          <h2 className="text-lg mt-10">{gameStatusLabel.title}</h2>
          <div className="text-4xl mt-2 invisible">-</div>
          <div className="text-base mt-10">{gameStatusLabel.subtitle}</div>
          <div className="text-xl mt-10 cursor-pointer border px-3 py-1" onClick={onAfterEndGame}>
            OK
          </div>
        </GameMenu>
        <GameMenu visible={false}>
          <h2 className="text-lg mt-10">The opponent has left the match</h2>
          <div className="text-4xl mt-2 invisible">-</div>
          <div className="text-base mt-10 invisible">-</div>
          <div className="text-xl mt-10 cursor-pointer border px-3 py-1" onClick={onAfterEndGame}>
            OK
          </div>
        </GameMenu>
      </div>
    </Show>
  )
}

export default React.memo(RoomMenu)
