import { AppProps } from 'next/app'
import { NextPage } from 'next'
import AppStateProvider from 'contexts/AppStateProvider'
import SocketProvider from 'contexts/SocketProvider'
import Layout from 'components/Layout'
import 'styles/_app.scss'

type ICustomNextPage = NextPage & {
  requireSocket?: boolean
}

type ICustomAppProps = AppProps & {
  Component: ICustomNextPage
}

const App: React.FC<ICustomAppProps> = ({ Component, pageProps }) => {
  const RequireSocketProvider = Component.requireSocket ? SocketProvider : ({ children }) => <>{children}</>

  return (
    <AppStateProvider>
      <RequireSocketProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RequireSocketProvider>
    </AppStateProvider>
  )
}

export default App
