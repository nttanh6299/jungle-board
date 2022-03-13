import React from 'react'
import { useSettingsStore } from 'store/settings'
import Toggle from './components/Toggle'
import styles from './menuSettings.module.scss'

const GameTab: React.FC = () => {
  const { game, onSetTutorials } = useSettingsStore((state) => ({
    game: state.game,
    onSetTutorials: state.actions.onSetTutorials,
  }))

  return (
    <div>
      <div className={styles.item_row}>
        <div className={styles.left}>Tutorials</div>
        <div className={styles.right}>
          <Toggle value={game.tutorials} change={onSetTutorials} />
        </div>
      </div>
    </div>
  )
}

export default React.memo(GameTab)
