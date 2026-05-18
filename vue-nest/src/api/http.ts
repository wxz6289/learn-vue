import type { ApiErrorBody } from '@/types/auth'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  status: number

  constructor(
    message: string,
    status: number,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function resolveUrl(path: string): string {
  if (path.startsWith('http')) {
    return path
  }
  const prefix = baseUrl.replace(/\/$/, '')
  return `${prefix}${path}`
}

export function parseApiMessage(body: ApiErrorBody): string {
  if (Array.isArray(body.message)) {
    return body.message.join('；')
  }
  return body.message ?? '请求失败'
}

export async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, ...rest } = options
  const response = await fetch(resolveUrl(path), {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  const text = await response.text()
  let data = {} as T & ApiErrorBody
  if (text) {
    try {
      data = JSON.parse(text) as T & ApiErrorBody
    } catch {
      throw new ApiError('响应格式错误', response.status)
    }
  }

  if (!response.ok) {
    throw new ApiError(parseApiMessage(data), response.status)
  }

  return data as T
}

export async function requestForm<T>(
  path: string,
  formData: FormData,
  token: string,
  method = 'POST',
): Promise<T> {
  const response = await fetch(resolveUrl(path), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const text = await response.text()
  let data = {} as T & ApiErrorBody
  if (text) {
    try {
      data = JSON.parse(text) as T & ApiErrorBody
    } catch {
      throw new ApiError('响应格式错误', response.status)
    }
  }

  if (!response.ok) {
    throw new ApiError(parseApiMessage(data), response.status)
  }

  return data as T
}
