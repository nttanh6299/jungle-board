import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import useInterval from 'hooks/useInterval'
import Show from 'components/Show'
import Button from 'components/Button'
import { ROOM_STATUS, UNABLE_PLAY_REASON } from 'constants/common'
import { canJoin } from 'utils'
import useRooms from './hooks/useRooms'
import useAppState from 'hooks/useAppState'
import { ResGetRoom, verifyRoom } from 'apis/room'
import { useRoomStore } from 'store/room'
import TopBar from 'components/TopBar'
import Tooltip from 'components/Tooltip'
import clsx from 'clsx'
import UsersIcon from 'icons/Users'
import HandFistIcon from 'icons/HandFist'
import ClockIcon from 'icons/Clock'
import FilmScriptIcon from 'icons/FilmScript'
import GameControllerIcon from 'icons/GameController'
import { notify } from 'utils/subscriber'
import { NotifyEvent } from 'constants/enum'
import RocketLauchIcon from 'icons/RocketLauch'
import useMe from 'hooks/useMe'

const RoomsPage = () => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const [, dispatch] = useAppState()
  const { rooms, fetching, fetch } = useRooms()
  const { isFetched } = useMe()
  const { onVerifyRoom } = useRoomStore((state) => ({
    onVerifyRoom: state.actions.onVerifyRoom,
  }))
  const [selectedRoom, setSelectedRoom] = useState<ResGetRoom>(null)

  const onNewRoom = () => {
    router.push('/new')
  }

  const onJoinRoom = async () => {
    try {
      const { id, quantity, max, status } = selectedRoom ?? {}
      if (!canJoin(quantity, max, status)) return

      dispatch({ type: 'displayLoader', payload: { value: true } })
      const { data } = await verifyRoom({ roomId: id })

      let errorLabel = ''
      if (!data) errorLabel = t('error.somethingWrong')
      if (data.reason === UNABLE_PLAY_REASON.roomFull) {
        errorLabel = t('error.roomBusy')
      } else if (data.reason === UNABLE_PLAY_REASON.playing) {
        errorLabel = t('error.alreadyInAnotherRoom')
      }

      if (errorLabel) {
        alert(errorLabel)
        router.reload()
      } else {
        onVerifyRoom(data.info)
        router.push('/room/' + id)
      }
    } catch (error) {
      console.log('Join room error: ', error)
    }
  }

  const onAutoJoinRoom = () => {
    notify(NotifyEvent.AutoJoinRoom, null)
  }

  useInterval(() => {
    fetch()
  }, 10000)

  useEffect(() => {
    if (rooms?.length) return

    // if rooms is very slowly to be fetched, open connection alert up
    const timer = setTimeout(() => {
      notify(NotifyEvent.ShowConnectionAlert, null)
    }, 5000)

    return () => {
      clearInterval(timer)
    }
  }, [rooms])

  return (
    <>
      <TopBar hideRoomInfo />
      <div className="bg-primary rounded-lg mt-2 sm:mt-3 min-h-[422px] md:max-h-[422px] overflow-auto overflow-x-hidden mb-auto">
        <div className="p-2">
          <Show when={fetching || !rooms?.length}>
            <div className="grid gap-2 grid-cols-fill-40">
              {Array.from({ length: 16 }, (_, i) => i)?.map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border-4 border-white py-2 px-3 bg-white shadow-tight shadow-cardShadow/25"
                >
                  <div className="animate-pulse">
                    <h5 className="-mt-1 bg-gray-200 w-20 h-[24px]"></h5>
                    <p className="bg-white w-4 h-[18px]"></p>
                    <div className="flex justify-end">
                      <p className="w-10 h-[20px] bg-gray-200"></p>
                    </div>
                    <div className="flex justify-between mt-1">
                      <div className="flex flex-col items-center">
                        <div className="w-[24px] h-[24px] bg-white"></div>
                        <p className="w-4 h-[20px] bg-gray-200"></p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-[24px] h-[24px] bg-white"></div>
                        <p className="w-4 h-[20px] bg-gray-200"></p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-[24px] h-[24px] bg-white"></div>
                        <p className="w-4 h-[20px] bg-gray-200"></p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Show>
          <Show when={!fetching}>
            <div className="grid gap-2 grid-cols-fill-40">
              {rooms?.map((room) => {
                const { id, name, quantity, max, status, maxMove, cooldown, theme } = room
                return (
                  <div
                    key={id}
                    className={clsx(
                      'rounded-lg border-4 border-white hover:border-cgreen/60 py-2 px-3 bg-white shadow-tight shadow-cardShadow/25 transition-all cursor-pointer',
                      { 'border-cgreen hover:!border-cgreen': selectedRoom?.id === id },
                    )}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <h5 className="text-base font-normal break-words -mt-1">{name}</h5>
                    <p className="text-sm text-placeholder -mt-[2px] font-light">{theme}</p>
                    <p
                      className={clsx(
                        'text-sm text-right font-medium',
                        ROOM_STATUS[status]?.value === ROOM_STATUS.waiting.value ? 'text-cgreen' : 'text-textPrimary',
                      )}
                    >
                      {ROOM_STATUS[status]?.label}
                    </p>
                    <div className="flex justify-between mt-1">
                      <div className="flex flex-col items-center">
                        <Tooltip title={t('players')} className="-top-[150%]">
                          <UsersIcon />
                        </Tooltip>
                        <p className={clsx('text-sm', { 'text-placeholder': quantity === max })}>
                          {quantity}/{max}
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <Tooltip title={t('maxTurns')} className="-top-[150%]">
                          <HandFistIcon />
                        </Tooltip>
                        <p className="text-sm">{maxMove}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <Tooltip title={t('cooldown')} className="-top-[150%]">
                          <ClockIcon />
                        </Tooltip>
                        <p className="text-sm">{cooldown}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Show>
        </div>
      </div>
      <div className="flex sm:hidden justify-center mt-2 sm:mt-0">
        <Button uppercase rounded disabled={!isFetched} iconLeft={<RocketLauchIcon />} onClick={onAutoJoinRoom}>
          {t('autoJoin')}
        </Button>
      </div>
      <div className="flex justify-center mt-2 sm:mt-4">
        <Button
          rounded
          uppercase
          variant="secondary"
          disabled={!isFetched}
          iconLeft={<FilmScriptIcon />}
          className="w-[120px]"
          onClick={onNewRoom}
        >
          {t('new')}
        </Button>
        <Button
          uppercase
          rounded
          disabled={!selectedRoom?.id || !isFetched}
          iconLeft={<GameControllerIcon />}
          className="w-[120px] ml-2"
          onClick={onJoinRoom}
        >
          {t('join')}
        </Button>
      </div>
    </>
  )
}

export default RoomsPage
