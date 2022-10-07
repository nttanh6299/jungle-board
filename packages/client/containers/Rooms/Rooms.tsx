import { useRouter } from 'next/router'
import useInterval from 'hooks/useInterval'
import Show from 'components/Show'
import Button from 'components/Button'
import { ROOM_STATUS, UNABLE_PLAY_REASON } from 'constants/common'
import { canJoin } from 'utils'
import useRooms from './hooks/useRooms'
import useAppState from 'hooks/useAppState'
import { createRoom, ReqCreateRoom, verifyRoom } from 'apis/room'
import { PeopleIcon, FootIcon, ClockIcon } from 'icons'
import CreateRoom from './CreateRoom'
import ErrorBoundary from 'components/ErrorBoundary'
import { useSession } from 'next-auth/react'
import { useRoomStore } from 'store/room'

const RoomsPage = () => {
  const router = useRouter()
  const [, dispatch] = useAppState()
  const { rooms, fetching, fetch } = useRooms()
  const { data: session } = useSession()
  const { onVerifyRoom } = useRoomStore((state) => ({
    onVerifyRoom: state.actions.onVerifyRoom,
  }))

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
      const { data } = await verifyRoom({ roomId, accountId: session?.id ? String(session?.id) : '' })

      let errorLabel = ''
      if (!data) errorLabel = 'Something went wrong!'
      if (data.reason === UNABLE_PLAY_REASON.roomFull) {
        errorLabel = 'The room is busy now!'
      } else if (data.reason === UNABLE_PLAY_REASON.playing) {
        errorLabel = 'You are already in another room!'
      }

      if (errorLabel) {
        alert(errorLabel)
        router.reload()
      } else {
        onVerifyRoom(roomId)
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
