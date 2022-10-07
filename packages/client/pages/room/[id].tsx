import { useEffect, useLayoutEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Room from 'containers/Room'
import SocketProvider from 'contexts/SocketProvider'
import { useRoomStore } from 'store/room'
import { verifyRoom } from 'apis/room'
import { UNABLE_PLAY_REASON } from 'constants/common'
import useAppState from 'hooks/useAppState'

export const getStaticPaths = () => ({
  paths: [],
  fallback: 'blocking',
})

export const getStaticProps = () => ({
  props: {},
})

const RoomPage = () => {
  const router = useRouter()
  const { query } = router
  const { data: session } = useSession()
  const [, dispatch] = useAppState()

  const roomId = query?.id ? String(query.id) : ''
  const accountId = session?.id ? String(session.id) : ''

  const { onResetVerification, onVerifyRoom, valid } = useRoomStore((state) => ({
    roomId: state.roomId,
    valid: state.valid,
    onResetVerification: state.actions.onResetVerification,
    onVerifyRoom: state.actions.onVerifyRoom,
  }))

  useLayoutEffect(() => {
    const verify = async () => {
      dispatch({ type: 'displayLoader', payload: { value: true } })
      const { data } = await verifyRoom({ roomId, accountId })
      let errorLabel = ''
      if (!data) errorLabel = 'Something went wrong!'
      if (data.reason === UNABLE_PLAY_REASON.roomFull) {
        errorLabel = 'The room is busy now!'
      } else if (data.reason === UNABLE_PLAY_REASON.playing) {
        errorLabel = 'You are already in another room!'
      }

      if (errorLabel) {
        alert(errorLabel)
        window.location.href = '/'
      }

      onVerifyRoom(roomId)
    }

    if (!valid) {
      verify()
    }
  }, [roomId, accountId, valid, onVerifyRoom, dispatch])

  useEffect(() => {
    return () => {
      onResetVerification()
    }
  }, [onResetVerification])

  if (!valid) {
    return null
  }

  return (
    <SocketProvider>
      <Room roomId={roomId} accountId={accountId} />
    </SocketProvider>
  )
}

export default RoomPage
