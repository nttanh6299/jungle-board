import { signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import Button from 'components/Button'
import MenuSettings from 'components/MenuSettings'
import Popover from 'components/Popover'
import Show from 'components/Show'
import useMe from 'hooks/useMe'
import FacebookIcon from 'icons/Facebook'
import GearIcon from 'icons/Gear'
import InfoIcon from 'icons/Info'
import GithubIcon from 'icons/Github'
import GoogleIcon from 'icons/Google'
import { useSettingsStore } from 'store/settings'
import CoinsIcon from 'icons/Coins'
import formatCoin from 'utils/formatCoin'
import calculateLevel from 'utils/calculateLevel'
import RocketLauchIcon from 'icons/RocketLauch'
import { autoJoinRoom } from 'apis/room'
import useAppState from 'hooks/useAppState'
import Avatar from 'components/Avatar'
import Tooltip from 'components/Tooltip'
import { useRoomStore } from 'store/room'

interface TopBarProps {
  hideAutoJoin?: boolean
  hideInfo?: boolean
  hideRoomInfo?: boolean
}

const TopBar = ({ hideAutoJoin, hideInfo, hideRoomInfo }: TopBarProps) => {
  const router = useRouter()
  const { user, isLoading } = useMe()
  const [, dispatch] = useAppState()
  const { room } = useRoomStore((state) => ({
    room: state.room,
  }))
  const [openMenuSettings, toggleMenuSettings] = useSettingsStore((state) => [
    state.openMenu,
    state.actions.onToggleMenu,
  ])
  const exp = user?.xp || 0
  const { level, expNextLevelNeeded } = calculateLevel(exp)

  const onAutoJoinRoom = async () => {
    try {
      dispatch({ type: 'displayLoader', payload: { value: true } })
      const { data } = await autoJoinRoom()

      let errorLabel = ''
      if (!data.roomId) {
        errorLabel = 'No rooms can join!'
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
    <>
      <Show when={openMenuSettings}>
        <MenuSettings />
      </Show>
      <div className="flex justify-between">
        <div className="flex">
          <Show when={!hideInfo}>
            <Avatar onClick={() => signOut()} size="lg" />
            <Show when={!isLoading}>
              <div className="ml-3">
                <Show when={!user}>
                  <h5 className="text-base">Guest</h5>
                  <Popover title="Login in here" className="p-4">
                    <p className="text-lg">Unlock our awesome features now</p>
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
              <div className="cursor-pointer mr-2">
                <Tooltip
                  title={
                    <div>
                      <div>Max turns: {room?.maxMove}</div>
                      <div>Cooldown: {room?.cooldown}</div>
                      <div>Theme: {room?.theme}</div>
                    </div>
                  }
                  position="bottom"
                  className="top-[120%]"
                >
                  <InfoIcon />
                </Tooltip>
              </div>
            </Show>
            <div onClick={toggleMenuSettings} className="cursor-pointer">
              <GearIcon />
            </div>
          </div>
          <Show when={!hideAutoJoin}>
            <Button uppercase rounded iconLeft={<RocketLauchIcon />} onClick={onAutoJoinRoom}>
              Auto Join
            </Button>
          </Show>
        </div>
      </div>
    </>
  )
}

export default TopBar
