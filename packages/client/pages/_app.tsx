import { AppProps } from 'next/app'
import { NextPage } from 'next'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import AppStateProvider from 'contexts/AppStateProvider'
import Layout from 'components/Layout'
import 'styles/app.css'

type ICustomAppProps = AppProps<{
  session: Session
}> & {
  Component: NextPage
}

const App: React.FC<ICustomAppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <AppStateProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppStateProvider>
    </SessionProvider>
  )
}

export default App
