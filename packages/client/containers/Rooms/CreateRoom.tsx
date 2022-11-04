import React, { useState, useRef } from 'react'
import clsx from 'clsx'
import Show from 'components/Show'
import { ReqCreateRoom } from 'apis/room'

interface CreateRoomProps {
  className?: string
  onCreateRoom: (params: ReqCreateRoom) => Promise<void>
}

const CreateRoom: React.FC<CreateRoomProps> = ({ onCreateRoom, className }) => {
  const nameRef = useRef(null)
  const maxMoveRef = useRef(null)
  const cooldownRef = useRef(null)

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

    const name = nameRef?.current?.value?.trim() || ''
    const maxMove = +maxMoveRef?.current?.value || 50
    const cooldown = +cooldownRef?.current?.value || 20

    if (!name) {
      setHasError(true)
      nameRef?.current?.focus()
      return
    }

    const payload: ReqCreateRoom = {
      name,
      maxMove,
      cooldown,
    }
    onCreateRoom(payload)
  }

  return (
    <div className={className}>
      <div className="flex">
        <Show when={showInput}>
          <div className="flex flex-col">
            <label className="block mb-1 text-md font-medium text-gray-900" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              ref={nameRef}
              onChange={(e) => handleChangeName(e.target.value)}
              className={clsx(
                'bg-gray-100 border-2 border-gray-100 rounded w-full py-2 px-4 hover:border-slate-900 hover:bg-white focus:outline-none focus:bg-white focus:border-slate-900',
                { '!border-red-500': hasError },
              )}
              autoFocus
              required
            />
          </div>
          <div className="flex flex-col ml-4">
            <label className="block mb-1 text-md font-medium text-gray-900 flex items-center" htmlFor="maxMove">
              <div className="mr-1.5">Max move</div>
            </label>
            <select
              ref={maxMoveRef}
              id="maxMove"
              defaultValue="50"
              className="border border-gray-100 text-gray-900 text-md rounded-lg focus:border-slate-900 block w-full py-2.5 px-2"
            >
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="60">60</option>
            </select>
          </div>
          <div className="flex flex-col ml-4">
            <label className="block mb-1 text-md font-medium text-gray-900 flex items-center" htmlFor="cooldown">
              <div className="mr-1.5">Cooldown</div>
            </label>
            <select
              ref={cooldownRef}
              id="cooldown"
              defaultValue="20"
              className="border border-gray-100 text-gray-900 text-md rounded-lg focus:border-slate-900 block w-full p-2.5 px-2"
            >
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
            </select>
          </div>
        </Show>
        <button
          onClick={onClickSubmit}
          className={clsx('px-6 py-3 text-2xl rounded-lg bg-slate-900 hover:bg-slate-800 text-white self-end', {
            'ml-4': showInput,
          })}
        >
          {showInput ? 'Submit' : 'Create'}
        </button>
      </div>
    </div>
  )
}

export default CreateRoom
