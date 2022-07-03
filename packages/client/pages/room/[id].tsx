import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Room from 'containers/Room'
import { getRoom as getRoomApi } from 'apis/room'

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: 'blocking',
})

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const roomId = context.params?.id?.toString()

  const { data } = await getRoomApi(roomId)

  return {
    props: {
      room: data,
    },
  }
}

const RoomPage = ({ room }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <Room room={room} />
}

RoomPage.requireSocket = true
export default RoomPage
