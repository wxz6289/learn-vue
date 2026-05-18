export type ImageStorageType = 'OSS' | 'EXTERNAL'

export interface ImageItem {
  id: number
  title: string | null
  url: string
  storageType: ImageStorageType
  ossKey: string | null
  mimeType: string | null
  size: number | null
  createdAt: string
  updatedAt: string
}

export interface ImageListResponse {
  items: ImageItem[]
  total: number
  page: number
  pageSize: number
}

export interface CreateExternalImagePayload {
  url: string
  title?: string
}

export interface UpdateImagePayload {
  title?: string
  url?: string
}
