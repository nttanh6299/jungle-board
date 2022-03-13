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
