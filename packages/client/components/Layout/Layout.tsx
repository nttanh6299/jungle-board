import { PropsWithChildren, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import useMe from 'hooks/useMe'
import AppLoading from 'components/AppLoading'
import { setAccessToken } from 'utils'
import useIsomorphicLayoutEffect from 'hooks/useIsomorphicLayoutEffect'
import { notify, subscribe, unsubscribe } from 'utils/subscriber'
import { NotifyEvent } from 'constants/enum'
import ConnectionAlert from 'components/ConnectionAlert'

const Layout = ({ children }: PropsWithChildren<unknown>) => {
  const { getMe, restartFetchUser } = useMe()
  const { data: session, status } = useSession()

  useIsomorphicLayoutEffect(() => {
    if (session?.accessToken && status === 'authenticated') {
      setAccessToken(session.accessToken)
      signOut({ redirect: false })
      restartFetchUser()
      notify(NotifyEvent.RefetchUser, null)
    }
  }, [session, status])

  useIsomorphicLayoutEffect(() => {
    getMe()
  }, [getMe])

  useEffect(() => {
    subscribe(NotifyEvent.RefetchUser, getMe)

    return () => {
      unsubscribe(NotifyEvent.RefetchUser, getMe)
    }
  })

  return (
    <>
      <ConnectionAlert />
      <AppLoading />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:max-w-[848px] md:max-h-[638px] w-full h-full md:p-2">
        <div className="relative sm:p-4 p-3 bg-white md:rounded-2xl shadow-tight shadow-primary w-full h-full flex flex-col">
          {children}
        </div>
      </div>
    </>
  )
}

export default Layout
