import { fetchApi } from 'apis/apiCaller'

export interface ResUploadImage {
  publicId: string
  preview: string
}

export const uploadImages = async (params: string[]) => {
  return fetchApi<ResUploadImage[]>('/upload', 'POST', params)
}
