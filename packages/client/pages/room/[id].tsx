import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Room from 'containers/Room'
import { getRoom as getRoomApi } from 'apis/room'

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const roomId = context.params?.id?.toString()
    const { data } = await getRoomApi(roomId)

    return {
      props: {
        room: data,
      },
    }
  } catch (_) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}

const RoomPage = ({ room }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!room) return null
  return <Room room={room} />
}

RoomPage.requireSocket = true
export default RoomPage
