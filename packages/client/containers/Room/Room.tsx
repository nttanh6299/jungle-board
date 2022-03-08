import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import useSocket from 'hooks/useSocket'
import useRoom from './hooks/useRoom'
import { getPossibleMoves, stringify } from 'utils'
import { Board, AllPossibleMoves } from 'gameService/gameLogic'
import GameBoard from 'components/Board'
import GameMenu from 'components/BoardMenu'
import { dequal } from 'dequal'
import { isEmpty } from 'utils/lodash/isEmpty'

const Room: React.FC = () => {
  const router = useRouter()
  const { query } = router

  const initialBoard = useRef<Board>(null)
  const playerId = useRef<string>('')
  const playerTurn = useRef<string>('')
  const [board, setBoard] = useState<Board>(null)
  const [possibleMoves, setPossibleMoves] = useState<AllPossibleMoves>(null)
  const [selectedSquare, setSelectedSquare] = useState<number[]>([])
  const [canConnect, setCanConnect] = useState(false)
  const [bothConnected, setBothConnected] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [menuVisible, setMenuVisible] = useState(false)

  const { socket } = useSocket()
  const { room } = useRoom({ id: stringify(query?.id) })

  const handleSelectSquare = (row: number, col: number) => {
    if (playerTurn.current !== playerId.current) return

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
      playerId.current = data
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
      setMenuVisible(true)
      if (cooldown <= 0) {
        setMenuVisible(false)
      }
    })

    socket.on('turn', (playerIdTurn, board, allMoves) => {
      playerTurn.current = playerIdTurn
      setBoard(board)
      setPossibleMoves(allMoves)
    })

    // player disconnect
    socket.on('playerDisconnect', () => {
      setBothConnected(false)
      setMenuVisible(false)
      setBoard(initialBoard.current)
      setSelectedSquare([])
    })
  }, [socket, canConnect, query?.id])

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <strong>{bothConnected ? 'Opponent' : 'Waiting an opponent...'}</strong>
          <strong style={{ marginTop: 8 }}>{ }</strong>
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
          <strong style={{ marginBottom: 8 }}>{ }</strong>
          <strong>You</strong>
        </div>
      </div>

      <div>
        <GameMenu menuType="cooldown" cooldown={cooldown} visible={menuVisible} />
      </div>
    </div>
  )
}

export default Room
