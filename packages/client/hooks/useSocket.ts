import { useContext } from 'react'
import { SocketStateContext, SocketStateContextType } from 'contexts/SocketProvider'

const useSocket = (): SocketStateContextType => {
  const state = useContext(SocketStateContext)
  return state
}

export default useSocket
