import { useState } from 'react'
import CloseIcon from 'icons/Close'
import Select from 'components/Select'
import Button from 'components/Button'
import RangeSlider from 'components/RangeSlider'
import GearIcon from 'icons/Gear'
import Show from 'components/Show'

const languages: Utils.IOption[] = [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: 'Vietnamese',
    value: 'vi',
  },
]

interface SettingsProps {
  label: string
}

const Settings = ({ label }: SettingsProps) => {
  const [language, setLanguage] = useState(languages[0].value)
  const [openMenuSettings, setOpenMenu] = useState(false)

  const toggleMenuSettings = () => setOpenMenu((prev) => !prev)

  return (
    <>
      <div onClick={toggleMenuSettings} className="cursor-pointer">
        <GearIcon />
      </div>
      <Show when={openMenuSettings}>
        <div
          className="absolute inset-0 bg-black bg-opacity-75 rounded-2xl transition-opacity z-20"
          onClick={toggleMenuSettings}
        />
        <div className="absolute right-0 top-0 bottom-0 z-30">
          <div className="pointer-events-none overflow-hidden rounded-2xl flex max-w-full h-full">
            <div className="pointer-events-auto relative w-[300px] max-w-md bg-white">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-primary">
                  <div className="text-lg font-medium text-white">{label}</div>
                  <button type="button" onClick={toggleMenuSettings}>
                    <span className="sr-only">Close panel</span>
                    <CloseIcon />
                  </button>
                </div>
                <div className="relative p-4 text-base">
                  <Select options={languages} selected={language} onChange={setLanguage} />
                  <Button size="sm" className="font-normal rounded-md mt-4">
                    How to play
                  </Button>
                  <div className="mt-4">
                    <div className="grid grid-cols-4 items-center">
                      <div>Music</div>
                      <div className="col-span-3">
                        <RangeSlider />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center mt-1">
                      <div>SFX</div>
                      <div className="col-span-3">
                        <RangeSlider />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  )
}

export default Settings
