import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { getMe as getMeAPI } from 'apis/auth'
import { useUserStore } from 'store/user'

const useMe = () => {
  const { status } = useSession()
  const { user, onSetUser } = useUserStore((state) => ({
    user: state.user,
    onSetUser: state.actions.onSetUser,
  }))

  const getMe = useCallback(async () => {
    try {
      const { data } = await getMeAPI()
      onSetUser(data)
    } catch (error) {
      console.log('Get me error: ', error)
    }
  }, [onSetUser])

  return {
    isLoading: status === 'authenticated' && !user,
    status,
    user,
    getMe,
  }
}

export default useMe
