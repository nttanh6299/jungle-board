import { useState, ChangeEvent, useRef } from 'react'
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
import { cooldownOptions, turnOptions } from 'constants/game'
import { createRoom, ReqCreateRoom } from 'apis/room'
import useAppState from 'hooks/useAppState'
import { useTranslation } from 'react-i18next'
import useRoomThemes from 'hooks/useRoomThemes'
import useIsomorphicLayoutEffect from 'hooks/useIsomorphicLayoutEffect'
import Show from 'components/Show'
import ThemeItem from './ThemeItem'
import Modal from 'components/Modal'
import { ResGetTheme } from 'apis/item'
import useBoolean from 'hooks/useBoolean'

const NewRoom = () => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { user, isLoading, isFetched, getMe } = useMe()
  const [, dispatch] = useAppState()

  const [name, setName] = useState('')
  const [selectedTurn, setSelectedTurn] = useState(turnOptions[0].value)
  const [selectedCooldown, setSelectedCooldown] = useState(cooldownOptions[0].value)
  const [isPrivateRoom, setIsPrivateRoom] = useState(false)

  const { themes, isFetchingThemes, getThemes, buyTheme, isBuyingTheme } = useRoomThemes()
  const [selectedTheme, setSelectedTheme] = useState<ResGetTheme>()

  const themeSelectedToBuy = useRef('')

  const openBuyModalState = useBoolean()
  const openErrorModalState = useBoolean()

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    if (value.length <= 20) {
      setName(value)
    }
  }

  const onBuyTheme = async () => {
    try {
      const foundTheme = themes?.find((theme) => theme.id === themeSelectedToBuy.current)
      if (user?.coin >= foundTheme?.price) {
        await buyTheme(themeSelectedToBuy.current, async () => {
          await getMe()
          openBuyModalState.off()
          themeSelectedToBuy.current = ''
        })
      } else {
        openBuyModalState.off()
        openErrorModalState.on()
      }
    } catch (error) {
      openBuyModalState.off()
      openErrorModalState.on()
    }
  }

  const onThemeClick = (theme: ResGetTheme, canBuy: boolean) => {
    if (canBuy) {
      themeSelectedToBuy.current = theme.id
      openBuyModalState.on()
    } else {
      setSelectedTheme(theme)
    }
  }

  const onCreateRoom = async () => {
    try {
      const params: ReqCreateRoom = {
        name: name.trim(),
        cooldown: +selectedCooldown,
        maxMove: +selectedTurn,
        isPrivate: isPrivateRoom,
        theme: selectedTheme?.id,
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

  useIsomorphicLayoutEffect(() => {
    if (themes?.length) {
      const defaultTheme = themes?.find((theme) => theme.isDefault)
      if (defaultTheme) {
        setSelectedTheme(defaultTheme)
      }
      return
    }

    getThemes()
  }, [user?.id, themes, getThemes])

  return (
    <>
      <TopBar hideAutoJoin hideRoomInfo />
      <div className="bg-primary rounded-lg mt-2 md:mt-3 md:min-h-[424px] mb-auto">
        <div className="p-2 h-full">
          <div className="md:grid md:grid-cols-3 gap-2 h-full">
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
                <div className="grid gap-2 grid-cols-3 md:block">
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
                      <p className="text-sm text-cgreen font-normal">{selectedTheme?.name}</p>
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
                <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-3 min-h-[236px]">
                  <Show when={isFetchingThemes || !isFetched}>
                    {Array.from({ length: 6 }, (_, i) => i).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="relative bg-black/75 md:w-auto h-[114px] md:h-[166px]"></div>
                      </div>
                    ))}
                  </Show>
                  <Show when={!isFetchingThemes && isFetched}>
                    {themes?.map((theme) => {
                      const isDefaultChecked = !selectedTheme && theme.isDefault
                      const isChecked = theme.id === selectedTheme?.id
                      const canBuyTheme = !!user?.id && !theme.isDefault && !user?.themeIds?.includes(theme.id)
                      return (
                        <ThemeItem
                          key={theme.id}
                          id={theme.id}
                          image={theme.image}
                          price={theme.price}
                          isChecked={isDefaultChecked || isChecked}
                          isLocked={!user?.id}
                          canBuy={canBuyTheme}
                          onClick={() => onThemeClick(theme, canBuyTheme)}
                        />
                      )
                    })}
                  </Show>
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
          disabled={!isFetched || !selectedTheme?.id}
          variant="secondary"
          className="w-[120px]"
          onClick={onCreateRoom}
        >
          {t('new')}
        </Button>
        <div className="hidden sm:block sm:invisible w-[120px]"></div>
      </div>
      <Modal
        isOpen={openBuyModalState.value}
        onClose={openBuyModalState.off}
        onOk={onBuyTheme}
        isOkLoading={isBuyingTheme}
        title={t('buyTheme')}
        description={t('makeMoneyIsHard')}
        okButtonTitle={isBuyingTheme ? t('loading') : t('confirm')}
        cancelButtonTitle={t('cancel')}
      />
      <Modal
        isOpen={openErrorModalState.value}
        onClose={openErrorModalState.off}
        onOk={openErrorModalState.off}
        title={t('buyThemeFailed')}
        description={t(`notEnoughCoin`)}
        okButtonTitle={t('confirm')}
      />
    </>
  )
}

export default NewRoom
