import { useCallback, useState } from 'react'
import { getThemes as getThemesAPI } from 'apis/item'
import { buyTheme as buyThemeAPI } from 'apis/user'
import { useThemeStore } from 'store/theme'

const useRoomThemes = () => {
  const { themes, onSetThemes } = useThemeStore((state) => ({
    themes: state.themes,
    onSetThemes: state.actions.onSetThemes,
  }))
  const [isFetchingThemes, setIsFetchingTheme] = useState(false)
  const [isBuyingTheme, setIsBuyingTheme] = useState(false)

  const getThemes = useCallback(async () => {
    try {
      setIsFetchingTheme(true)
      const { data: themes = [] } = await getThemesAPI()
      onSetThemes(themes)
      return themes
    } catch (_) {
      console.error('Fetch themes error!')
    } finally {
      setIsFetchingTheme(false)
    }
  }, [onSetThemes])

  const buyTheme = async (themeId: string, onSuccess?: () => void) => {
    try {
      setIsBuyingTheme(true)
      const { data: isSuccessful } = await buyThemeAPI(themeId)
      if (isSuccessful) {
        onSuccess && onSuccess()
      }
    } catch (error) {
      return Promise.reject(error?.data)
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
