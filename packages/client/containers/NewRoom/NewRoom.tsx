import { useState, ChangeEvent } from 'react'
import { useRouter } from 'next/router'
import Button from 'components/Button'
import Input from 'components/Input'
import Select from 'components/Select'
import Switch from 'components/Switch'
import TopBar from 'components/TopBar'
import useMe from 'hooks/useMe'
import ClockIcon from 'icons/Clock'
import EyeIcon from 'icons/Eye'
import HandFistIcon from 'icons/HandFist'
import PenIcon from 'icons/Pen'
import ArrowLeftIcon from 'icons/ArrowLeft'
import FilmScriptIcon from 'icons/FilmScript'
import { cooldownOptions, turnOptions, mapOptions } from 'constants/game'
import { Map } from 'constants/enum'
import CheckIcon from 'icons/Check'
import LockIcon from 'icons/Lock'
import { createRoom, ReqCreateRoom } from 'apis/room'
import useAppState from 'hooks/useAppState'
import { useTranslation } from 'react-i18next'

const NewRoom = () => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { user, isLoading, isFetched } = useMe()
  const [, dispatch] = useAppState()
  const [name, setName] = useState('')
  const [selectedTurn, setSelectedTurn] = useState(turnOptions[0].value)
  const [selectedCooldown, setSelectedCooldown] = useState(cooldownOptions[0].value)
  const [isPrivateRoom, setIsPrivateRoom] = useState(false)
  const [selectedTheme] = useState(Map.RAINFOREST)

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 20) {
      setName(e.target.value)
    }
  }

  const onCreateRoom = async () => {
    try {
      const params: ReqCreateRoom = {
        name: name.trim(),
        cooldown: +selectedCooldown,
        maxMove: +selectedTurn,
        isPrivate: isPrivateRoom,
        theme: selectedTheme,
      }
      dispatch({ type: 'displayLoader', payload: { value: true } })
      const { data } = await createRoom(params)

      let errorLabel = ''
      if (!data) errorLabel = t('error.somethingWrong')

      if (errorLabel) {
        alert(errorLabel)
        router.reload()
      } else {
        router.push('/room/' + data.id)
      }
    } catch (error) {
      console.log('Create room error: ', error)
    }
  }

  const goBack = () => {
    router.push('/')
  }

  return (
    <>
      <TopBar hideAutoJoin hideRoomInfo />
      <div className="bg-primary rounded-lg mt-2 md:mt-3 md:max-h-[422px] mb-auto">
        <div className="p-2">
          <div className="md:grid md:grid-cols-3 gap-2">
            <div className="bg-white rounded-lg px-3 md:px-4 py-3">
              <h4 className="hidden md:block text-lg font-normal">1. {t('settings')}</h4>
              <div className="md:mt-4">
                <div className="flex md:block">
                  <div className="flex-1">
                    <Input placeholder={t('yourRoomName')} value={name} onChange={onNameChange} />
                    <div className="text-xs text-right mt-1 text-placeholder font-normal">
                      {t('inputLimitCharacter')}
                    </div>
                  </div>
                  <div className="ml-2 block md:hidden justify-between items-center">
                    <div className="hidden md:flex items-center">
                      <EyeIcon />
                      <div className="text-base ml-2">{t('private')}</div>
                    </div>
                    <div className="md:flex justify-end">
                      <span className="block md:hidden text-sm mb-1 md:mb-0">{t('private')}</span>
                      <Switch enabled={isPrivateRoom} toggle={setIsPrivateRoom} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between md:block">
                  <div className="mt-2 md:mt-6 flex justify-between items-center">
                    <div className="hidden md:flex items-center">
                      <HandFistIcon />
                      <div className="text-base ml-2">{t('turns')}</div>
                    </div>
                    <div className="flex flex-col w-[80px]">
                      <span className="block md:hidden text-sm mb-1 md:mb-0">{t('turns')}</span>
                      <Select options={turnOptions} selected={selectedTurn} onChange={setSelectedTurn} />
                    </div>
                  </div>
                  <div className="mt-2 md:mt-6 ml-2 md:ml-0 flex justify-between items-center">
                    <div className="hidden md:flex items-center">
                      <ClockIcon />
                      <div className="text-base ml-2">{t('cooldown')}</div>
                    </div>
                    <div className="w-[80px]">
                      <span className="block md:hidden text-sm mb-1 md:mb-0">{t('cooldown')}</span>
                      <Select options={cooldownOptions} selected={selectedCooldown} onChange={setSelectedCooldown} />
                    </div>
                  </div>
                  <div className="mt-2 md:mt-6 hidden md:flex justify-between items-center">
                    <div className="hidden md:flex items-center">
                      <EyeIcon />
                      <div className="text-base ml-2">{t('private')}</div>
                    </div>
                    <div className="flex justify-end">
                      <Switch enabled={isPrivateRoom} toggle={setIsPrivateRoom} />
                    </div>
                  </div>
                  <div className="mt-2 md:mt-6 ml-2 md:ml-0 flex justify-between md:items-center">
                    <div className="hidden md:flex items-center">
                      <PenIcon />
                      <div className="text-base ml-2">{t('theme')}</div>
                    </div>
                    <div className="md:flex items-center">
                      <span className="block md:hidden text-sm mb-1 md:mb-0">{t('theme')}</span>
                      <p className="text-sm text-cgreen font-normal">Rainforest</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 bg-white rounded-lg px-3 md:px-4 py-3 mt-2 md:mt-0">
              <div className="flex justify-between">
                <h4 className="hidden md:block text-lg font-normal">2. {t('theme')}</h4>
                {!isLoading && !user?.id && (
                  <p className="mb-1 md:mb-0 text-sm font-light text-corange self-center">{t('loginToUnlockOwn')}</p>
                )}
              </div>
              <div className="md:mt-4">
                <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-3">
                  {mapOptions.map((map) => (
                    <div key={map.name} className="relative bg-black/75 md:w-auto md:h-[166px]">
                      <img src={map.src} loading="lazy" className="z-0 inline-block h-full w-full" />
                      <div className="absolute inset-0 bg-black/75 flex justify-center items-center cursor-pointer">
                        {map.name === selectedTheme ? <CheckIcon /> : <LockIcon />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <Button rounded uppercase variant="primary" iconLeft={<ArrowLeftIcon />} onClick={goBack}>
          {t('back')}
        </Button>
        <Button
          iconLeft={<FilmScriptIcon />}
          rounded
          uppercase
          disabled={!isFetched}
          variant="secondary"
          className="w-[120px]"
          onClick={onCreateRoom}
        >
          {t('new')}
        </Button>
        <div className="hidden sm:block sm:invisible w-[120px]"></div>
      </div>
    </>
  )
}

export default NewRoom
