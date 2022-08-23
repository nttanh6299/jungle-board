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
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/[.75]">
          <div className="inline-block width-[80px] height-[80px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="animate-ripple absolute border-4 border-solid border-white rounded-full opacity-100"></div>
            <div className="animate-ripple absolute border-4 border-solid border-white rounded-full opacity-100 sibling:animation-delay-[-500]"></div>
          </div>
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
