import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import GameMenu from 'components/BoardMenu'
import { useGameStore } from 'store/game'
import Show from 'components/Show'

const RoomMenu: React.FC = () => {
  const { t } = useTranslation('common')
  const {
    cooldown,
    cooldownMenuVisible,
    endVisible,
    disconnectVisible,
    gameStatus,
    lastTurn,
    playerId,
    onAfterEndGame,
  } = useGameStore((state) => ({
    cooldownMenuVisible: state.cooldownMenuVisible,
    endVisible: state.endVisible,
    disconnectVisible: state.disconnectVisible,
    cooldown: state.cooldown,
    gameStatus: state.gameStatus,
    lastTurn: state.lastTurn,
    playerId: state.playerId,
    onAfterEndGame: state.actions.onAfterEndGame,
  }))

  // End game overlay
  useEffect(() => {
    let timeout
    if (endVisible || disconnectVisible) {
      timeout = setTimeout(() => {
        onAfterEndGame()
      }, 10000)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [endVisible, disconnectVisible, onAfterEndGame])

  const gameStatusLabel = useMemo(() => {
    if (gameStatus === 'tie')
      return {
        title: t('tie'),
        subtitle: t('youAreAmazing'),
      }
    if (gameStatus === 'end') {
      return lastTurn === playerId
        ? {
            title: t('youWin'),
            subtitle: t('youPlayWell'),
          }
        : {
            title: t('youLose'),
            subtitle: t('betterLuckNextTime'),
          }
    }
    return {
      title: '',
      subtitle: '',
    }
  }, [gameStatus, lastTurn, playerId, t])

  return (
    <Show when={cooldownMenuVisible || endVisible || disconnectVisible}>
      <div className="absolute top-0 w-full h-full">
        <GameMenu visible={cooldownMenuVisible}>
          <h2 className="text-lg mt-10">{t('theMatchReady')}</h2>
          <div className="text-4xl mt-2">{cooldown}</div>
          <div className="text-base mt-10">{t('doYourBest')}</div>
        </GameMenu>
        <GameMenu visible={endVisible}>
          <h2 className="text-lg mt-10">{gameStatusLabel.title}</h2>
          <div className="text-4xl mt-2 invisible">-</div>
          <div className="text-base mt-10">{gameStatusLabel.subtitle}</div>
          <div className="text-xl mt-10 cursor-pointer border px-3 py-1" onClick={onAfterEndGame}>
            OK
          </div>
        </GameMenu>
        <GameMenu visible={disconnectVisible}>
          <h2 className="text-lg mt-10">{t('opponentLeftRoom')}</h2>
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
