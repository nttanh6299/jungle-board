import { useState } from 'react'

interface UseBooleanProps {
  initialValue?: boolean
}

const useBoolean = (props?: UseBooleanProps) => {
  const [value, setValue] = useState(Boolean(props?.initialValue))

  const on = () => setValue(true)
  const off = () => setValue(false)
  const toggle = () => setValue((prev) => !prev)

  return {
    value,
    on,
    off,
    toggle,
  }
}

export default useBoolean
