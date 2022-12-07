const MAX_LEVEL = 25
const THRESHOLD = 25

/**
 * XP = ((Level^2 - Level) x threshold) / 2
 */
const levels = Array.from({ length: MAX_LEVEL }, (_, i) => i + 1).map((level) => ((level ** 2 - level) * THRESHOLD) / 2)

const calculateLevel = (playerExp: number) => {
  let expLeft = playerExp
  let level = 1
  while (level < MAX_LEVEL && expLeft >= 0) {
    expLeft = expLeft - levels[level - 1]
    level = level + 1
  }

  if (expLeft < 0) {
    level = level - 1
  }

  return {
    level,
    expNextLevelNeeded: levels[level + 1],
  }
}

export default calculateLevel
