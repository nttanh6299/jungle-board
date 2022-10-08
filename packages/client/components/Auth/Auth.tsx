import { PropsWithChildren } from 'react'
import { useSession } from 'next-auth/react'

const Auth = ({ children }: PropsWithChildren<unknown>) => {
  const { status } = useSession()

  if (status === 'loading') return null

  return <>{children}</>
}

export default Auth
