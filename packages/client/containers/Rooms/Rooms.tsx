import { useRouter } from 'next/router'
import useInterval from 'hooks/useInterval'
import Show from 'components/Show'
import { ROOM_STATUS } from 'constants/common'
import { canJoin } from 'utils'
import useRooms from './hooks/useRooms'
import useAppState from 'hooks/useAppState'
import { getRoom, createRoom, ReqCreateRoom } from 'apis/room'
import CreateRoom from './CreateRoom'

const RoomsPage = () => {
  const router = useRouter()
  const [, dispatch] = useAppState()
  const { rooms, fetching, fetch } = useRooms()

  const onCreateRoom = async (params: ReqCreateRoom) => {
    try {
      dispatch({ type: 'displayLoader', payload: { value: true } })
      const { data } = await createRoom(params)

      let errorLabel = ''
      if (!data) errorLabel = 'Something went wrong!'
      dispatch({ type: 'displayLoader', payload: { value: false } })

      if (errorLabel) {
        alert(errorLabel)
        router.reload()
      } else {
        router.push('/room/' + data.id)
      }
    } catch (error) {
      console.log('Create room error: ', error)
    }
  }

  const onJoinRoom = async (roomId: string, quantity: number, max: number, status: string) => {
    try {
      if (!canJoin(quantity, max, status)) return

      dispatch({ type: 'displayLoader', payload: { value: true } })
      const { data } = await getRoom(roomId)

      let errorLabel = ''
      if (!data) errorLabel = 'Something went wrong!'
      if (!canJoin(data.quantity, data.max, data.status)) {
        errorLabel = 'The room is busy now!'
      }
      dispatch({ type: 'displayLoader', payload: { value: false } })

      if (errorLabel) {
        alert(errorLabel)
        router.reload()
      } else {
        router.push('/room/' + roomId)
      }
    } catch (error) {
      console.log('Join room error: ', error)
    }
  }

  useInterval(() => {
    fetch()
  }, 10000)

  return (
    <div>
      <h1 className="text-5xl font-semibold">Rooms</h1>
      <CreateRoom onCreateRoom={onCreateRoom} className="mt-4" />
      <div className="pt-6">
        <Show when={fetching}>fetching..</Show>
        <Show when={!fetching}>
          <div className="flex">
            {rooms?.map(({ id, name, quantity, max, status }) => (
              <div key={id} className="border border-slate-900 mr-4 p-4">
                <strong className="text-3xl">{name}</strong>
                <div className="py-4 text-2xl">
                  {quantity}/{max}
                </div>
                <div className="text-2xl">{ROOM_STATUS[status]?.label}</div>
                <div className="mt-3 flex justify-end">
                  <button
                    className="mt-4 px-6 py-3 text-2xl border rounded-lg bg-slate-900 hover:bg-slate-800 text-white"
                    disabled={!canJoin(quantity, max, status)}
                    onClick={() => onJoinRoom(id, quantity, max, status)}
                  >
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Show>
      </div>
    </div>
  )
}

export default RoomsPage
