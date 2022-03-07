export const isEmpty = (obj: any): boolean => {
  return [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length
}
