import { useState, ChangeEvent } from 'react'
import { useRouter } from 'next/router'
import Button from 'components/Button'
import ErrorBoundary from 'components/ErrorBoundary'
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

const NewRoom = () => {
  const router = useRouter()
  const { user, isLoading } = useMe()
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
      if (!data) errorLabel = 'Something went wrong!'

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
      <TopBar hideAutoJoin />
      <div className="bg-primary rounded-lg mt-3 max-h-[422px]">
        <ErrorBoundary>
          <div className="p-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-lg px-4 py-3">
                <h4 className="text-lg font-normal">1. Settings</h4>
                <div className="mt-4">
                  <Input placeholder="Your awesome room name" value={name} onChange={onNameChange} />
                  <div className="text-xs text-right mt-1 text-placeholder font-normal">
                    Your room limits 20 characters
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex items-center">
                      <HandFistIcon />
                      <div className="text-base ml-2">Turns</div>
                    </div>
                    <div className="w-[80px]">
                      <Select options={turnOptions} selected={selectedTurn} onChange={setSelectedTurn} />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex items-center">
                      <ClockIcon />
                      <div className="text-base ml-2">Cooldown</div>
                    </div>
                    <div className="w-[80px]">
                      <Select options={cooldownOptions} selected={selectedCooldown} onChange={setSelectedCooldown} />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex items-center">
                      <EyeIcon />
                      <div className="text-base ml-2">Private</div>
                    </div>
                    <div className="flex justify-end">
                      <Switch enabled={isPrivateRoom} toggle={setIsPrivateRoom} />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex items-center">
                      <PenIcon />
                      <div className="text-base ml-2">Theme</div>
                    </div>
                    <div className="flex items-center">
                      <p className="text-sm text-cgreen font-normal">Rainforest</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-2 bg-white rounded-lg px-4 py-3">
                <div className="flex justify-between">
                  <h4 className="text-lg font-normal">2. Theme</h4>
                  {!isLoading && !user?.id && (
                    <p className="text-sm font-light text-corange self-center">Login to unlock your own</p>
                  )}
                </div>
                <div className="mt-4">
                  <div className="grid gap-2 grid-cols-3">
                    {mapOptions.map((map) => (
                      <div key={map.name} className="relative bg-black/75 h-[166px]">
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
        </ErrorBoundary>
      </div>
      <div className="mt-4 flex justify-between">
        <Button rounded uppercase variant="primary" iconLeft={<ArrowLeftIcon />} className="w-[120px]" onClick={goBack}>
          Back
        </Button>
        <Button
          iconLeft={<FilmScriptIcon />}
          rounded
          uppercase
          variant="secondary"
          className="w-[120px]"
          onClick={onCreateRoom}
        >
          New
        </Button>
        <div className="invisible w-[120px]"></div>
      </div>
    </>
  )
}

export default NewRoom