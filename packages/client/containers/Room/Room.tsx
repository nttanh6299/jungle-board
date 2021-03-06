import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import useSocket from 'hooks/useSocket'
import { getPossibleMoves, stringify } from 'utils'
import GameBoard from 'components/Board'
import { dequal } from 'dequal'
import { isEmpty } from 'utils/lodash/isEmpty'
import Show from 'components/Show'
import { useGameStore } from 'store/game'
import useHandleSocketEvent from './hooks/useHandleSocketEvent'
import RoomMenu from './RoomMenu'
import PlayerCooldown from './PlayerCooldown'
import { ResGetRoom } from '@jungle-board/server/lib/types'

const Room: React.FC<{ room: ResGetRoom }> = ({ room }) => {
  const router = useRouter()
  const { query } = router

  useHandleSocketEvent({ roomId: stringify(query.id) })

  const {
    board,
    possibleMoves,
    canConnect,
    isHost,
    playerId,
    gameStatus,
    playerTurn,
    selectedSquare,
    bothConnected,
    onConnect,
    onSelectSquare,
    onStartGame,
  } = useGameStore((state) => ({
    board: state.board,
    possibleMoves: state.possibleMoves,
    canConnect: state.canConnect,
    isHost: state.isHost,
    playerId: state.playerId,
    gameStatus: state.gameStatus,
    playerTurn: state.playerTurn,
    selectedSquare: state.selectedSquare,
    bothConnected: state.bothConnected,
    onConnect: state.actions.onConnect,
    onSelectSquare: state.actions.onSelectSquare,
    onStartGame: state.actions.onStartGame,
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
    onStartGame()
    if (gameStatus === 'waiting') {
      socket?.emit('start')
    }
  }

  useEffect(() => {
    if (room) {
      if (room?.quantity >= room?.max) {
        router.push('/rooms')
      } else {
        onConnect()
      }
    }
  }, [room, router, onConnect])

  return (
    <div>
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
            <Show when={bothConnected && isHost && gameStatus === 'waiting'}>
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
