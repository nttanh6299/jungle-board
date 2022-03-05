import AppState, { AppError } from './state'

export type AppStateReducerActionType = 'displayError' | 'displayLoader'

export interface AppStateReducerAction {
  payload: Partial<{
    error: AppError['type']
    errorId: AppError['id']
    value: boolean
  }>
  type: AppStateReducerActionType
}

const displayError = (prevState: AppState, error: AppError['type'], errorId?: AppError['id']): AppState => ({
  ...prevState,
  error: {
    type: error,
    id: errorId,
  },
  loading: false,
})

const displayLoader = (prevState: AppState, value: boolean): AppState => ({
  ...prevState,
  loading: value,
})

export default function appStateReducer(prevState: AppState, action: AppStateReducerAction): AppState {
  switch (action.type) {
    case 'displayError':
      return displayError(prevState, action.payload.error, action.payload.errorId)
    case 'displayLoader':
      return displayLoader(prevState, action.payload.value)
    default:
      return prevState
  }
}
