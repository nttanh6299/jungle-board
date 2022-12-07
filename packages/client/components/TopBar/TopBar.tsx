import { signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import Button from 'components/Button'
import Popover from 'components/Popover'
import Show from 'components/Show'
import useMe from 'hooks/useMe'
import FacebookIcon from 'icons/Facebook'
import InfoIcon from 'icons/Info'
import GithubIcon from 'icons/Github'
import GoogleIcon from 'icons/Google'
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

interface TopBarProps {
  hideAutoJoin?: boolean
  hideInfo?: boolean
  hideRoomInfo?: boolean
}

const TopBar = ({ hideAutoJoin, hideInfo, hideRoomInfo }: TopBarProps) => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { user, isLoading } = useMe()
  const [, dispatch] = useAppState()
  const { room } = useRoomStore((state) => ({
    room: state.room,
  }))
  const exp = user?.xp || 0
  const { level, expNextLevelNeeded } = calculateLevel(exp)

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

  return (
    <div className="flex justify-between">
      <div className="flex">
        <Show when={!hideInfo}>
          <Avatar onClick={() => signOut()} size="lg" />
          <Show when={!isLoading}>
            <div className="ml-3">
              <Show when={!user}>
                <h5 className="text-base">{t('guest')}</h5>
                <Popover title={t('loginInHere')} className="p-4">
                  <p className="text-lg">{t('unlockFeatures')}</p>
                  <div className="mt-3 flex">
                    <Button
                      className="font-medium min-w-[140px] bg-google border-google shadow-google/25"
                      rounded
                      iconLeft={<GoogleIcon />}
                      onClick={() => signIn('google')}
                    >
                      Google
                    </Button>
                    <Button
                      className="font-medium min-w-[140px] ml-4 bg-facebook border-facebook shadow-facebook/25"
                      rounded
                      iconLeft={<FacebookIcon />}
                      onClick={() => signIn('facebook')}
                    >
                      Facebook
                    </Button>
                    <Button
                      className="font-medium min-w-[140px] ml-4 bg-github border-github shadow-github/25"
                      rounded
                      iconLeft={<GithubIcon />}
                      onClick={() => signIn('github')}
                    >
                      Github
                    </Button>
                  </div>
                </Popover>
              </Show>
              <Show when={!!user}>
                <h5 className="text-base">{user?.name}</h5>
                <div className="flex items-center my-1">
                  <div className="flex items-center justify-center w-[20px] h-[20px] bg-corange text-white text-xs rounded-full">
                    {level}
                  </div>
                  <div className="relative w-[180px] h-[16px] bg-[#f5f5f5] rounded-full overflow-hidden ml-1.5">
                    <div
                      style={{ width: `${(exp / expNextLevelNeeded) * 100}%` }}
                      className="absolute top-0 left-0 h-full rounded-full bg-primary"
                    ></div>
                    <div className="absolute left-[8px] top-0 h-full text-white text-xs flex items-center">
                      {exp}/{expNextLevelNeeded}
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
        </Show>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex mb-2.5">
          <Show when={!hideRoomInfo}>
            <div className="mr-2">
              <Tooltip
                title={
                  <div>
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
          <Settings label={t('settings')} />
        </div>
        <Show when={!hideAutoJoin}>
          <Button uppercase rounded iconLeft={<RocketLauchIcon />} onClick={onAutoJoinRoom}>
            {t('autoJoin')}
          </Button>
        </Show>
      </div>
    </div>
  )
}

export default TopBar
