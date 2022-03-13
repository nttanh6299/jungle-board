import React from 'react'
import { useSettingsStore } from 'store/settings'
import Toggle from './components/Toggle'
import LevelGroup from './components/LevelGroup'
import styles from './menuSettings.module.scss'

const VideoTab: React.FC = () => {
  const { video, onSetShowFps, onSetGraphicLevel } = useSettingsStore((state) => ({
    video: state.video,
    onSetShowFps: state.actions.onSetShowFps,
    onSetGraphicLevel: state.actions.onSetGraphicLevel,
  }))

  return (
    <div>
      <div className={styles.item_row}>
        <div className={styles.left}>Show FPS</div>
        <div className={styles.right}>
          <Toggle value={video.showFps} change={onSetShowFps} />
        </div>
      </div>
      <div className={styles.item_row}>
        <div className={styles.left}>Graphics</div>
        <div className={styles.right}>
          <LevelGroup value={video.graphics} change={onSetGraphicLevel} />
        </div>
      </div>
    </div>
  )
}

export default React.memo(VideoTab)
