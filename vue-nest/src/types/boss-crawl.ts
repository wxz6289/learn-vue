export type BossCrawlTaskStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'

export interface BossCrawlConfig {
  id: number
  name: string
  keyword: string
  cityCode: string
  cityName: string | null
  salaryMin: number | null
  salaryMax: number | null
  maxPages: number
  delayMinMs: number
  delayMaxMs: number
  headless: boolean
  enabled: boolean
  autoLogin: boolean
  bossPhone: string | null
  hasBossAccount: boolean
  hasSession: boolean
  sessionLoggedAt: string | null
  lastRunAt: string | null
  createdAt: string
  updatedAt: string
}

export interface BossCrawlTask {
  id: number
  configId: number
  status: BossCrawlTaskStatus
  totalJobs: number
  pagesCrawled: number
  errorMessage: string | null
  startedAt: string | null
  finishedAt: string | null
  createdAt: string
}

export interface BossJob {
  id: number
  configId: number
  taskId: number
  bossJobId: string | null
  jobName: string
  companyName: string | null
  salary: string | null
  city: string | null
  district: string | null
  experience: string | null
  education: string | null
  tags: string | null
  jobUrl: string | null
  bossName: string | null
  bossTitle: string | null
  scrapedAt: string
}

export interface BossJobListResponse {
  items: BossJob[]
  total: number
  page: number
  pageSize: number
}

export interface CreateBossCrawlConfigPayload {
  name: string
  keyword: string
  cityCode?: string
  cityName?: string
  salaryMin?: number
  salaryMax?: number
  maxPages?: number
  delayMinMs?: number
  delayMaxMs?: number
  headless?: boolean
  bossPhone?: string
  bossPassword?: string
  autoLogin?: boolean
  sessionState?: string
  userAgent?: string
}

export interface UpdateBossCredentialsPayload {
  bossPhone?: string
  bossPassword?: string
  autoLogin?: boolean
}

export interface BossLoginPayload {
  smsCode?: string
  bossPassword?: string
}

export interface BossLoginResponse {
  success: boolean
  needSmsCode?: boolean
  message: string
  config?: BossCrawlConfig
}

export interface UpdateBossCrawlConfigPayload {
  name?: string
  keyword?: string
  cityCode?: string
  cityName?: string
  salaryMin?: number
  salaryMax?: number
  maxPages?: number
  delayMinMs?: number
  delayMaxMs?: number
  headless?: boolean
  enabled?: boolean
  autoLogin?: boolean
  sessionState?: string
  userAgent?: string
}

export interface RunCrawlResponse {
  taskId: number
  message: string
}

export interface StartManualLoginResponse {
  loginSessionId: string
  message: string
  expiresAt: string
}

export interface ConfirmManualLoginPayload {
  loginSessionId: string
}

export interface ManualLoginStatusResponse {
  loginSessionId: string
  configId: number
  loggedIn: boolean
  expiresAt: string
}
