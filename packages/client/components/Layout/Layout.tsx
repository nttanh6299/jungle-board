import React from 'react'
import useAppState from 'hooks/useAppState'
import styles from './layout.module.scss'

const Layout: React.FC = ({ children }) => {
  const [{ loading: appLoading }] = useAppState()

  return (
    <div className={styles['container']}>
      {appLoading && (
        <div className={styles['loader']}>
          <div className={styles['lds-ripple']}>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}

export default Layout
