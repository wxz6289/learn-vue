import { request } from '@/api/http'
import type {
  AuthTokenResponse,
  CaptchaResponse,
  LoginPayload,
  SignUpPayload,
} from '@/types/auth'

export function fetchCaptcha() {
  return request<CaptchaResponse>('/auth/captcha')
}

export function login(payload: LoginPayload) {
  return request<AuthTokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function signUp(payload: SignUpPayload) {
  return request<AuthTokenResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function logout(token: string) {
  return request<{ message: string }>('/auth/logout', {
    method: 'POST',
    token,
  })
}

export function fetchProfile(token: string) {
  return request<import('@/types/auth').User>('/auth/profile', {
    method: 'GET',
    token,
  })
}
