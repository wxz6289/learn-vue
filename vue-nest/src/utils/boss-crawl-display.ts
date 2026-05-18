import type { BossCrawlTask, BossCrawlTaskStatus } from '@/types/boss-crawl'

export function formatBossTime(value: string | null): string {
  if (!value) return '-'
  return new Date(value).toLocaleString('zh-CN')
}

export function bossTaskStatusLabel(status: BossCrawlTaskStatus): string {
  const map: Record<BossCrawlTaskStatus, string> = {
    PENDING: '等待中',
    RUNNING: '抓取中',
    SUCCESS: '成功',
    FAILED: '失败',
    CANCELLED: '已取消',
  }
  return map[status]
}

export function bossTaskStatusSeverity(
  status: BossCrawlTaskStatus,
): 'secondary' | 'info' | 'success' | 'danger' | 'warn' {
  const map = {
    PENDING: 'secondary',
    RUNNING: 'info',
    SUCCESS: 'success',
    FAILED: 'danger',
    CANCELLED: 'warn',
  } as const
  return map[status]
}

export function isBossTaskActive(status: BossCrawlTaskStatus): boolean {
  return status === 'PENDING' || status === 'RUNNING'
}

export function canViewBossTaskJobs(task: BossCrawlTask): boolean {
  return task.status !== 'FAILED' && task.totalJobs > 0
}
