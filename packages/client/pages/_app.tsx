import { AppProps } from 'next/app'
import { NextPage } from 'next'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { appWithTranslation } from 'next-i18next'
import AppStateProvider from 'contexts/AppStateProvider'
import Layout from 'components/Layout'
import RouterLoading from 'components/RouterLoading'
import ConnectionAlert from 'components/ConnectionAlert'
import AppLoading from 'components/AppLoading'
import 'styles/app.css'
import Head from 'next/head'

type ICustomAppProps = AppProps<{
  session: Session
}> & {
  Component: NextPage
}

const App: React.FC<ICustomAppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <>
      <Head>
        <title>Jungle board - Play online for FREE with friends</title>
      </Head>
      <SessionProvider session={session} refetchInterval={5 * 60} refetchOnWindowFocus={false}>
        <AppStateProvider>
          <RouterLoading height={4} color="#3EC333" options={{ showSpinner: false }} />
          <ConnectionAlert />
          <AppLoading />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppStateProvider>
      </SessionProvider>
    </>
  )
}

export default appWithTranslation(App)
