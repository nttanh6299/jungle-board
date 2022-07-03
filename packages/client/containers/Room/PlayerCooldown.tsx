import React from 'react'
import { useGameStore } from 'store/game'

interface IPlayerCooldownProps {
  isOpponent?: boolean
}

const PlayerCooldown: React.FC<IPlayerCooldownProps> = ({ isOpponent }) => {
  const { playerId, playerTurn, playCooldown } = useGameStore((state) => ({
    playerTurn: state.playerTurn,
    playerId: state.playerId,
    playCooldown: state.playCooldown,
  }))

  return (
    <div className="h-5">
      <strong className="mt-2">
        {isOpponent && playerTurn && playerId !== playerTurn ? playCooldown : null}
        {!isOpponent && playerTurn && playerId === playerTurn ? playCooldown : null}
      </strong>
    </div>
  )
}

export default React.memo(PlayerCooldown)
