import React, { createContext, useReducer } from 'react'
import appStateReducer, { AppStateReducerAction } from './reducer'
import AppState, { initialAppState } from './state'

export type AppStateContextType = [AppState, React.Dispatch<AppStateReducerAction>]

export const AppStateContext = createContext<AppStateContextType>([initialAppState, () => undefined])

const AppStateProvider: React.FC = ({ children }) => {
  const stateAndDispatch = useReducer(appStateReducer, initialAppState)

  return <AppStateContext.Provider value={stateAndDispatch}>{children}</AppStateContext.Provider>
}

export default AppStateProvider
