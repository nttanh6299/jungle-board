import React from 'react'
import useAppState from 'hooks/useAppState'
import Show from 'components/Show'
import Heartbeat from 'components/Heartbeat'

const AppLoading = () => {
  const [{ loading: appLoading }] = useAppState()

  return (
    <Show when={appLoading}>
      <div className="fixed z-10 top-0 left-0 right-0 bottom-0 bg-black/75">
        <Heartbeat />
      </div>
    </Show>
  )
}

export default AppLoading
