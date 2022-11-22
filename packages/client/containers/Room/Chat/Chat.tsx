import { ChangeEvent, KeyboardEvent, useState, useEffect, useRef } from 'react'
import Input from 'components/Input'
import useSocket from 'hooks/useSocket'
import clsx from 'clsx'

interface Message {
  isOpponentMessage: boolean
  message: string
}

const Chat = () => {
  const { socket } = useSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !!text.trim()) {
      setMessages((prev) => [...prev, { message: text, isOpponentMessage: false }])
      setText('')
      socket.emit('message', text)
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
    <>
      <div className="w-full h-full shadow-[0_0_4px] shadow-cardShadow/25 rounded-lg pt-4 pb-8 px-2">
        <div className="h-full max-h-[161px] overflow-y-auto">
          {messages?.map(({ message, isOpponentMessage }, index) => (
            <div key={index} className="flex text-sm">
              <span
                className={clsx({
                  'text-opponent': isOpponentMessage,
                  'text-player': !isOpponentMessage,
                })}
              >
                {isOpponentMessage ? 'Opponent' : 'You'}:&nbsp;
              </span>
              <span className="font-light inline-block break-all">{message}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="flex absolute bottom-0 w-full shadow-[inner_0_0_2px] shadow-cardShadow/25 rounded-b-lg overflow-hidden">
        <Input
          className="py-1.5 px-2 !text-xs font-light border-0"
          placeholder="Say something to your opponent"
          value={text}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
        />
      </div>
      <div className="absolute -top-[15px] right-[10px] w-[80px] font-medium text-sm bg-primary text-white text-center py-1 rounded">
        Chat
      </div>
    </>
  )
}

export default Chat
