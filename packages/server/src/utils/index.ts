export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

export const pick = (object: any, keys: string[]) => {
  return keys.reduce((obj: { [key: string]: unknown }, key: string) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key]
    }
    return obj
  }, {})
}

export const shuffle = <T>(array: T[]) => {
  let currentIndex: number = array.length
  let randomIndex: number

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}
