import { useEffect, memo, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import Button from 'components/Button'
import Popover from 'components/Popover'
import Show from 'components/Show'
import useMe from 'hooks/useMe'
import InfoIcon from 'icons/Info'
import CoinsIcon from 'icons/Coins'
import formatCoin from 'utils/formatCoin'
import calculateLevel from 'utils/calculateLevel'
import RocketLauchIcon from 'icons/RocketLauch'
import { autoJoinRoom } from 'apis/room'
import useAppState from 'hooks/useAppState'
import Avatar from 'components/Avatar'
import Tooltip from 'components/Tooltip'
import { useRoomStore } from 'store/room'
import Settings from 'components/Settings'
import { subscribe, unsubscribe } from 'utils/subscriber'
import { NotifyEvent } from 'constants/enum'
import { useGameStore } from 'store/game'
import getPlayerAnimals from 'utils/getPlayerAnimals'
import AnimalsStatus from 'components/AnimalsStatus'
import SocialLogin from './SocialLogin'

interface TopBarProps {
  hideAutoJoin?: boolean
  hideInfo?: boolean
  hideRoomInfo?: boolean
  hideLogout?: boolean
}

const TopBar = ({ hideAutoJoin, hideInfo, hideRoomInfo, hideLogout }: TopBarProps) => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { user, isFetched } = useMe()
  const [, dispatch] = useAppState()
  const { room } = useRoomStore((state) => ({
    room: state.room,
  }))
  const exp = user?.xp || 0
  const { level, expNext, expAfterCalculated } = useMemo(() => calculateLevel(exp), [exp])

  const { board, bothConnected } = useGameStore((state) => ({
    board: state.board,
    bothConnected: state.bothConnected,
    gameStatus: state.gameStatus,
  }))
  const { playerAnimals, opponentAnimals } = getPlayerAnimals(board)

  const onAutoJoinRoom = async () => {
    try {
      dispatch({ type: 'displayLoader', payload: { value: true } })
      const { data } = await autoJoinRoom()

      let errorLabel = ''
      if (!data.roomId) {
        errorLabel = t('error.noRoomsCanJoin')
      }

      if (errorLabel) {
        alert(errorLabel)
      } else {
        router.push('/room/' + data.roomId)
      }
    } catch (error) {
      console.log('Join room error: ', error)
    }
  }

  useEffect(() => {
    subscribe(NotifyEvent.AutoJoinRoom, onAutoJoinRoom)

    return () => {
      unsubscribe(NotifyEvent.AutoJoinRoom, onAutoJoinRoom)
    }
  })

  return (
    <div className="flex justify-between">
      <div className="flex">
        <Show when={bothConnected}>
          <div className="flex md:hidden -mt-1">
            <div>
              <Popover title={t('stats')} className="p-4">
                <div className="w-[160px]">
                  <div className="flex flex-col">
                    <h5 className="text-sm mb-1 text-opponent">{t('opponent')}</h5>
                    <div className="mb-2">
                      <AnimalsStatus alive={opponentAnimals} />
                    </div>
                  </div>
                  <div className="w-full h-[1px] border-t border-dashed border-primary" />
                  <div className="flex flex-col">
                    <div className="mt-2">
                      <AnimalsStatus alive={playerAnimals} />
                    </div>
                    <h5 className="text-sm mt-1 text-player">{user?.name || t('guest')}</h5>
                  </div>
                </div>
              </Popover>
            </div>
          </div>
        </Show>
        <Show when={!hideInfo}>
          <div className="hidden sm:block">
            <Avatar size="lg" />
          </div>
          <div className="block sm:hidden">
            <Avatar size="md" />
          </div>
          <Show when={isFetched}>
            <div className="ml-2 sm:ml-3">
              <Show when={!user}>
                <h5 className="text-sm sm:text-base">{t('guest')}</h5>
                <SocialLogin />
              </Show>
              <Show when={!!user}>
                <h5 className="text-sm sm:text-base">{user?.name}</h5>
                <div className="flex items-center my-0.5 sm:my-1">
                  <div className="flex items-center justify-center w-[20px] h-[20px] bg-corange text-white text-xs rounded-full">
                    {level}
                  </div>
                  <div className="relative w-[140px] sm:w-[180px] h-[16px] bg-[#f5f5f5] rounded-full overflow-hidden ml-1.5">
                    <div
                      style={{ width: `${(expAfterCalculated / expNext) * 100}%` }}
                      className="absolute top-0 left-0 h-full rounded-full bg-primary"
                    />
                    <div className="absolute left-[8px] top-0 h-full text-white text-xs flex items-center">
                      {expAfterCalculated}/{expNext}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <CoinsIcon />
                  <p className="text-base ml-1.5">{formatCoin(user?.coin || 0)}</p>
                </div>
              </Show>
            </div>
          </Show>
          <Show when={!isFetched}>
            <div className="ml-2 sm:ml-3">
              <div className="animate-pulse">
                <div className="bg-gray-200 w-[150px] h-[20px]"></div>
                <div className="bg-gray-200 w-[120px] h-[20px] my-1 sm:my-2"></div>
                <div className="bg-gray-200 w-[90px] h-[20px]"></div>
              </div>
            </div>
          </Show>
        </Show>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex mb-2.5">
          <Show when={!hideRoomInfo}>
            <div className="mr-2">
              <Tooltip
                title={
                  <div className="md:text-sm">
                    <div>
                      {t('maxTurns')}: {room?.maxMove}
                    </div>
                    <div>
                      {t('cooldown')}: {room?.cooldown}
                    </div>
                    <div>
                      {t('theme')}: {room?.theme}
                    </div>
                  </div>
                }
                position="bottom"
                className="top-[120%]"
              >
                <InfoIcon />
              </Tooltip>
            </div>
          </Show>
          <Settings label={t('settings')} hideLogout={hideLogout} />
        </div>
        <Show when={!hideAutoJoin}>
          <div className="hidden sm:block">
            <Button uppercase rounded iconLeft={<RocketLauchIcon />} onClick={onAutoJoinRoom} disabled={!isFetched}>
              {t('autoJoin')}
            </Button>
          </div>
        </Show>
      </div>
    </div>
  )
}

export default memo(TopBar)
