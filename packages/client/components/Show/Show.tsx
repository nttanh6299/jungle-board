import React from 'react'

interface ShowProps {
  when: boolean
}

const Show: React.FC<ShowProps> = ({ when, children }) => {
  return when ? <>{children}</> : <></>
}

export default Show
