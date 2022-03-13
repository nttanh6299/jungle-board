import axios, { AxiosPromise, CancelToken, Method } from 'axios'
import { API_ENDPOINT } from 'constants/common'

const instanceNext = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 10000,
})

instanceNext.interceptors.request.use(
  (config) => Promise.resolve(config),
  (error) => Promise.reject(error),
)

instanceNext.interceptors.response.use(
  (response) => response,
  (error) => {
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
