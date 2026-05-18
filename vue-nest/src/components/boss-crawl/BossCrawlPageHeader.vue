<script setup lang="ts">
import Button from 'primevue/button'
import { useBossCrawl } from '@/composables/useBossCrawl'

const { loading, refreshAll } = useBossCrawl()
</script>

<template>
  <header class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight text-slate-900">BOSS 直聘抓取</h1>
      <p class="mt-1 text-sm text-slate-600">管理抓取配置、执行任务并查看抓取到的职位数据</p>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <Button type="button" icon="pi pi-refresh" label="刷新" :loading="loading" @click="refreshAll()" />
      <RouterLink v-slot="{ navigate }" to="/home" custom>
        <Button
          type="button"
          outlined
          severity="secondary"
          icon="pi pi-home"
          label="返回首页"
          @click="navigate"
        />
      </RouterLink>
    </div>
  </header>
</template>
