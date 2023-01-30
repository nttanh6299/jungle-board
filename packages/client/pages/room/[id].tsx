import { useEffect, useLayoutEffect } from 'react'
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
import useMe from 'hooks/useMe'

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
  const [, dispatch] = useAppState()
  const { isFetched } = useMe()
  const { t } = useTranslation('common')

  const roomId = query?.id ? String(query.id) : ''

  const { room, onResetVerification, onVerifyRoom, valid } = useRoomStore((state) => ({
    room: state.room,
    valid: state.valid,
    onResetVerification: state.actions.onResetVerification,
    onVerifyRoom: state.actions.onVerifyRoom,
  }))

  useLayoutEffect(() => {
    const verify = async () => {
      dispatch({ type: 'displayLoader', payload: { value: true } })
      const { data } = await verifyRoom({ roomId })
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
  }, [roomId, valid, onVerifyRoom, dispatch, t])

  useEffect(() => {
    return () => {
      onResetVerification()
    }
  }, [onResetVerification])

  if (!valid || !isFetched) {
    return null
  }

  return (
    <SocketProvider>
      <Room roomId={roomId} themeConfig={room?.config} />
    </SocketProvider>
  )
}

export default RoomPage
