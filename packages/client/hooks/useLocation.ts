type QueryType = string | string[]

type IHookReturn = {
  pathname: string
  query: Record<string, QueryType>
}

type IHook = () => IHookReturn

const useLocation: IHook = () => {
  if (typeof window === 'undefined') {
    return { pathname: '', query: {} }
  }

  const { pathname, search } = window.location
  const query = search?.[0] === '?' ? getQuery(search.replace('?', '')) : getQuery(search)

  return {
    pathname,
    query,
  }
}

export default useLocation

function getQuery(search: string): Record<string, QueryType> {
  const params = search?.split('&')
  const query: Record<string, QueryType> = {}
  for (const param of params) {
    const pair = param?.split('=')
    const value = pair[1]?.includes(',') ? pair[1]?.split(',') : pair[1]
    query[pair[0]] = value
  }
  return query
}
