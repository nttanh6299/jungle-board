export interface AppError {
  type: 'unhandled'
  id: string | null | undefined
}

interface AppState {
  loading: boolean
  error: AppError
}

export const initialAppState: AppState = {
  loading: true,
  error: null,
}

export default AppState
