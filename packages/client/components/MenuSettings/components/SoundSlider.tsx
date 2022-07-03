import React from 'react'
import clsx from 'clsx'

interface ISoundSliderProps {
  muted: boolean
  volume: number
  toggleMute: () => void
  changeVolume: (value: number) => void
}

const SoundSlider: React.FC<ISoundSliderProps> = ({ muted, volume, toggleMute, changeVolume }) => {
  return (
    <div className="flex">
      <button onClick={toggleMute} className={clsx('mr-4', { 'bg-yellow-400': muted })}>
        {muted ? 'Unmute' : 'Mute'}
      </button>
      <input
        type="range"
        name="volume"
        min={0}
        max={100}
        step={1}
        value={muted ? 0 : volume}
        onChange={(e) => changeVolume(+e.target.value)}
      ></input>
    </div>
  )
}

export default SoundSlider
