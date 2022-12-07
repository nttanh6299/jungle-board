import { PropsWithChildren } from 'react'

type ShowProps = PropsWithChildren<{
  when: boolean
}>

const Show = ({ when, children }: ShowProps) => {
  return when ? <>{children}</> : <>{false}</>
}

export default Show
