import { useRouter } from 'next/router'
import useInterval from 'hooks/useInterval'
import Show from 'components/Show'
import { ROOM_STATUS } from '@jungle-board/server/lib/constants/common'
import { canJoin } from 'utils'
import useRooms from './hooks/useRooms'
import useAppState from 'hooks/useAppState'
import { getRoom, createRoom } from 'apis/room'

const RoomsPage = () => {
  const router = useRouter()
  const [, dispatch] = useAppState()
  const { rooms, fetching, fetch } = useRooms()

  const onCreateRoom = async () => {
    try {
      dispatch({ type: 'displayLoader', payload: { value: true } })
      const { data } = await createRoom()

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
      <div style={{ display: 'flex' }}>
        <h1>Rooms</h1>
        <button onClick={onCreateRoom} style={{ marginLeft: 16, padding: 4 }}>
          Create
        </button>
      </div>
      <div style={{ paddingTop: 16 }}>
        <Show when={fetching}>fetching..</Show>
        <Show when={!fetching}>
          <div style={{ display: 'flex' }}>
            {rooms?.map(({ id, name, quantity, max, status }) => (
              <div key={id} style={{ border: '1px solid black', marginRight: '8px', padding: 8 }}>
                <strong>{name}</strong>
                <div style={{ paddingTop: 8, paddingBottom: 8 }}>
                  {quantity}/{max}
                </div>
                <div>{ROOM_STATUS[status]?.label}</div>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    style={{ padding: 4 }}
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
