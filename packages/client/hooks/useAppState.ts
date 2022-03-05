import { useContext } from 'react'
import { AppStateContext, AppStateContextType } from 'contexts/AppStateProvider'

const useAppState = (): AppStateContextType => {
  const stateAndDispatch = useContext(AppStateContext)
  return stateAndDispatch
}

export default useAppState
