const getProgressColor = (percent) => {
  if (percent >= 60 && percent <= 100) {
    return 'primary'
  }
  if (percent >= 30 && percent < 60) {
    return 'corange'
  }
  return 'cred'
}

export default getProgressColor
