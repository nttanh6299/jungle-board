export type IOption<T = string> = {
  label: string
  value: T
}

export type Log = {
  text: string
  className?: string
}

export as namespace Utils
