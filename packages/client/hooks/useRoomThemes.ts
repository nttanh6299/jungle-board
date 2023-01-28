import { useCallback, useState } from 'react'
import { getThemes as getThemesAPI, ResGetTheme } from 'apis/item'
import { buyTheme as buyThemeAPI } from 'apis/user'

const useRoomThemes = () => {
  const [themes, setThemes] = useState<ResGetTheme[]>([])
  const [isFetchingThemes, setIsFetchingTheme] = useState(false)
  const [isBuyingTheme, setIsBuyingTheme] = useState(false)

  const getThemes = useCallback(async () => {
    try {
      setIsFetchingTheme(true)
      const { data: themes = [] } = await getThemesAPI()
      setThemes(themes)
      return themes
    } catch (_) {
      console.error('Fetch themes error!')
    } finally {
      setIsFetchingTheme(false)
    }
  }, [])

  const buyTheme = async (themeId: string, onSuccess?: () => void) => {
    try {
      setIsBuyingTheme(true)
      const { data: isSuccessful } = await buyThemeAPI(themeId)
      if (isSuccessful) {
        onSuccess && onSuccess()
      }
    } catch (_) {
      console.error('Buy theme error!')
    } finally {
      setIsBuyingTheme(false)
    }
  }

  return {
    themes,
    isFetchingThemes,
    isBuyingTheme,
    getThemes,
    buyTheme,
  }
}

export default useRoomThemes
