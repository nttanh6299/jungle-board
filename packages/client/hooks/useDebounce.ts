import { useRef, useMemo } from 'react'
import useIsomorphicLayoutEffect from 'hooks/useIsomorphicLayoutEffect'
import debounce from 'utils/lodash/debounce'

const useDebounce = (callback: (...args) => void, delay: number) => {
  const callbackRef = useRef(callback)

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback
  })

  return useMemo(() => debounce((...args) => callbackRef.current(...args), delay), [delay])
}

export default useDebounce
