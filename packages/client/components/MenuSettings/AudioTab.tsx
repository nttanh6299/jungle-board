import React from 'react'
import { useSettingsStore } from 'store/settings'
import SoundSlider from './components/SoundSlider'
import styles from './menuSettings.module.scss'

const AudioTab: React.FC = () => {
  const { audio, onToggleMute, onSetVolume } = useSettingsStore((state) => ({
    audio: state.audio,
    onToggleMute: state.actions.onToggleMute,
    onSetVolume: state.actions.onSetVolume,
  }))

  return (
    <div>
      <div className={styles.item_row}>
        <div className={styles.left}>Music</div>
        <div className={styles.right}>
          <SoundSlider
            muted={audio.musicMuted}
            volume={audio.musicVolume}
            toggleMute={() => onToggleMute('music')}
            changeVolume={(value) => onSetVolume('music', value)}
          />
        </div>
      </div>
      <div className={styles.item_row}>
        <div className={styles.left}>SFX</div>
        <div className={styles.right}>
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
