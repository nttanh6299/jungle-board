import Show from 'components/Show'
import Rooms from 'containers/Rooms'
import { useSession, signIn, signOut } from 'next-auth/react'

const RoomsPage = () => {
  const { data: session } = useSession()

  return (
    <>
      <div className="flex flex-col mb-3">
        <Show when={!session?.user}>
          <a
            href={`/api/auth/signin`}
            onClick={(e) => {
              e.preventDefault()
              signIn('google')
            }}
          >
            Sign in with Google
          </a>
          <a
            href={`/api/auth/signin`}
            onClick={(e) => {
              e.preventDefault()
              signIn('github')
            }}
          >
            Sign in with Github
          </a>
          <a
            href={`/api/auth/signin`}
            onClick={(e) => {
              e.preventDefault()
              signIn('facebook')
            }}
          >
            Sign in with Facebook
          </a>
        </Show>
        <Show when={!!session?.user}>
          <div>{session?.user?.name}</div>
          <a
            href={`/api/auth/signout`}
            onClick={(e) => {
              e.preventDefault()
              signOut()
            }}
          >
            Sign out
          </a>
        </Show>
      </div>
      <Rooms />
    </>
  )
}

export default RoomsPage
