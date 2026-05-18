<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import InputNumber from 'primevue/inputnumber'
import Paginator from 'primevue/paginator'
import Tag from 'primevue/tag'
import { useBossCrawl } from '@/composables/useBossCrawl'
import { formatBossTime } from '@/utils/boss-crawl-display'

const {
  jobs,
  jobsTotal,
  jobsPage,
  jobsPageSize,
  jobsConfigId,
  jobsTaskId,
  loadJobs,
  onJobsPageChange,
} = useBossCrawl()
</script>

<template>
  <Card>
    <template #title>
      <span class="flex flex-col gap-1 font-semibold text-slate-900">
        <span class="flex items-center gap-2">
          <i class="pi pi-database text-primary" aria-hidden="true" />
          抓取职位归档
        </span>
      </span>
    </template>
    <template #content>
      <div class="mb-4 grid gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 sm:grid-cols-2 xl:grid-cols-5">
        <div class="flex flex-col gap-2 sm:col-span-1 xl:col-span-1">
          <label for="jobs-config-id" class="text-xs font-semibold uppercase tracking-wide text-slate-500">配置编号</label>
          <InputNumber
            input-id="jobs-config-id"
            class="w-full"
            input-class="w-full"
            placeholder="可选"
            :use-grouping="false"
            :model-value="jobsConfigId === '' ? null : jobsConfigId"
            @update:model-value="(v: number | null) => { jobsConfigId = v == null ? '' : Number(v) }"
          />
        </div>
        <div class="flex flex-col gap-2 sm:col-span-1 xl:col-span-1">
          <label for="jobs-task-id" class="text-xs font-semibold uppercase tracking-wide text-slate-500">任务编号</label>
          <InputNumber
            input-id="jobs-task-id"
            class="w-full"
            input-class="w-full"
            placeholder="可选"
            :use-grouping="false"
            :model-value="jobsTaskId === '' ? null : jobsTaskId"
            @update:model-value="(v: number | null) => { jobsTaskId = v == null ? '' : Number(v) }"
          />
        </div>
        <div class="flex items-end xl:col-span-1">
          <Button
            type="button"
            icon="pi pi-filter"
            outlined
            label="应用筛选并重载"
            class="w-full xl:w-auto"
            @click="jobsPage = 1; loadJobs()"
          />
        </div>
        <div class="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 sm:col-span-2 xl:col-span-2">
          <p class="font-semibold uppercase tracking-wide text-emerald-900">分页提示</p>
          <p class="mt-1 leading-relaxed">
            当前在第 <span class="font-semibold">{{ jobsPage }}</span> 页，共
            <span class="font-semibold">{{ jobsTotal }}</span> 条记录，单次返回 {{ jobsPageSize }} 条。
          </p>
        </div>
      </div>

      <DataTable
        :value="jobs"
        data-key="id"
        striped-rows
        class="rounded-lg ring-1 ring-inset ring-slate-900/10"
        responsive-layout="scroll"
      >
        <template #empty>
          <span class="text-sm text-slate-500">暂时没有职位数据。</span>
        </template>
        <Column header="职位" style="min-width: 200px">
          <template #body="{ data }">
            <div class="flex flex-col gap-1">
              <a
                v-if="data.jobUrl"
                :href="data.jobUrl"
                class="font-semibold text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ data.jobName }}
              </a>
              <span v-else class="font-semibold">{{ data.jobName }}</span>
              <div class="text-xs text-slate-600">BID：{{ data.bossJobId || '未知' }}</div>
            </div>
          </template>
        </Column>
        <Column header="公司 · 薪资" style="min-width: 200px">
          <template #body="{ data }">
            <div class="flex flex-col gap-1">
              <span>{{ data.companyName || '未知企业' }}</span>
              <Tag v-if="data.salary" :value="data.salary" severity="warn" rounded />
            </div>
          </template>
        </Column>
        <Column header="位置/经验">
          <template #body="{ data }">
            <div class="flex flex-col gap-1 text-sm text-slate-700">
              <span>{{ [data.city, data.district].filter(Boolean).join(' · ') || '—' }}</span>
              <span>{{ data.experience || '经验不限' }} · {{ data.education || '学历不限' }}</span>
              <small v-if="data.tags">标签 · {{ data.tags }}</small>
            </div>
          </template>
        </Column>
        <Column header="联系人" style="min-width: 160px">
          <template #body="{ data }">
            <span class="block text-sm text-slate-800">{{ data.bossName || '匿名' }}</span>
            <span class="block text-xs text-slate-500">{{ data.bossTitle || '' }}</span>
          </template>
        </Column>
        <Column header="来源" style="min-width: 150px">
          <template #body="{ data }">
            <div class="flex flex-col gap-1 text-xs">
              <span>任务：<span class="font-semibold">#{{ data.taskId }}</span></span>
              <span>配置：<span class="font-semibold">#{{ data.configId }}</span></span>
              <Tag rounded severity="info" icon="pi pi-clock" :value="formatBossTime(data.scrapedAt)" />
            </div>
          </template>
        </Column>
      </DataTable>

      <Paginator
        class="border-t border-slate-100 pt-4"
        :rows="jobsPageSize"
        :total-records="jobsTotal"
        :first="(jobsPage - 1) * jobsPageSize"
        template="PrevPageLink PageLinks NextPageLink CurrentPageReport"
        current-page-report-template="第 {currentPage}/{totalPages} 页 · 总计 {totalRecords} 条"
        @page="onJobsPageChange"
      />
    </template>
  </Card>
</template>
