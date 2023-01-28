import { useCallback } from 'react'
import { getMe as getMeAPI } from 'apis/auth'
import { useUserStore } from 'store/user'
import { getAccessToken } from 'utils'

const useMe = () => {
  const { user, isLoading, isFetched, onSetUser, onClearUser, onSetLoading, onSetFetched } = useUserStore((state) => ({
    user: state.user,
    isLoading: state.isLoading,
    isFetched: state.isFetched,
    onSetUser: state.actions.onSetUser,
    onClearUser: state.actions.onClearUser,
    onSetFetched: state.actions.onSetFetched,
    onSetLoading: state.actions.onSetLoading,
  }))

  const clearUser = () => {
    onClearUser()
  }

  const restartFetchUser = () => {
    onSetFetched(false)
  }

  const getMe = useCallback(
    async (forceLoading?: boolean) => {
      if (!getAccessToken()) {
        onSetFetched(true)
        return
      }

      try {
        if (forceLoading) {
          onSetLoading(true)
        }
        const { data } = await getMeAPI()
        onSetUser(data)
        onSetFetched(true)
      } catch (error) {
        console.log('Get me error: ', error)
      } finally {
        onSetLoading(false)
      }
    },
    [onSetUser, onSetLoading, onSetFetched],
  )

  return {
    isLoading,
    isFetched,
    user,
    getMe,
    clearUser,
    restartFetchUser,
  }
}

export default useMe
