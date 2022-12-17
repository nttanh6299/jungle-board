export type SubCallback = <T>(obj: T) => void

type MapType = {
  [id: string]: SubCallback[]
}

const map: MapType = {}

export const subscribe = (name: string, listener: SubCallback): void => {
  const list: SubCallback[] = map[name]
  if (list != null) {
    list.push(listener)
  } else {
    map[name] = [listener]
  }
}

export const unsubscribe = (name: string, listener: SubCallback): void => {
  const list: SubCallback[] = map[name]
  if (list != null) {
    const index = list.indexOf(listener)
    list.splice(index, 1)
  }
}

export const notify = <T>(name: string, obj: T): void => {
  const list: SubCallback[] = map[name]
  if (list != null) {
    list.forEach((listener) => {
      listener.call(null, obj)
    })
  }
}
