import { useEffect } from 'react'
import { useGameStore } from 'store/game'
import useSocket from 'hooks/useSocket'

type IHookArgs = {
  roomId: string
  accountId: string
}

type IHookReturn = void

type IHook = (args: IHookArgs) => IHookReturn

const useHandleEventSocket: IHook = ({ roomId, accountId }) => {
  const { socket } = useSocket()
  const {
    canConnect,
    endVisible,
    onAfterEndGame,
    onPlayerJoin,
    onCheckRoom,
    onReadyToPlay,
    onPlayCooldown,
    onNewTurn,
    onEndGame,
    onStartGame,
    onDisconnect,
  } = useGameStore((state) => ({
    canConnect: state.canConnect,
    endVisible: state.endVisible,
    onAfterEndGame: state.actions.onAfterEndGame,
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
  }, [socket, canConnect, onPlayerJoin, onCheckRoom, onReadyToPlay, onStartGame])

  // On playing
  useEffect(() => {
    if (!canConnect) return

    socket.on('playCooldown', (cooldown) => {
      onPlayCooldown(cooldown)
    })

    socket.on('turn', (playerIdTurn, board, allMoves) => {
      onNewTurn(playerIdTurn, board, allMoves)
    })

    socket.on('end', (lastTurn, status) => {
      onEndGame(lastTurn, status)
    })
  }, [socket, canConnect, onPlayCooldown, onNewTurn, onEndGame])

  // Disconnect
  useEffect(() => {
    if (!canConnect) return

    socket.on('playerDisconnect', (isPlayerDisconnected) => {
      onDisconnect(isPlayerDisconnected)
    })

    socket.on('outWithNoReason', () => {
      alert('You are disconnected!')
      window.location.href = '/'
    })
  }, [socket, canConnect, onDisconnect])

  // End game overlay
  useEffect(() => {
    let timeout
    if (endVisible) {
      timeout = setTimeout(() => {
        onAfterEndGame()
      }, 10000)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [endVisible, onAfterEndGame])
}

export default useHandleEventSocket
