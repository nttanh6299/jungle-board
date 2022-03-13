import React from 'react'
import clsx from 'clsx'
import useTabs from 'hooks/useTabs'
import Show from 'components/Show'
import { useSettingsStore } from 'store/settings'
import styles from './menuSettings.module.scss'
import AudioTab from './AudioTab'
import GameTab from './GameTab'
import VideoTab from './VideoTab'
import ControlsTab from './ControlsTab'

enum Tab {
  GAME = 'game',
  AUDIO = 'audio',
  VIDEO = 'video',
  CONTROLS = 'controls',
}

const tabs = [
  {
    label: 'Game',
    value: Tab.GAME,
  },
  {
    label: 'Audio',
    value: Tab.AUDIO,
  },
  {
    label: 'Video',
    value: Tab.VIDEO,
  },
  {
    label: 'Controls',
    value: Tab.CONTROLS,
  },
]

const MenuSettings: React.FC = () => {
  const { onToggleMenu } = useSettingsStore((state) => ({
    onToggleMenu: state.actions.onToggleMenu,
  }))
  const { selected, onChange } = useTabs(Tab.GAME)

  return (
    <div className={styles.container}>
      <h2>Settings</h2>
      <div onClick={onToggleMenu} className={styles.close}>
        x
      </div>
      <ul className={styles.tabs}>
        {tabs.map((tab) => (
          <li
            key={tab.value}
            className={clsx([styles.tab], { [styles.selected]: tab.value === selected })}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
      <div className={styles.menu}>
        <Show when={selected === Tab.GAME}>
          <GameTab />
        </Show>
        <Show when={selected === Tab.AUDIO}>
          <AudioTab />
        </Show>
        <Show when={selected === Tab.VIDEO}>
          <VideoTab />
        </Show>
        <Show when={selected === Tab.CONTROLS}>
          <ControlsTab />
        </Show>
      </div>
    </div>
  )
}

export default MenuSettings
