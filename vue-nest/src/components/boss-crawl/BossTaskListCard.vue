<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Divider from 'primevue/divider'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import { useBossCrawl } from '@/composables/useBossCrawl'
import {
  bossTaskStatusLabel,
  bossTaskStatusSeverity,
  formatBossTime,
} from '@/utils/boss-crawl-display'

const {
  tasks,
  loading,
  canViewTaskJobs,
  isTaskActive,
  viewJobsByTask,
  onStopTask,
  startPolling,
  onDeleteTask,
} = useBossCrawl()
</script>

<template>
  <Card>
    <template #title>
      <span class="flex items-center gap-2 font-semibold text-slate-900">
        <i class="pi pi-spinner-dotted text-primary" aria-hidden="true" />
        抓取任务追踪
      </span>
    </template>
    <template #content>
      <Divider class="-mt-4 mb-4" />
      <DataTable
        :value="tasks"
        data-key="id"
        class="rounded-lg ring-1 ring-inset ring-slate-900/10"
        responsive-layout="scroll"
      >
        <template #empty>
          <span class="text-sm text-slate-500">暂无抓取任务。</span>
        </template>
        <Column field="id" header="编号" sortable style="width: 90px" />
        <Column field="configId" header="配置 ID" style="width: 110px" />
        <Column header="运行状态">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Tag
                :severity="bossTaskStatusSeverity(data.status)"
                :value="bossTaskStatusLabel(data.status)"
                rounded
              />
              <button
                v-if="data.errorMessage && data.status !== 'SUCCESS'"
                type="button"
                class="inline-flex items-center rounded-full bg-slate-100 px-2 py-px text-[11px] font-semibold text-slate-600"
                :title="data.errorMessage ?? ''"
              >
                详情 ℹ️
              </button>
            </div>
          </template>
        </Column>
        <Column field="totalJobs" header="职位数" style="width: 100px" />
        <Column field="pagesCrawled" header="已抓页数" style="width: 110px" />
        <Column header="开始时间" style="min-width: 180px">
          <template #body="{ data }">{{ formatBossTime(data.startedAt) }}</template>
        </Column>
        <Column header="结束时间" style="min-width: 180px">
          <template #body="{ data }">{{ formatBossTime(data.finishedAt) }}</template>
        </Column>
        <Column header="操作" style="min-width: 280px" align="right">
          <template #body="{ data }">
            <div class="flex flex-wrap justify-end gap-2" @click.stop>
              <Button
                v-if="canViewTaskJobs(data)"
                type="button"
                size="small"
                outlined
                label="查看职位"
                icon="pi pi-chart-line"
                @click="viewJobsByTask(data)"
              />
              <Button
                v-if="isTaskActive(data.status)"
                type="button"
                size="small"
                severity="danger"
                outlined
                label="停止"
                icon="pi pi-stop"
                :loading="loading"
                @click="onStopTask(data)"
              />
              <Button
                v-if="isTaskActive(data.status)"
                type="button"
                size="small"
                outlined
                label="实时监控"
                icon="pi pi-bolt"
                @click="startPolling(data.id)"
              />
              <Button
                v-if="!isTaskActive(data.status)"
                type="button"
                size="small"
                severity="danger"
                label="删除"
                icon="pi pi-trash"
                :loading="loading"
                @click="onDeleteTask(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
      <Message
        v-if="tasks.some((t) => !!t.errorMessage)"
        severity="error"
        icon="pi pi-info-circle"
        class="mt-4 text-sm leading-relaxed"
      >
        如需排查失败作业，请先查看服务端日志：常见触发原因包含未登录、验证码失败或页面改版。
      </Message>
    </template>
  </Card>
</template>
