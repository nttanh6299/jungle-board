export interface AppError {
  type: 'unhandled'
  id: string | null | undefined
}

interface AppState {
  loading: boolean
  error: AppError
}

export const initialAppState: AppState = {
  loading: false,
  error: null,
}

export default AppState
