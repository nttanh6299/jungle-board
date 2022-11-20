import React from 'react'
import { useGameStore } from 'store/game'
import { useRoomStore } from 'store/room'
import Progress from 'components/Progress'
import getProgressColor from 'utils/getProgressColor'

interface IPlayerCooldownProps {
  isOpponent?: boolean
}

const PlayerCooldown: React.FC<IPlayerCooldownProps> = ({ isOpponent }) => {
  const { playerId, playerTurn, playCooldown } = useGameStore((state) => ({
    playerTurn: state.playerTurn,
    playerId: state.playerId,
    playCooldown: state.playCooldown,
  }))
  const { room } = useRoomStore((state) => ({
    room: state.room,
  }))
  const initialCooldown = room?.cooldown || 1
  const percent = playCooldown * (100 / initialCooldown)

  return (
    <>
      {isOpponent && playerTurn && playerId !== playerTurn ? (
        <Progress percent={percent} color={getProgressColor(percent)} />
      ) : null}
      {!isOpponent && playerTurn && playerId === playerTurn ? (
        <Progress percent={percent} color={getProgressColor(percent)} />
      ) : null}
    </>
  )
}

export default React.memo(PlayerCooldown)
