import Layout from 'components/Layout'
import AppStateProvider from 'contexts/AppStateProvider'
import 'styles/_app.scss'

export default function App({ Component, pageProps }) {
  return (
    <AppStateProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppStateProvider>
  )
}
