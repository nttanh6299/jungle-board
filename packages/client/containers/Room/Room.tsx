import React, { useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import useSocket from 'hooks/useSocket'
import { getPossibleMoves } from 'utils'
import GameBoard from 'components/Board'
import { dequal } from 'dequal'
import { isEmpty } from 'utils/lodash/isEmpty'
import Show from 'components/Show'
import { useGameStore } from 'store/game'
import useAppState from 'hooks/useAppState'
import TopBar from 'components/TopBar'
import Button from 'components/Button'
import ArrowLeftIcon from 'icons/ArrowLeft'
import Avatar from 'components/Avatar'
import AnimalsStatus from 'components/AnimalsStatus'
import useMe from 'hooks/useMe'
import useHandleSocketEvent from 'hooks/useHandleSocketEvent'
import getPlayerAnimals from 'utils/getPlayerAnimals'
import RoomMenu from './RoomMenu'
import PlayerCooldown from './PlayerCooldown'
import Chat from 'components/Chat'
import Logs from 'components/Logs'

interface RoomProps {
  roomId: string
  accountId: string
}

const Room: React.FC<RoomProps> = ({ roomId, accountId }) => {
  const router = useRouter()
  const [, dispatch] = useAppState()
  const { t } = useTranslation('common')

  useHandleSocketEvent({ roomId, accountId })

  const { user } = useMe()
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
  const { playerAnimals, opponentAnimals } = getPlayerAnimals(board)

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
      if (window.confirm(t('confirmGoBack'))) {
        // note: error when room has guests
        onDisconnect(true)
        return router.push('/')
      }
    } else {
      onDisconnect(true)
      router.push('/')
    }
  }, [gameStatus, router, onDisconnect, t])

  useEffect(() => {
    window.addEventListener('popstate', goBack)
    return () => {
      window.removeEventListener('popstate', goBack)
    }
  }, [goBack])

  useEffect(() => {
    // check until socket is connected
    const checkConnectInterval = setInterval(() => {
      if (socket.connected) {
        clearInterval(checkConnectInterval)
        dispatch({ type: 'displayLoader', payload: { value: false } })
        onConnect()
      }
    }, 1000)

    return () => {
      clearInterval(checkConnectInterval)
    }
  }, [socket, onConnect, dispatch])

  return (
    <Show when={canConnect}>
      <TopBar hideAutoJoin hideInfo hideLogout />
      <div className="relative md:mt-4 flex-1">
        <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch">
          <div className="md:flex-1 hidden md:flex flex-col justify-between">
            <div className="flex flex-col items-end">
              <Show when={bothConnected}>
                <div className="flex flex-col items-end">
                  <Avatar size="md" color="opponent" />
                  <h5 className="text-sm my-1">{t('opponent')}</h5>
                  <div className="mb-2">
                    <AnimalsStatus alive={opponentAnimals} />
                  </div>
                  <PlayerCooldown isOpponent />
                </div>
              </Show>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex flex-col items-end">
                <PlayerCooldown />
                <Show when={bothConnected && isHost && cooldown === 0 && gameStatus === 'waiting'}>
                  <Button uppercase rounded variant="secondary" size="sm" onClick={handleStartGame}>
                    {t('start')}
                  </Button>
                </Show>
                <div className="mt-2">
                  <AnimalsStatus alive={playerAnimals} />
                </div>
                <h5 className="text-sm my-1">{user?.name || t('guest')}</h5>
                <Avatar size="md" />
              </div>
            </div>
          </div>

          <div className="w-full flex md:hidden flex-col items-center">
            <Show when={!bothConnected}>
              <div className="h-[48px] " />
            </Show>
            <Show when={bothConnected}>
              <h5 className="text-base my-1">{t('opponent')}</h5>
              <div className="h-[8px] w-full max-w-[150px] mb-2">
                <PlayerCooldown isOpponent />
              </div>
            </Show>
          </div>

          <div className="md:flex-1 relative md:ml-3 mr-0 md:mr-3 ">
            <GameBoard
              isPlaying={!!playerTurn}
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
            <RoomMenu />
          </div>

          <div className="w-full flex md:hidden flex-col items-center">
            <div className="h-[8px] w-full max-w-[150px] mt-2">
              <PlayerCooldown />
            </div>
            <h5 className="text-base my-1">{user?.name || t('guest')}</h5>
            <Show when={bothConnected && isHost && cooldown === 0 && gameStatus === 'waiting'}>
              <Button uppercase rounded variant="secondary" size="sm" onClick={handleStartGame}>
                {t('start')}
              </Button>
            </Show>
          </div>

          <div className="flex-1 hidden md:block">
            <div className="flex flex-col h-full pt-3">
              <div className="flex-1">
                <Logs />
              </div>
              <div className="flex-1 mt-6">
                <Chat />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button iconLeft={<ArrowLeftIcon />} uppercase rounded className="self-start" onClick={goBack}>
        {t('leave')}
      </Button>
    </Show>
  )
}

export default Room
