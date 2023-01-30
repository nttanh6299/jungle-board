import { PropsWithChildren, useState } from 'react'
import { signInAdmin } from 'apis/auth'

const AdminContainer = ({ children }: PropsWithChildren<unknown>) => {
  const [passcode, setPasscode] = useState('')
  const [logged, setLogged] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignInAdmin = async (e) => {
    try {
      e.preventDefault()
      setLoading(true)
      setMessage('')
      const { data } = await signInAdmin(passcode)
      if (!data) {
        setMessage('Passcode is incorrect!')
      } else {
        setLogged(true)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!logged) {
    return (
      <form className="text-base" onSubmit={handleSignInAdmin}>
        <div>Enter passcode:</div>
        <div>
          <input
            className="border my-2 p-2"
            placeholder="Passcode"
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" className="border py-2 px-3" onClick={handleSignInAdmin}>
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </div>
        <div className="my-2">{message}</div>
      </form>
    )
  }

  return <>{children}</>
}

export default AdminContainer
