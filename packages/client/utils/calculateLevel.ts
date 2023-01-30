const levelExpList = [0, 11, 44, 100, 177, 277, 400, 544, 711, 900, 1111, 999999]

const calculateLevel = (playerExp: number) => {
  let gainedLevelIndex = 0
  let totalExp = 0

  for (const exp in levelExpList) {
    if (playerExp < totalExp + levelExpList[exp]) {
      gainedLevelIndex = Number(exp)
      break
    } else {
      totalExp += levelExpList[exp]
    }
  }

  return {
    level: gainedLevelIndex,
    expNext: levelExpList[gainedLevelIndex],
    expAfterCalculated: gainedLevelIndex > 1 ? playerExp - totalExp : playerExp,
  }
}

export default calculateLevel
