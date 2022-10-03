import { useRouter } from 'next/router'
import useInterval from 'hooks/useInterval'
import Show from 'components/Show'
import Button from 'components/Button'
import { ROOM_STATUS } from 'constants/common'
import { canJoin } from 'utils'
import useRooms from './hooks/useRooms'
import useAppState from 'hooks/useAppState'
import { getRoom, createRoom, ReqCreateRoom } from 'apis/room'
import { PeopleIcon, FootIcon, ClockIcon } from 'icons'
import CreateRoom from './CreateRoom'
import ErrorBoundary from 'components/ErrorBoundary'

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

      <ErrorBoundary>
        <CreateRoom onCreateRoom={onCreateRoom} className="mt-4" />
      </ErrorBoundary>

      <ErrorBoundary>
        <div className="pt-6">
          <Show when={fetching}>fetching..</Show>
          <Show when={!fetching}>
            <div className="grid gap-4 grid-cols-fill-40">
              {rooms?.map(({ id, name, quantity, max, status, maxMove, cooldown }) => (
                <div key={id} className="border border-slate-900 p-4">
                  <strong className="text-3xl break-words">{name}</strong>
                  <div className="py-4 flex">
                    <div className="text-2xl flex items-center">
                      <PeopleIcon />{' '}
                      <div className="ml-1.5">
                        {quantity}/{max}
                      </div>
                    </div>
                    <div className="mx-6 text-2xl flex items-center">
                      <FootIcon /> <div className="ml-1.5">{maxMove}</div>
                    </div>
                    <div className="text-2xl flex items-center">
                      <ClockIcon /> <div className="ml-1.5">{cooldown}</div>
                    </div>
                  </div>
                  <div className="text-2xl">{ROOM_STATUS[status]?.label}</div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      className="mt-4"
                      disabled={!canJoin(quantity, max, status)}
                      onClick={() => onJoinRoom(id, quantity, max, status)}
                    >
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Show>
        </div>
      </ErrorBoundary>
    </div>
  )
}

export default RoomsPage
