import { ChangeEvent, KeyboardEvent, useState, useEffect, useRef } from 'react'
import Input from 'components/Input'
import useSocket from 'hooks/useSocket'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

interface Message {
  isOpponentMessage: boolean
  message: string
}

const threshold = 50
let lastTimeSend = Date.now()

const Chat = () => {
  const { t } = useTranslation('common')
  const { socket } = useSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !!text.trim()) {
      const timeSend = Date.now()
      if (timeSend - lastTimeSend > threshold) {
        lastTimeSend = timeSend
        setMessages((prev) => [...prev, { message: text, isOpponentMessage: false }])
        setText('')
        socket.emit('message', text)
      } else {
        setText('')
      }
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [messages])

  useEffect(() => {
    socket.on('message', (message) => {
      const newOpponentMessage: Message = {
        message,
        isOpponentMessage: true,
      }
      setMessages((prev) => [...prev, newOpponentMessage])
    })

    return () => {
      socket.off('message')
    }
  }, [socket])

  return (
    <div className="relative h-full">
      <div className="w-full h-full shadow-[0_0_4px] shadow-cardShadow/25 rounded-lg pt-4 pb-8">
        <div className="max-h-[161px] overflow-y-auto px-2">
          {messages?.map(({ message, isOpponentMessage }, index) => (
            <div key={index} className="flex text-xs">
              <span
                className={clsx({
                  'text-opponent': isOpponentMessage,
                  'text-player': !isOpponentMessage,
                })}
              >
                {isOpponentMessage ? t('opponent') : t('you')}:&nbsp;
              </span>
              <span className="font-light inline-block break-all">{message}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="flex absolute bottom-0 w-full shadow-[inner_0_0_2px] shadow-cardShadow/25 rounded-b-lg overflow-hidden">
        <Input
          className="py-1.5 !px-2 !text-xs font-light border-0"
          placeholder={t('saySomethingToOpponent')}
          value={text}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
        />
      </div>
      <div className="absolute -top-[15px] right-[10px] w-[80px] font-medium text-sm bg-primary text-white text-center py-1 rounded">
        {t('chat')}
      </div>
    </div>
  )
}

export default Chat
