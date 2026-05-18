export interface BossConfigFormState {
  name: string
  keyword: string
  cityCode: string
  cityName: string
  salaryMin?: number
  salaryMax?: number
  maxPages: number
  delayMinMs: number
  delayMaxMs: number
  headless: boolean
  enabled?: boolean
}
