import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Room from 'containers/Room'
import { getRoom as getRoomApi } from 'apis/room'
import { getToken } from 'next-auth/jwt'

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const roomId = context.params?.id?.toString()

    // get user id
    const token = await getToken({ req: context.req })
    const { sub } = token ?? {}

    const { data } = await getRoomApi(roomId)

    if (!data || (data && data.quantity >= data.max)) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    return {
      props: {
        room: data,
        accountId: sub || '',
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

const RoomPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <Room {...props} />
}

RoomPage.requireSocket = true
export default RoomPage
