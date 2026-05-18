export interface User {
  id: number
  name: string
  email: string
}

export interface AuthTokenResponse {
  token: string
  user: User
}

export interface CaptchaResponse {
  captchaId: string
  image: string
}

export interface LoginPayload {
  name: string
  password: string
  captchaId: string
  captchaCode: string
}

export interface SignUpPayload {
  name: string
  password: string
  email: string
  captchaId: string
  captchaCode: string
}

export interface ApiErrorBody {
  statusCode?: number
  message?: string | string[]
}
