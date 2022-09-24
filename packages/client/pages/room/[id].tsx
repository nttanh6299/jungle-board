import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Room from 'containers/Room'
import SocketProvider from 'contexts/SocketProvider'
import { getRoom as getRoomApi } from 'apis/room'
import { getToken } from 'next-auth/jwt'

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const [token, { data }] = await Promise.all([
      getToken({ req: context.req }),
      getRoomApi(context.params?.id?.toString()),
    ])

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
        accountId: token?.id ? String(token?.id) : '',
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
  return (
    <SocketProvider>
      <Room {...props} />
    </SocketProvider>
  )
}

RoomPage.requireSocket = true
export default RoomPage
