<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Divider from 'primevue/divider'
import Tag from 'primevue/tag'
import type { BossCrawlConfig } from '@/types/boss-crawl'
import { useBossCrawl } from '@/composables/useBossCrawl'
import { formatBossTime } from '@/utils/boss-crawl-display'

const {
  configs,
  loading,
  selectedConfigId,
  onConfigRowClick,
  openEdit,
  onToggleEnabled,
  onRunCrawl,
  onDeleteConfig,
} = useBossCrawl()

function rowClass(data: BossCrawlConfig) {
  return selectedConfigId.value === data.id ? 'bg-emerald-50/70' : ''
}
</script>

<template>
  <Card>
    <template #title>
      <span class="flex flex-wrap items-center justify-between gap-3 font-semibold text-slate-900">
        <span class="inline-flex items-center gap-2">
          <i class="pi pi-list text-primary" aria-hidden="true" />
          抓取配置列表
        </span>
        <Tag v-if="configs.length" icon="pi pi-database" severity="secondary" :value="`共 ${configs.length} 套`" />
      </span>
    </template>
    <template #content>
      <Divider class="-mt-4 mb-4" />
      <DataTable
        :value="configs"
        data-key="id"
        paginator
        :rows="8"
        responsive-layout="scroll"
        class="rounded-lg ring-1 ring-inset ring-slate-900/10"
        :row-class="rowClass"
        @row-click="onConfigRowClick"
      >
        <template #empty>
          <span class="text-sm text-slate-500">暂无配置，可先创建抓取配置。</span>
        </template>
        <Column field="name" header="名称" style="min-width: 140px" />
        <Column field="keyword" header="关键词" style="min-width: 120px" />
        <Column header="城市" style="min-width: 140px">
          <template #body="{ data }">{{ data.cityName || data.cityCode }}</template>
        </Column>
        <Column field="maxPages" header="抓取页数" style="width: 110px" />
        <Column header="状态" style="min-width: 120px">
          <template #body="{ data }">
            <Tag rounded :severity="data.enabled ? 'success' : 'danger'" :value="data.enabled ? '启用' : '停用'" />
          </template>
        </Column>
        <Column header="登录会话" style="min-width: 120px">
          <template #body="{ data }">
            <Tag rounded :severity="data.hasSession ? 'success' : 'warn'" :value="data.hasSession ? '已登录' : '未登录'" />
          </template>
        </Column>
        <Column header="上次运行" style="min-width: 180px">
          <template #body="{ data }">{{ formatBossTime(data.lastRunAt) }}</template>
        </Column>
        <Column header="操作" style="min-width: 320px" align="right">
          <template #body="{ data }">
            <div class="flex flex-wrap justify-end gap-2" @click.stop>
              <Button type="button" size="small" outlined label="编辑" icon="pi pi-pencil" @click="openEdit(data)" />
              <Button
                type="button"
                size="small"
                outlined
                severity="secondary"
                :label="data.enabled ? '禁用' : '启用'"
                :icon="data.enabled ? 'pi pi-ban' : 'pi pi-check-circle'"
                :loading="loading"
                @click="onToggleEnabled(data)"
              />
              <Button
                type="button"
                size="small"
                label="抓取"
                icon="pi pi-play"
                :disabled="loading || !data.enabled || !data.hasSession"
                :title="data.hasSession ? '' : '请先完成手动登录'"
                @click="onRunCrawl(data)"
              />
              <Button
                type="button"
                size="small"
                severity="danger"
                outlined
                label="删除"
                icon="pi pi-trash"
                @click="onDeleteConfig(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>
