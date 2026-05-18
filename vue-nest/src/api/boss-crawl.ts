import { request } from '@/api/http'
import type {
  BossCrawlConfig,
  BossCrawlTask,
  BossJob,
  BossJobListResponse,
  BossLoginPayload,
  BossLoginResponse,
  ConfirmManualLoginPayload,
  CreateBossCrawlConfigPayload,
  ManualLoginStatusResponse,
  StartManualLoginResponse,
  RunCrawlResponse,
  UpdateBossCredentialsPayload,
  UpdateBossCrawlConfigPayload,
} from '@/types/boss-crawl'

function auth(token: string) {
  return { token }
}

export function fetchBossConfigs(token: string) {
  return request<BossCrawlConfig[]>('/boss-crawl/configs', auth(token))
}

export function fetchBossConfig(token: string, id: number) {
  return request<BossCrawlConfig>(`/boss-crawl/configs/${id}`, auth(token))
}

export function createBossConfig(token: string, payload: CreateBossCrawlConfigPayload) {
  return request<BossCrawlConfig>('/boss-crawl/configs', {
    method: 'POST',
    body: JSON.stringify(payload),
    ...auth(token),
  })
}

export function updateBossConfig(
  token: string,
  id: number,
  payload: UpdateBossCrawlConfigPayload,
) {
  return request<BossCrawlConfig>(`/boss-crawl/configs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    ...auth(token),
  })
}

export function updateBossCredentials(
  token: string,
  id: number,
  payload: UpdateBossCredentialsPayload,
) {
  return request<BossCrawlConfig>(`/boss-crawl/configs/${id}/credentials`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    ...auth(token),
  })
}

export function startBossManualLogin(token: string, configId: number) {
  return request<StartManualLoginResponse>(
    `/boss-crawl/configs/${configId}/login/manual`,
    {
      method: 'POST',
      ...auth(token),
    },
  )
}

export function confirmBossManualLogin(
  token: string,
  configId: number,
  payload: ConfirmManualLoginPayload,
) {
  return request<BossLoginResponse>(
    `/boss-crawl/configs/${configId}/login/manual/confirm`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      ...auth(token),
    },
  )
}

export function cancelBossManualLogin(
  token: string,
  configId: number,
  payload: ConfirmManualLoginPayload,
) {
  return request<void>(`/boss-crawl/configs/${configId}/login/manual/cancel`, {
    method: 'POST',
    body: JSON.stringify(payload),
    ...auth(token),
  })
}

export function fetchBossManualLoginStatus(token: string, loginSessionId: string) {
  return request<ManualLoginStatusResponse>(
    `/boss-crawl/login/manual/status?loginSessionId=${encodeURIComponent(loginSessionId)}`,
    auth(token),
  )
}

export function loginBossAccount(token: string, id: number, payload: BossLoginPayload = {}) {
  return request<BossLoginResponse>(`/boss-crawl/configs/${id}/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
    ...auth(token),
  })
}

export function updateBossSession(token: string, id: number, sessionState: string) {
  return request<BossCrawlConfig>(`/boss-crawl/configs/${id}/session`, {
    method: 'PATCH',
    body: JSON.stringify({ sessionState }),
    ...auth(token),
  })
}

export function deleteBossConfig(token: string, id: number) {
  return request<void>(`/boss-crawl/configs/${id}`, {
    method: 'DELETE',
    ...auth(token),
  })
}

export function runBossCrawl(token: string, configId: number) {
  return request<RunCrawlResponse>(`/boss-crawl/configs/${configId}/run`, {
    method: 'POST',
    ...auth(token),
  })
}

export function fetchBossTasks(token: string, configId?: number) {
  const qs = configId ? `?configId=${configId}` : ''
  return request<BossCrawlTask[]>(`/boss-crawl/tasks${qs}`, auth(token))
}

export function fetchBossTask(token: string, id: number) {
  return request<BossCrawlTask>(`/boss-crawl/tasks/${id}`, auth(token))
}

export function stopBossCrawlTask(token: string, taskId: number) {
  return request<RunCrawlResponse>(`/boss-crawl/tasks/${taskId}/stop`, {
    method: 'POST',
    ...auth(token),
  })
}

export function deleteBossCrawlTask(token: string, taskId: number) {
  return request<RunCrawlResponse>(`/boss-crawl/tasks/${taskId}`, {
    method: 'DELETE',
    ...auth(token),
  })
}

export function fetchBossJobs(
  token: string,
  params: { configId?: number; taskId?: number; page?: number; pageSize?: number } = {},
) {
  const search = new URLSearchParams()
  if (params.configId) search.set('configId', String(params.configId))
  if (params.taskId) search.set('taskId', String(params.taskId))
  if (params.page) search.set('page', String(params.page))
  if (params.pageSize) search.set('pageSize', String(params.pageSize))
  const qs = search.toString()
  return request<BossJobListResponse>(`/boss-crawl/jobs${qs ? `?${qs}` : ''}`, auth(token))
}

export function fetchBossJob(token: string, id: number) {
  return request<BossJob>(`/boss-crawl/jobs/${id}`, auth(token))
}
