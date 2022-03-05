import React from 'react'
import appStateReducer, { AppStateReducerAction } from './reducer'
import AppState, { initialAppState } from './state'

export type AppStateContextType = [AppState, React.Dispatch<AppStateReducerAction>]

export const AppStateContext = React.createContext<AppStateContextType>([initialAppState, () => undefined])

const AppStateProvider: React.FC = ({ children }) => {
  const stateAndDispatch = React.useReducer(appStateReducer, initialAppState)

  return <AppStateContext.Provider value={stateAndDispatch}>{children}</AppStateContext.Provider>
}

export default AppStateProvider
