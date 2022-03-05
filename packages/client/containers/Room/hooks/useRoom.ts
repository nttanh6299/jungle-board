import axios from 'axios'
import { API_ENDPOINT } from 'constants/common'
import { useState } from 'react'
import { ResGetRoom } from 'server/types'
import { getRoom as getRoomApi } from 'apis/room'

type IHookReturn = {
  fetching: boolean
  room: ResGetRoom
  getRoom: (roomId: string) => Promise<void>
}

type IHook = () => IHookReturn

const useRoom: IHook = () => {
  const [room, setRoom] = useState<ResGetRoom>(null)
  const [fetching, setFetching] = useState(false)

  const getRoom = async (roomId: string) => {
    try {
      setFetching(true)
      const { data } = await getRoomApi(roomId)
      if (data) {
        setRoom(data)
      }
      setFetching(false)
    } catch (error) {
      console.error('Get room error: ', error)
      setFetching(false)
    }
  }

  return {
    room,
    fetching,
    getRoom,
  }
}

export default useRoom
