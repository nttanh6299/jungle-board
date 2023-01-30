import { useEffect, useState } from 'react'
import AdminContainer from 'components/AdminContainer'
import useRoomThemes from 'hooks/useRoomThemes'
import { configTheme, ReqThemeConfig } from 'apis/item'

interface ThemeConfigProps {
  id: string
  themeId: string
  playerDen: string
  opponentDen: string
  trap: string
  land: string
  river: string
  borderLand: string
  borderPossibleMove: string
  borderSelected: string
}
const ThemeConfig = ({ id, themeId, ...props }: ThemeConfigProps) => {
  const [loading, setLoading] = useState(false)
  const [playerDen, setPlayerDen] = useState(props.playerDen)
  const [opponentDen, setOpponentDen] = useState(props.opponentDen)
  const [trap, setTrap] = useState(props.trap)
  const [land, setLand] = useState(props.land)
  const [river, setRiver] = useState(props.river)
  const [borderLand, setBorderLand] = useState(props.borderLand)
  const [borderPossibleMove, setBorderPossibleMove] = useState(props.borderPossibleMove)
  const [borderSelected, setBorderSelected] = useState(props.borderSelected)

  const onSave = async () => {
    try {
      setLoading(true)
      const payload: ReqThemeConfig = {
        itemId: themeId,
        playerDen,
        opponentDen,
        trap,
        land,
        river,
        borderLand,
        borderPossibleMove,
        borderSelected,
      }

      if (id) {
        payload.id = id
      }

      await configTheme(payload)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      <input
        className="border px-2 py-1 mb-1"
        placeholder="Player den"
        value={playerDen}
        onChange={(e) => setPlayerDen(e.target.value)}
      />
      <input
        className="border px-2 py-1 mb-1"
        placeholder="Opponent den"
        value={opponentDen}
        onChange={(e) => setOpponentDen(e.target.value)}
      />
      <input
        className="border px-2 py-1 mb-1"
        placeholder="Trap"
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
      />
      <input
        className="border px-2 py-1 mb-1"
        placeholder="Land"
        value={land}
        onChange={(e) => setLand(e.target.value)}
      />
      <input
        className="border px-2 py-1 mb-1"
        placeholder="River"
        value={river}
        onChange={(e) => setRiver(e.target.value)}
      />
      <input
        className="border px-2 py-1 mb-1"
        placeholder="Border land"
        value={borderLand}
        onChange={(e) => setBorderLand(e.target.value)}
      />
      <input
        className="border px-2 py-1 mb-1"
        placeholder="Border Possible Move"
        value={borderPossibleMove}
        onChange={(e) => setBorderPossibleMove(e.target.value)}
      />
      <input
        className="border px-2 py-1 mb-1"
        placeholder="Border Selected Piece"
        value={borderSelected}
        onChange={(e) => setBorderSelected(e.target.value)}
      />
      <button className="border py-1" disabled={loading} onClick={onSave}>
        {loading ? 'Loading' : 'Save'}
      </button>
    </div>
  )
}

const ThemePage = () => {
  const { themes, getThemes } = useRoomThemes()

  useEffect(() => {
    getThemes()
  }, [getThemes])

  console.log(themes)

  return (
    <AdminContainer>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 text-sm md:text-base gap-2">
        {themes?.map((theme) => (
          <div key={theme.id} className="border">
            <div className="p-1">
              <div className="text-green-600 mb-1">{theme.name}</div>
              <ThemeConfig
                id={theme.config?._id || theme.config?.id || ''}
                themeId={theme.id}
                playerDen={theme.config?.playerDen}
                opponentDen={theme.config?.opponentDen}
                trap={theme.config?.trap}
                land={theme.config?.land}
                river={theme.config?.river}
                borderLand={theme.config?.borderLand}
                borderPossibleMove={theme.config?.borderPossibleMove}
                borderSelected={theme.config?.borderSelected}
              />
            </div>
          </div>
        ))}
      </div>
    </AdminContainer>
  )
}

export default ThemePage
