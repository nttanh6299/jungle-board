import { PropsWithChildren, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import useAppState from 'hooks/useAppState'

const Auth = ({ children }: PropsWithChildren<unknown>) => {
  const { status } = useSession()
  const [_, dispatch] = useAppState()

  useEffect(() => {
    if (status !== 'loading') {
      dispatch({ type: 'displayLoader', payload: { value: false } })
    }
  }, [status, dispatch])

  if (status === 'loading') return null

  return <>{children}</>
}

export default Auth
