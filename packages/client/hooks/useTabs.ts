import { useState } from 'react'

type IHookReturn<T> = {
  selected: T
  onChange: (newSelectedTab: T) => void
}

function useTabs<T>(defaultTab: T): IHookReturn<T> {
  const [selected, setSelected] = useState(defaultTab)

  const onChange = (newSelectedTab: T) => {
    setSelected(newSelectedTab)
  }

  return { selected, onChange }
}

export default useTabs
