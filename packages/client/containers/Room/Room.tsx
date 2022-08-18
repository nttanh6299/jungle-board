import React, { useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import useSocket from 'hooks/useSocket'
import { getPossibleMoves } from 'utils'
import GameBoard from 'components/Board'
import { dequal } from 'dequal'
import { isEmpty } from 'utils/lodash/isEmpty'
import Show from 'components/Show'
import { useGameStore } from 'store/game'
import useHandleSocketEvent from './hooks/useHandleSocketEvent'
import RoomMenu from './RoomMenu'
import PlayerCooldown from './PlayerCooldown'
import { ResGetRoom } from 'apis/room'

interface RoomProps {
  room: ResGetRoom
  accountId: string
}

const Room: React.FC<RoomProps> = ({ room, accountId }) => {
  const router = useRouter()

  useHandleSocketEvent({ roomId: room.id, accountId })

  const {
    board,
    possibleMoves,
    canConnect,
    cooldown,
    isHost,
    playerId,
    gameStatus,
    playerTurn,
    selectedSquare,
    bothConnected,
    onConnect,
    onDisconnect,
    onSelectSquare,
  } = useGameStore((state) => ({
    board: state.board,
    possibleMoves: state.possibleMoves,
    canConnect: state.canConnect,
    cooldown: state.cooldown,
    isHost: state.isHost,
    playerId: state.playerId,
    gameStatus: state.gameStatus,
    playerTurn: state.playerTurn,
    selectedSquare: state.selectedSquare,
    bothConnected: state.bothConnected,
    onConnect: state.actions.onConnect,
    onDisconnect: state.actions.onDisconnect,
    onSelectSquare: state.actions.onSelectSquare,
  }))

  const { socket } = useSocket()

  const handleSelectSquare = (row: number, col: number) => {
    if (playerTurn !== playerId) return

    // move to possible square
    // row and col must be a new position
    const isSameSquare = dequal(selectedSquare, [row, col])
    if (selectedSquare?.length && !isSameSquare) {
      const pieceMoves = getPossibleMoves(board, possibleMoves, selectedSquare[0], selectedSquare[1])
      const moveTo = pieceMoves?.find((move) => dequal(move, { row, col }))
      if (moveTo) {
        const moveFrom = { row: selectedSquare[0], col: selectedSquare[1] }
        socket?.emit('move', moveFrom, moveTo)
        return onSelectSquare([])
      }
    }

    // deselect square
    if (isSameSquare) {
      return onSelectSquare([])
    }

    const piece = board[row][col]
    if (!isEmpty(possibleMoves) && possibleMoves[piece]) {
      onSelectSquare([row, col])
    }
  }

  const handleStartGame = () => {
    if (gameStatus === 'waiting') {
      socket?.emit('start')
    }
  }

  const goBack = useCallback(() => {
    if (gameStatus === 'playing') {
      if (window.confirm('Do you want to go back ?')) {
        // note: error when room has guests
        onDisconnect(true)
        return router.push('/')
      }
    } else {
      onDisconnect(true)
      router.push('/')
    }
  }, [gameStatus, router, onDisconnect])

  useEffect(() => {
    window.addEventListener('popstate', goBack)
    return () => {
      window.removeEventListener('popstate', goBack)
    }
  }, [goBack])

  useEffect(() => {
    onConnect()
  }, [onConnect])

  return (
    <div className="relative">
      <button onClick={goBack} className="fixed top-[10px] left-[10px] block p-2">
        Back
      </button>
      <Show when={canConnect}>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            <strong>{bothConnected ? 'Opponent' : 'Waiting an opponent...'}</strong>
            <PlayerCooldown isOpponent />
          </div>
          <div className="pt-2 mt-2">
            <GameBoard
              board={board}
              selectedSquare={selectedSquare}
              onSelectSquare={handleSelectSquare}
              possibleMoves={getPossibleMoves(
                board,
                possibleMoves,
                selectedSquare?.[0] ?? -1,
                selectedSquare?.[1] ?? -1,
              )}
            />
          </div>
          <div className="flex flex-col items-center">
            <PlayerCooldown />
            <strong>You</strong>
            <Show when={bothConnected && isHost && cooldown === 0 && gameStatus === 'waiting'}>
              <button onClick={handleStartGame}>Start</button>
            </Show>
          </div>

          <RoomMenu />
        </div>
      </Show>
    </div>
  )
}

export default Room
