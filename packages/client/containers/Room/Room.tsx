import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import useSocket from 'hooks/useSocket'
import useRoom from './hooks/useRoom'
import { stringify } from 'utils'
import { Board } from 'gameService/gameLogic'
import GameBoard from 'components/Board'
import GameMenu from 'components/BoardMenu'
import { dequal } from 'dequal'

const Room: React.FC = () => {
  const router = useRouter()
  const { query } = router

  const initialBoard = useRef<Board>(null)
  const [board, setBoard] = useState<Board>(null)
  const [selectedSquare, setSelectedSquare] = useState<number[]>([])
  const [canConnect, setCanConnect] = useState(false)
  const [bothConnected, setBothConnected] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [menuVisible, setMenuVisible] = useState(false)

  const { socket } = useSocket()
  const { room } = useRoom({ id: stringify(query?.id) })

  const handleSelectSquare = (row: number, col: number) => {
    // deselect square
    if (dequal(selectedSquare, [row, col])) {
      return setSelectedSquare([])
    }

    console.log(board[row][col])
    setSelectedSquare([row, col])
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

    // player join in the room
    socket.on('playerJoin', (data) => {
      if (data.bothConnected) {
        setBothConnected(true)
      }

      // initial board
      if (data.board) {
        initialBoard.current = data.board
        setBoard(data.board)
      }
    })

    socket.on('readyToPlay', (data) => {
      setCooldown(data.cooldown)
      setMenuVisible(true)
      if (data.cooldown <= 0) {
        setMenuVisible(false)
      }
    })

    socket.on('startGame', (data) => {
      setBoard(data.board)
      console.log(data)
    })

    // player disconnect
    socket.on('playerDisconnect', () => {
      setBothConnected(false)
      setMenuVisible(false)
      setBoard(initialBoard.current)
    })
  }, [socket, canConnect, query?.id])

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <strong>{bothConnected ? 'Opponent' : 'Waiting an opponent...'}</strong>
        <GameBoard
          board={board}
          selectedSquare={selectedSquare}
          onSelectSquare={handleSelectSquare}
        />
        <strong>You</strong>
      </div>

      <div>
        <GameMenu menuType='cooldown' cooldown={cooldown} visible={menuVisible} />
      </div>
    </div>
  )
}

export default Room
