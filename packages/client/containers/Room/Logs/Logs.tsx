import clsx from 'clsx'
import { useEffect, useState, useCallback, useRef } from 'react'
import { subscribe, unsubscribe } from 'utils/subscriber'

const Logs = () => {
  const [logs, setLogs] = useState<Utils.Log[]>([])
  const bottomRef = useRef(null)

  const addLog = useCallback((logs) => {
    setLogs((prev) => [...prev, ...logs])
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [logs])

  useEffect(() => {
    subscribe('addLog', addLog)
    return () => {
      unsubscribe('addLog', addLog)
    }
  })

  return (
    <div className="relative h-full">
      <div className="w-full h-full shadow-[0_0_4px] shadow-cardShadow/25 rounded-lg pt-4">
        <div className="text-xs max-h-[186px] overflow-y-auto px-2">
          {logs.map((log, index) => (
            <div className={clsx('text-xs', { [log.className]: !!log.className })} key={index}>
              {log.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="absolute -top-[15px] right-[10px] w-[80px] font-medium text-sm bg-primary text-white text-center py-1 rounded">
        Logs
      </div>
    </div>
  )
}

export default Logs
