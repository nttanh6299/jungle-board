import React from 'react'
import useAppState from 'hooks/useAppState'
import Show from 'components/Show'
import MenuSettings from 'components/MenuSettings'
import Auth from 'components/Auth'
import { useSettingsStore } from 'store/settings'

const Layout: React.FC = ({ children }) => {
  const [openMenuSettings, toggleMenuSettings] = useSettingsStore((state) => [
    state.openMenu,
    state.actions.onToggleMenu,
  ])
  const [{ loading: appLoading }] = useAppState()

  return (
    <div className="relative p-4">
      <Show when={appLoading}>
        <div className="fixed z-10 top-0 left-0 right-0 bottom-0 bg-black/[.75]">
          <span className="flex h-10 w-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-10 w-10 bg-gray-500"></span>
          </span>
        </div>
      </Show>
      <Show when={openMenuSettings}>
        <MenuSettings />
      </Show>
      <button onClick={toggleMenuSettings} className="fixed top-[10px] right-[10px] block p-2">
        Settings
      </button>
      <Auth>{children}</Auth>
    </div>
  )
}

export default Layout
