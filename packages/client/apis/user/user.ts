import { fetchApi } from 'apis/apiCaller'

export const buyTheme = async (themeId: string) => {
  return fetchApi<boolean>('/users/buy', 'POST', { themeId })
}
