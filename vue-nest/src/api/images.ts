import { request, requestForm } from '@/api/http'
import type {
  CreateExternalImagePayload,
  ImageItem,
  ImageListResponse,
  ImageStorageType,
  UpdateImagePayload,
} from '@/types/image'

function authHeaders(token: string) {
  return { token }
}

export function fetchImages(
  token: string,
  params: { page?: number; pageSize?: number; storageType?: ImageStorageType } = {},
) {
  const search = new URLSearchParams()
  if (params.page) search.set('page', String(params.page))
  if (params.pageSize) search.set('pageSize', String(params.pageSize))
  if (params.storageType) search.set('storageType', params.storageType)
  const qs = search.toString()
  return request<ImageListResponse>(`/images${qs ? `?${qs}` : ''}`, authHeaders(token))
}

export function uploadImage(token: string, file: File, title?: string) {
  const form = new FormData()
  form.append('file', file)
  if (title?.trim()) {
    form.append('title', title.trim())
  }
  return requestForm<ImageItem>('/images/upload', form, token)
}

export function createExternalImage(token: string, payload: CreateExternalImagePayload) {
  return request<ImageItem>('/images/external', {
    method: 'POST',
    body: JSON.stringify(payload),
    ...authHeaders(token),
  })
}

export function updateImage(token: string, id: number, payload: UpdateImagePayload) {
  return request<ImageItem>(`/images/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    ...authHeaders(token),
  })
}

export function deleteImage(token: string, id: number) {
  return request<{ message: string }>(`/images/${id}`, {
    method: 'DELETE',
    ...authHeaders(token),
  })
}
