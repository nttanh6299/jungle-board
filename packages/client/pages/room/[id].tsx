import { useEffect, useLayoutEffect } from 'react'
import { useSession } from 'next-auth/react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'
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

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
})

const RoomPage = () => {
  const router = useRouter()
  const { query } = router
  const { data: session } = useSession()
  const [, dispatch] = useAppState()
  const { t } = useTranslation('common')

  const roomId = query?.id ? String(query.id) : ''
  const accountId = session?.id ? String(session.id) : ''

  const { onResetVerification, onVerifyRoom, valid } = useRoomStore((state) => ({
    valid: state.valid,
    onResetVerification: state.actions.onResetVerification,
    onVerifyRoom: state.actions.onVerifyRoom,
  }))

  useLayoutEffect(() => {
    const verify = async () => {
      dispatch({ type: 'displayLoader', payload: { value: true } })
      const { data } = await verifyRoom({ roomId, accountId })
      let errorLabel = ''
      if (!data) errorLabel = t('error.somethingWrong')
      if (data.reason === UNABLE_PLAY_REASON.roomFull) {
        errorLabel = t('error.roomBusy')
      } else if (data.reason === UNABLE_PLAY_REASON.playing) {
        errorLabel = t('error.alreadyInAnotherRoom')
      }

      if (errorLabel) {
        alert(errorLabel)
        window.location.href = '/'
      }

      onVerifyRoom(data.info)
    }

    if (!valid) {
      verify()
    }
  }, [roomId, accountId, valid, onVerifyRoom, dispatch, t])

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
