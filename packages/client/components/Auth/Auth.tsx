import React from 'react'
import { useSession } from 'next-auth/react'

const Auth: React.FC = ({ children }) => {
  const { status } = useSession()

  if (status === 'loading') return null

  return <>{children}</>
}

export default Auth
