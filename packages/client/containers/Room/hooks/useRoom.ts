import { useState, useEffect, useCallback } from 'react'
import { ResGetRoom } from '@jungle-board/server/lib/types'
import { getRoom as getRoomApi } from 'apis/room'

type IHookArgs = {
  id: string
}

type IHookReturn = {
  fetching: boolean
  room: ResGetRoom
  getRoom: (roomId: string) => Promise<void>
}

type IHook = (args: IHookArgs) => IHookReturn

const useRoom: IHook = ({ id }) => {
  const [room, setRoom] = useState<ResGetRoom>(null)
  const [fetching, setFetching] = useState(false)

  const getRoom = useCallback(async (roomId: string) => {
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
  }, [])

  useEffect(() => {
    if (!id) return
    getRoom(id)
  }, [id, getRoom])

  return {
    room,
    fetching,
    getRoom,
  }
}

export default useRoom
