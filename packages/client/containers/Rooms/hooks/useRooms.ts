import { useState, useCallback } from 'react'
import { ResGetRoom } from '@jungle-board/server/lib/types'
import useIsomorphicLayoutEffect from 'hooks/useIsomorphicLayoutEffect'
import { getRooms } from 'apis/room'

type IHookReturn = {
  fetching: boolean
  rooms: ResGetRoom[]
  fetch: () => Promise<void>
}

type IHook = () => IHookReturn

const useRooms: IHook = () => {
  const [rooms, setRooms] = useState<ResGetRoom[]>([])
  const [fetching, setFetching] = useState(true)

  const fetch = useCallback(async (shouldLoadingOnFetch?: boolean) => {
    try {
      if (shouldLoadingOnFetch) {
        setFetching(true)
      }
      const { data } = await getRooms()
      if (data) {
        setRooms(data)
      }
      setFetching(false)
    } catch (error) {
      console.error('Fetch rooms error:', error)
      setFetching(false)
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    fetch()
  }, [fetch])

  return {
    fetching,
    rooms,
    fetch,
  }
}

export default useRooms
