import { useEffect } from 'react'
import { useGameStore, getState } from 'store/game'
import useSocket from 'hooks/useSocket'
import { EDisconnectReason } from 'constants/enum'
import { notify } from 'utils/subscriber'
import { getPieceKind } from 'jungle-board-service'

type IHookArgs = {
  roomId: string
  accountId: string
}

type IHookReturn = void

type IHook = (args: IHookArgs) => IHookReturn

const useHandleEventSocket: IHook = ({ roomId, accountId }) => {
  const { socket } = useSocket()
  const {
    playerId,
    canConnect,
    onPlayerJoin,
    onCheckRoom,
    onReadyToPlay,
    onPlayCooldown,
    onNewTurn,
    onEndGame,
    onStartGame,
    onDisconnect,
  } = useGameStore((state) => ({
    playerId: state.playerId,
    canConnect: state.canConnect,
    onPlayerJoin: state.actions.onPlayerJoin,
    onCheckRoom: state.actions.onCheckRoom,
    onReadyToPlay: state.actions.onReadyToPlay,
    onPlayCooldown: state.actions.onPlayCooldown,
    onNewTurn: state.actions.onNewTurn,
    onEndGame: state.actions.onEndGame,
    onStartGame: state.actions.onStartGame,
    onDisconnect: state.actions.onDisconnect,
  }))

  // Connect to server
  useEffect(() => {
    if (!canConnect || !roomId) return
    // join the room by roomId
    socket?.emit('join', roomId, accountId)
  }, [socket, canConnect, roomId, accountId])

  // Before start game
  useEffect(() => {
    if (!canConnect) return

    socket.on('playerJoin', (playerId, isHost) => {
      onPlayerJoin(playerId, isHost)
    })

    socket.on('checkRoom', (board, bothConnected) => {
      onCheckRoom(board, bothConnected)
    })

    socket.on('readyToPlay', (cooldown) => {
      onReadyToPlay(cooldown)
    })

    socket.on('play', () => {
      onStartGame()
    })

    return () => {
      socket.off('playerJoin')
      socket.off('checkRoom')
      socket.off('readyToPlay')
      socket.off('play')
    }
  }, [socket, canConnect, onPlayerJoin, onCheckRoom, onReadyToPlay, onStartGame])

  // On playing
  useEffect(() => {
    if (!canConnect) return

    socket.on('playCooldown', (cooldown) => {
      onPlayCooldown(cooldown)
    })

    socket.on('turn', (playerIdTurn, board, allMoves, _, moveTo) => {
      onNewTurn(playerIdTurn, board, allMoves)

      const { playerId } = getState()
      let className = playerIdTurn === playerId ? 'text-player' : 'text-opponent'
      let text = ''

      if (moveTo) {
        const piece = getPieceKind(board[moveTo.row][moveTo.col])
        if (playerIdTurn === playerId) {
          className = 'text-opponent'
          text = `Opponent just moved ${piece} piece!`
        } else {
          className = 'text-player'
          text = `You just moved ${piece} piece!`
        }
      }
      const moveTurn = { text, className }

      if (playerIdTurn === playerId) {
        className = 'text-player'
        text = 'Your turn!'
      } else {
        className = 'text-opponent'
        text = `Opponent's turn!`
      }
      const turnLog = { text, className }

      notify<Utils.Log[]>('addLog', [moveTurn, turnLog])
    })

    socket.on('end', (lastTurn, status) => {
      onEndGame(lastTurn, status)
    })

    return () => {
      socket.off('playCooldown')
      socket.off('turn')
      socket.off('end')
    }
  }, [socket, canConnect, onPlayCooldown, onNewTurn, onEndGame])

  // Disconnect
  useEffect(() => {
    if (!canConnect) return

    socket.on('playerDisconnect', (isPlayerDisconnected) => {
      if (isPlayerDisconnected) {
        onDisconnect()
        notify<Utils.Log[]>('addLog', [{ text: 'The opponent has left the room' }])
      }
    })

    return () => {
      socket.off('playerDisconnect')
    }
  }, [socket, canConnect, onDisconnect])

  // Reconnect
  useEffect(() => {
    if (!canConnect || !roomId || !playerId) return

    socket.on('disconnect', (reason) => {
      console.log('client disconnect', reason)
      if (reason === EDisconnectReason.TRANSPORT_ERROR || reason === EDisconnectReason.PING_TIMEOUT) {
        console.log(playerId + ' try to reconnect')
        socket.connect().emit('reconnect', roomId, playerId)
      } else {
        alert('You are disconnected!')
        window.location.href = '/'
      }
    })

    socket.on('reconnectSuccess', () => {
      console.log('Reconnect successfully!')
    })

    return () => {
      socket.off('disconnect')
      socket.off('reconnectSuccess')
    }
  }, [socket, canConnect, roomId, playerId])
}

export default useHandleEventSocket
