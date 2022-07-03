import React from 'react'
import { useSettingsStore } from 'store/settings'
import SoundSlider from './components/SoundSlider'

const AudioTab: React.FC = () => {
  const { audio, onToggleMute, onSetVolume } = useSettingsStore((state) => ({
    audio: state.audio,
    onToggleMute: state.actions.onToggleMute,
    onSetVolume: state.actions.onSetVolume,
  }))

  return (
    <div>
      <div className="flex items-center">
        <div className="mr-6">Music</div>
        <div className="flex">
          <SoundSlider
            muted={audio.musicMuted}
            volume={audio.musicVolume}
            toggleMute={() => onToggleMute('music')}
            changeVolume={(value) => onSetVolume('music', value)}
          />
        </div>
      </div>
      <div className="flex items-center sibling:mt-4">
        <div className="mr-6">SFX</div>
        <div className="flex">
          <SoundSlider
            muted={audio.sfxMuted}
            volume={audio.sfxVolume}
            toggleMute={() => onToggleMute('sfx')}
            changeVolume={(value) => onSetVolume('sfx', value)}
          />
        </div>
      </div>
    </div>
  )
}

export default React.memo(AudioTab)
