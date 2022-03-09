import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/router'
import useSocket from 'hooks/useSocket'
import useRoom from './hooks/useRoom'
import { getPossibleMoves, stringify } from 'utils'
import { Board, AllPossibleMoves } from 'gameService/gameLogic'
import GameBoard from 'components/Board'
import GameMenu from 'components/BoardMenu'
import { dequal } from 'dequal'
import { isEmpty } from 'utils/lodash/isEmpty'
import { ROOM_STATUS } from 'server/constants/common'

const Room: React.FC = () => {
  const router = useRouter()
  const { query } = router

  const initialBoard = useRef<Board>(null)
  const [playerId, setPlayerId] = useState('')
  const [playerTurn, setPlayerTurn] = useState('')
  const [lastTurn, setLastTurn] = useState('')
  const [board, setBoard] = useState<Board>(null)
  const [possibleMoves, setPossibleMoves] = useState<AllPossibleMoves>(null)
  const [selectedSquare, setSelectedSquare] = useState<number[]>([])
  const [canConnect, setCanConnect] = useState(false)
  const [bothConnected, setBothConnected] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [playCooldown, setPlayCooldown] = useState(0)
  const [cooldownMenuVisible, setCooldownMenuVisible] = useState(false)
  const [endVisible, setEndVisible] = useState(false)
  const [gameStatus, setGameStatus] = useState<'ending' | 'playing' | 'tie' | 'waiting'>('waiting')

  const { socket } = useSocket()
  const { room } = useRoom({ id: stringify(query?.id) })

  const gameStatusLabel = useMemo(() => {
    if (gameStatus === 'tie') return 'TIE'
    if (gameStatus === 'ending') {
      return lastTurn === playerId ? 'YOU WIN' : 'YOU LOSE'
    }
    return ''
  }, [gameStatus, lastTurn, playerId])

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
        return setSelectedSquare([])
      }
    }

    // deselect square
    if (isSameSquare) {
      return setSelectedSquare([])
    }

    const piece = board[row][col]
    if (!isEmpty(possibleMoves) && possibleMoves[piece]) {
      setSelectedSquare([row, col])
    }
  }

  const handleEndGame = () => {
    setEndVisible(false)
    setBoard(initialBoard.current)
    setGameStatus('waiting')
    setLastTurn('')
  }

  useEffect(() => {
    if (room) {
      if (room?.quantity >= room?.max) {
        router.push('/rooms')
      } else {
        setCanConnect(true)
      }
    }
  }, [room, router])

  useEffect(() => {
    if (!query?.id) return
    if (!canConnect) return

    // join the room by roomId
    socket.emit('join', stringify(query?.id))

    socket.on('playerJoin', (data) => {
      setPlayerId(data)
    })

    // player join in the room
    socket.on('checkRoom', (board, bothConnected) => {
      if (bothConnected) {
        setBothConnected(true)
      }

      // initial board
      if (board) {
        if (!initialBoard.current) {
          initialBoard.current = board
        }
        setBoard(board)
      }
    })

    socket.on('readyToPlay', (cooldown) => {
      setCooldown(cooldown)
      setCooldownMenuVisible(true)
      if (cooldown <= 0) {
        setCooldownMenuVisible(false)
      }
    })

    socket.on('playCooldown', (cooldown) => {
      setPlayCooldown(cooldown)
    })

    socket.on('turn', (playerIdTurn, board, allMoves) => {
      setSelectedSquare([])
      setPlayerTurn(playerIdTurn)
      setBoard(board)
      setPossibleMoves(allMoves)
    })

    socket.on('end', (lastTurn, status) => {
      setPlayerTurn('')
      setSelectedSquare([])
      setEndVisible(true)
      setLastTurn(lastTurn)

      if (status === ROOM_STATUS.ending.value) {
        setGameStatus('ending')
      }
      if (status === ROOM_STATUS.tie.value) {
        setGameStatus('tie')
      }
    })

    // player disconnect
    socket.on('playerDisconnect', () => {
      setBothConnected(false)
      setCooldownMenuVisible(false)
      setBoard(initialBoard.current)
      setSelectedSquare([])
      setPlayerTurn('')
      setGameStatus('waiting')
      setLastTurn('')
    })
  }, [socket, canConnect, query?.id])

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <strong>{bothConnected ? 'Opponent' : 'Waiting an opponent...'}</strong>
          <div style={{ height: 20 }}>
            <strong style={{ marginTop: 8 }}>{playerTurn && playerId !== playerTurn ? playCooldown : null}</strong>
          </div>
        </div>
        <div style={{ paddingTop: 8, paddingBottom: 8 }}>
          <GameBoard
            board={board}
            selectedSquare={selectedSquare}
            onSelectSquare={handleSelectSquare}
            possibleMoves={getPossibleMoves(board, possibleMoves, selectedSquare?.[0] ?? -1, selectedSquare?.[1] ?? -1)}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ height: 20 }}>
            <strong style={{ marginBottom: 8 }}>{playerTurn && playerId === playerTurn ? playCooldown : null}</strong>
          </div>
          <strong>You</strong>
        </div>
      </div>

      <div>
        <GameMenu menuType="cooldown" visible={cooldownMenuVisible}>
          {cooldown}
        </GameMenu>
        <GameMenu menuType="end" visible={endVisible}>
          <div style={{ fontSize: 40 }}>{gameStatusLabel}</div>
          <div style={{ fontSize: 24, marginTop: 8, cursor: 'pointer' }} onClick={handleEndGame}>OK</div>
        </GameMenu>
      </div>
    </div>
  )
}

export default Room
