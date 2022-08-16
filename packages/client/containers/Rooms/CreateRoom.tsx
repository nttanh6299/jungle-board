import React, { useState, useRef } from 'react'
import clsx from 'clsx'
import Show from 'components/Show'

interface CreateRoomProps {
  className?: string
  onCreateRoom: (roomName: string) => Promise<void>
}

const CreateRoom: React.FC<CreateRoomProps> = ({ onCreateRoom, className }) => {
  const inputRef = useRef(null)
  const [showInput, setShowInput] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleChangeName = (value: string) => {
    if (hasError && value.trim()) {
      setHasError(false)
    }
  }

  const onClickSubmit = () => {
    if (!showInput) {
      setShowInput(true)
      return
    }

    const value = inputRef?.current?.value?.trim() || ''
    if (!value) {
      setHasError(true)
      inputRef?.current?.focus()
      return
    }

    onCreateRoom(value)
  }

  return (
    <div className={className}>
      <div className="flex">
        <Show when={showInput}>
          <input
            type="text"
            ref={inputRef}
            onChange={(e) => handleChangeName(e.target.value)}
            className={clsx(
              'bg-gray-100 border-2 border-gray-100 rounded w-full py-2 px-4 hover:border-slate-900 hover:bg-white focus:outline-none focus:bg-white focus:border-slate-900',
              { '!border-red-500': hasError },
            )}
            required
          />
        </Show>
        <button
          onClick={onClickSubmit}
          className="ml-4 px-6 py-3 text-2xl border rounded-lg bg-slate-900 hover:bg-slate-800 text-white"
        >
          {showInput ? 'Submit' : 'Create'}
        </button>
      </div>
    </div>
  )
}

export default CreateRoom
