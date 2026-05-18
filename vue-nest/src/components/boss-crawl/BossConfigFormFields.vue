<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import type { BossConfigFormState } from './boss-crawl.types'

const model = defineModel<BossConfigFormState>({ required: true })

const { idPrefix, showEnabled } = defineProps<{
  idPrefix: string
  showEnabled?: boolean
}>()
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div class="flex flex-col gap-2">
      <label :for="`${idPrefix}-name`" class="text-xs font-semibold uppercase tracking-wide text-slate-500">配置名称</label>
      <InputText :id="`${idPrefix}-name`" v-model="model.name" class="w-full" :placeholder="idPrefix === 'create' ? '北京-Java' : undefined" />
    </div>
    <div class="flex flex-col gap-2">
      <label :for="`${idPrefix}-keyword`" class="text-xs font-semibold uppercase tracking-wide text-slate-500">搜索关键词</label>
      <InputText :id="`${idPrefix}-keyword`" v-model="model.keyword" class="w-full" :placeholder="idPrefix === 'create' ? 'Java' : undefined" />
    </div>
    <div class="flex flex-col gap-2">
      <label :for="`${idPrefix}-city-code`" class="text-xs font-semibold uppercase tracking-wide text-slate-500">城市编码</label>
      <InputText :id="`${idPrefix}-city-code`" v-model="model.cityCode" class="w-full" placeholder="101010100" />
    </div>
    <div class="flex flex-col gap-2">
      <label :for="`${idPrefix}-city-name`" class="text-xs font-semibold uppercase tracking-wide text-slate-500">城市名称</label>
      <InputText :id="`${idPrefix}-city-name`" v-model="model.cityName" class="w-full" placeholder="北京" />
    </div>
    <div class="flex flex-col gap-2 sm:col-span-2">
      <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">薪资（K）区间</span>
      <div class="grid gap-3 sm:grid-cols-2">
        <InputNumber v-model="model.salaryMin" class="w-full" input-class="w-full" placeholder="下限（可选）" :min-fraction-digits="0" :max-fraction-digits="1" :use-grouping="false" />
        <InputNumber v-model="model.salaryMax" class="w-full" input-class="w-full" placeholder="上限（可选）" :min-fraction-digits="0" :max-fraction-digits="1" :use-grouping="false" />
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <label :for="`${idPrefix}-max-pages`" class="text-xs font-semibold uppercase tracking-wide text-slate-500">最大页数</label>
      <InputNumber :id="`${idPrefix}-max-pages`" v-model="model.maxPages" class="w-full" input-class="w-full" :min="1" :max="20" show-buttons :use-grouping="false" />
    </div>
    <div class="flex flex-col gap-2 sm:col-span-2 lg:col-span-2">
      <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">页面切换延迟（毫秒）</span>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <InputNumber v-model="model.delayMinMs" suffix=" ms" class="w-full" input-class="w-full" :min="200" :use-grouping="false" placeholder="最短" />
        <InputNumber v-model="model.delayMaxMs" suffix=" ms" class="w-full" input-class="w-full" :min="500" :use-grouping="false" placeholder="最长" />
      </div>
    </div>
    <label class="col-span-full flex items-center gap-3 text-sm text-slate-700">
      <Checkbox v-model="model.headless" binary :input-id="`${idPrefix}-headless`" />
      <span>无头模式（关闭后可见浏览器，便于登录）</span>
    </label>
    <label v-if="showEnabled" class="col-span-full flex items-center gap-3 text-sm text-slate-700">
      <Checkbox v-model="model.enabled" binary :input-id="`${idPrefix}-enabled`" />
      <span>启用该配置</span>
    </label>
  </div>
</template>
