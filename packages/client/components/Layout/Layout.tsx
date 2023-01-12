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
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:max-w-[848px] md:max-h-[638px] w-full h-full md:p-2">
        <div className="relative sm:p-4 p-3 bg-white md:rounded-2xl shadow-tight shadow-primary w-full h-full flex flex-col">
          {children}
        </div>
      </div>
    </>
  )
}

export default Layout
