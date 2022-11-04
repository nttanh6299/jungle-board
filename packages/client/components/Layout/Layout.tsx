import { PropsWithChildren, useEffect } from 'react'
import useMe from 'hooks/useMe'
import AppLoading from 'components/AppLoading'

const Layout = ({ children }: PropsWithChildren<unknown>) => {
  const { status, getMe } = useMe()

  useEffect(() => {
    if (status === 'authenticated') {
      getMe()
    }
  }, [getMe, status])

  if (status === 'loading') return null

  return (
    <>
      <AppLoading />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[848px] max-h-[638px] w-full h-full p-2">
        <div className="relative sm:p-4 p-2 bg-white rounded-2xl shadow-tight shadow-primary w-full h-full">
          {children}
        </div>
      </div>
    </>
  )
}

export default Layout
