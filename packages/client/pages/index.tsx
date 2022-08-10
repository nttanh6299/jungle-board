import Rooms from 'containers/Rooms'
import { useSession, signIn, signOut } from 'next-auth/react'

const RoomsPage = () => {
  const { data: session } = useSession()
  return (
    <>
      {session && (
        <>
          {JSON.stringify(session)} <br />
        </>
      )}

      <a
        href={`/api/auth/signin`}
        onClick={(e) => {
          e.preventDefault()
          signIn('google')
        }}
      >
        Sign in
      </a>
      <br />
      <a
        href={`/api/auth/signout`}
        onClick={(e) => {
          e.preventDefault()
          signOut()
        }}
      >
        Sign out
      </a>
      <Rooms />
    </>
  )
}

export default RoomsPage
