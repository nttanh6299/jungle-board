import React from 'react'
import useAppState from 'hooks/useAppState'
import styles from './layout.module.scss'
import Show from 'components/Show'
import MenuSettings from 'components/MenuSettings'
import { useSettingsStore } from 'store/settings'

const Layout: React.FC = ({ children }) => {
  const [openMenuSettings, toggleMenuSettings] = useSettingsStore((state) => [
    state.openMenu,
    state.actions.onToggleMenu,
  ])
  const [{ loading: appLoading }] = useAppState()

  return (
    <div className={styles['container']}>
      <Show when={appLoading}>
        <div className={styles['loader']}>
          <div className={styles['lds-ripple']}>
            <div></div>
            <div></div>
          </div>
        </div>
      </Show>
      <Show when={openMenuSettings}>
        <MenuSettings />
      </Show>
      <button onClick={toggleMenuSettings} className={styles.setting_button}>
        Settings
      </button>
      <div>{children}</div>
    </div>
  )
}

export default Layout
