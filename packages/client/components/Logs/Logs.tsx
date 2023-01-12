import clsx from 'clsx'
import { NotifyEvent } from 'constants/enum'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { subscribe, unsubscribe } from 'utils/subscriber'

const Logs = () => {
  const { t } = useTranslation('common')
  const [logs, setLogs] = useState<Utils.Log[]>([])
  const bottomRef = useRef(null)

  const addLog = useCallback((logs) => {
    setLogs((prev) => [...prev, ...logs])
  }, [])

  const clearLog = useCallback(() => {
    setLogs([])
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [logs])

  useEffect(() => {
    subscribe(NotifyEvent.AddLog, addLog)

    return () => {
      unsubscribe(NotifyEvent.AddLog, addLog)
    }
  })

  useEffect(() => {
    subscribe(NotifyEvent.ClearLog, clearLog)

    return () => {
      unsubscribe(NotifyEvent.ClearLog, clearLog)
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
        {t('logs')}
      </div>
    </div>
  )
}

export default Logs
