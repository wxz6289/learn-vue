import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as authApi from '@/api/auth'
import type { LoginPayload, SignUpPayload, User } from '@/types/auth'

const TOKEN_KEY = 'access_token'
const USER_KEY = 'auth_user'

function readStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) {
    return null
  }
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<User | null>(readStoredUser())
  const loading = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value))

  function persistSession(accessToken: string, profile: User) {
    token.value = accessToken
    user.value = profile
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(USER_KEY, JSON.stringify(profile))
  }

  function clearSession() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  async function login(payload: LoginPayload) {
    loading.value = true
    try {
      const res = await authApi.login(payload)
      persistSession(res.token, res.user)
      return res
    } finally {
      loading.value = false
    }
  }

  async function register(payload: SignUpPayload) {
    loading.value = true
    try {
      const res = await authApi.signUp(payload)
      persistSession(res.token, res.user)
      return res
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    const currentToken = token.value
    clearSession()
    if (currentToken) {
      try {
        await authApi.logout(currentToken)
      } catch {
        // 本地已清除会话，忽略远端退出失败
      }
    }
  }

  async function refreshProfile() {
    if (!token.value) {
      return null
    }
    const profile = await authApi.fetchProfile(token.value)
    user.value = profile
    localStorage.setItem(USER_KEY, JSON.stringify(profile))
    return profile
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshProfile,
    clearSession,
  }
})
