import React, { useState, useEffect } from 'react'
import socketIOClient, { Socket } from 'socket.io-client'
import { API_ENDPOINT } from '../constants/common'

const IndexPage = () => {
  const [socket, setSocket] = useState<Socket | undefined>()

  useEffect(() => {
    const socket = socketIOClient(API_ENDPOINT, { transports: ['websocket'] })
    setSocket(socket)
  }, [])

  return (
    <div>
      test
    </div>
  )
}

export default IndexPage
