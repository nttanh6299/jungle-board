import React from 'react'
import useAppState from 'hooks/useAppState'
import Show from 'components/Show'

const AppLoading = () => {
  const [{ loading: appLoading }] = useAppState()

  return (
    <Show when={appLoading}>
      <div className="fixed z-10 top-0 left-0 right-0 bottom-0 bg-black/75">
        <span className="flex h-8 w-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-8 w-8 bg-gray-500"></span>
        </span>
      </div>
    </Show>
  )
}

export default AppLoading
