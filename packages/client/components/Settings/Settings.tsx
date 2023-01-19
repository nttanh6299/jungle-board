import { useState, memo } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import CloseIcon from 'icons/Close'
import Select from 'components/Select'
import Button from 'components/Button'
import GearIcon from 'icons/Gear'
import Show from 'components/Show'
import { useGameStore } from 'store/game'
import { ERoomStatus } from 'constants/enum'
import LogoutIcon from 'icons/Logout'
import useMe from 'hooks/useMe'
import { clearAccessToken } from 'utils'
// import RangeSlider from 'components/RangeSlider'

const languages: Utils.IOption[] = [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: 'Tiếng Việt',
    value: 'vi',
  },
]

interface SettingsProps {
  label: string
  hideLogout?: boolean
}

const Settings = ({ label, hideLogout }: SettingsProps) => {
  const router = useRouter()
  const { locale, defaultLocale } = router
  const [language, setLanguage] = useState(locale || defaultLocale || languages[0].value)
  const [openMenuSettings, setOpenMenu] = useState(false)
  const { user, clearUser } = useMe()

  const isPlaying = useGameStore((state) => state.gameStatus === ERoomStatus.PLAYING)

  const { t } = useTranslation('common')

  const toggleMenuSettings = () => setOpenMenu((prev) => !prev)

  const onSelectLanguage = (language: string) => {
    setLanguage(language)

    const { pathname, asPath, query } = router
    router.push({ pathname, query }, asPath, { locale: language })
  }

  const onLogout = () => {
    clearAccessToken()
    clearUser()
    toggleMenuSettings()
  }

  return (
    <>
      <div onClick={toggleMenuSettings} className="cursor-pointer">
        <GearIcon />
      </div>
      <Show when={openMenuSettings}>
        <div
          className="absolute inset-0 bg-black bg-opacity-75 md:rounded-2xl transition-opacity z-20"
          onClick={toggleMenuSettings}
        />
        <div className="absolute right-0 top-0 bottom-0 z-30">
          <div className="pointer-events-none flex max-w-full h-full">
            <div className="pointer-events-auto relative w-[300px] max-w-md bg-white md:rounded-2xl overflow-hidden">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-primary">
                  <div className="text-lg font-medium text-white">{label}</div>
                  <button type="button" onClick={toggleMenuSettings}>
                    <CloseIcon />
                  </button>
                </div>
                <div className="flex-1 flex flex-col relative p-3 md:p-4 text-base">
                  <Select
                    options={languages}
                    selected={language}
                    onChange={onSelectLanguage}
                    disabled={isPlaying}
                    title={isPlaying ? t('cannotChangeLanguageWhilePlaying') : ''}
                  />
                  <a
                    href="https://en.wikipedia.org/wiki/Jungle_(board_game)"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mb-auto"
                  >
                    <Button size="sm" className="font-normal rounded-md mt-4">
                      {t('howToPlay')}
                    </Button>
                  </a>
                  <Show when={!hideLogout && !!user}>
                    <Button
                      rounded
                      uppercase
                      size="sm"
                      className="self-end"
                      iconLeft={<LogoutIcon />}
                      onClick={onLogout}
                    >
                      {t('logout')}
                    </Button>
                  </Show>
                  {/* <div className="mt-4">
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
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  )
}

export default memo(Settings)
