<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import { useBossCrawl } from '@/composables/useBossCrawl'
import {
  bossTaskStatusLabel,
  bossTaskStatusSeverity,
} from '@/utils/boss-crawl-display'

const { error, activeTask, loading, isTaskActive, onStopTask } = useBossCrawl()
</script>

<template>
  <Message v-if="error" severity="error" class="mb-4" closable @close="error = ''">
    {{ error }}
  </Message>

  <Message severity="info" class="mb-4">
    <div class="flex flex-col gap-2 text-sm leading-relaxed text-slate-800">
      <span class="font-semibold text-slate-900">使用小贴士</span>
      <ul class="list-inside list-disc space-y-1 text-slate-700">
        <li>
          请先通过「手动登录浏览器」或在高级选项中粘贴
          <code class="rounded bg-white/70 px-1 py-px">storageState</code>
          JSON，确认「已登录」后再启动抓取。
        </li>
        <li>抓取任务进行时可在「任务记录」中观测状态；完成后切换到「职位数据」查看结果。</li>
        <li>建议在非高峰时段调高随机延迟以降低风控风险。</li>
      </ul>
    </div>
  </Message>

  <Message v-if="activeTask" severity="warn" icon="pi pi-eye" class="mb-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <span class="text-sm leading-relaxed">
        正在监控任务
        <span class="font-semibold text-slate-900">#{{ activeTask.id }}</span>
        ，当前状态：
        <Tag
          :value="bossTaskStatusLabel(activeTask.status)"
          :severity="bossTaskStatusSeverity(activeTask.status)"
          rounded
        />
      </span>
      <Button
        v-if="isTaskActive(activeTask.status)"
        type="button"
        size="small"
        severity="danger"
        outlined
        icon="pi pi-stop-circle"
        label="停止任务"
        :loading="loading"
        @click="onStopTask(activeTask)"
      />
    </div>
  </Message>
</template>
