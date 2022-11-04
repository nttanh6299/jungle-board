import React from 'react'
import clsx from 'clsx'
import useTabs from 'hooks/useTabs'
import Show from 'components/Show'
import { useSettingsStore } from 'store/settings'
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
    <div className="p-4 absolute top-0 left-0 right-0 bottom-0 bg-black/[.75] text-white uppercase z-[1]">
      <h2 className="text-3xl font-semibold">Settings</h2>
      <div
        onClick={onToggleMenu}
        className="absolute top-[10px] right-[10px] py-2 px-3 cursor-pointer border border-white"
      >
        x
      </div>
      <ul className="flex mt-4 list-none">
        {tabs.map((tab) => (
          <li
            key={tab.value}
            className={clsx('cursor-pointer text-xl block p-4 border border-white sibling:ml-4', {
              'border border-yellow-400': tab.value === selected,
            })}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
      <div className="mt-4">
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
