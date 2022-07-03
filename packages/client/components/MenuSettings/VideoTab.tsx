import React from 'react'
import { useSettingsStore } from 'store/settings'
import Toggle from './components/Toggle'
import LevelGroup from './components/LevelGroup'

const VideoTab: React.FC = () => {
  const { video, onSetShowFps, onSetGraphicLevel } = useSettingsStore((state) => ({
    video: state.video,
    onSetShowFps: state.actions.onSetShowFps,
    onSetGraphicLevel: state.actions.onSetGraphicLevel,
  }))

  return (
    <div>
      <div className="flex items-center">
        <div className="mr-6">Show FPS</div>
        <div className="flex">
          <Toggle value={video.showFps} change={onSetShowFps} />
        </div>
      </div>
      <div className="flex items-center sibling:mt-4">
        <div className="mr-6">Graphics</div>
        <div className="flex">
          <LevelGroup value={video.graphics} change={onSetGraphicLevel} />
        </div>
      </div>
    </div>
  )
}

export default React.memo(VideoTab)
