import axios, { AxiosPromise, CancelToken, Method } from 'axios'
import { API_ENDPOINT } from 'constants/common'
import { clearAccessToken, getAccessToken } from 'utils'

const instanceNext = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 30000,
})

instanceNext.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      try {
        const token = getAccessToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        console.log('Axios error:', error)
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

instanceNext.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if ((error.response && error.response.status === 401) || (error.response && error.response.status === 403)) {
      clearAccessToken()
    }

    if (error.response) {
      return Promise.reject(error.response)
    }
    if (error.request) {
      return Promise.reject(error.request)
    }
    return Promise.reject(error.message)
  },
)

export async function fetchApi<Res, Req = any>(
  endpoint: string,
  method: Method = 'GET',
  body?: any,
  params?: Req,
  sourceToken?: CancelToken,
): Promise<AxiosPromise<Res>> {
  return instanceNext({
    method: method,
    url: endpoint,
    data: body,
    params: params,
    cancelToken: sourceToken,
  })
}

export async function fetchAllApi(requests = []) {
  return axios.all(requests)
}
