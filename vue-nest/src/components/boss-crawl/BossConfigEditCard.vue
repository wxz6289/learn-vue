<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import BossConfigFormFields from './BossConfigFormFields.vue'
import BossConfigLoginPanel from './BossConfigLoginPanel.vue'
import { useBossCrawl } from '@/composables/useBossCrawl'

const { selectedConfig, editForm, loading, onSaveConfig, cancelEdit } = useBossCrawl()
</script>

<template>
  <Card
    v-if="selectedConfig"
    id="boss-config-edit"
    class="border border-primary-200 bg-white/80 shadow-md"
  >
    <template #title>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-col gap-1">
          <span class="text-lg font-semibold text-slate-900">
            编辑配置 #{{ selectedConfig.id }} · {{ selectedConfig.name }}
          </span>
          <span class="text-xs text-slate-500">更新查询条件、延迟以及登录方式</span>
        </div>
        <Button type="button" text severity="secondary" icon="pi pi-times" label="关闭" @click="cancelEdit()" />
      </div>
    </template>
    <template #content>
      <div class="grid gap-6">
        <BossConfigFormFields id-prefix="edit" v-model="editForm" show-enabled />
        <div class="flex flex-wrap gap-2">
          <Button type="button" icon="pi pi-save" label="保存修改" :loading="loading" @click="onSaveConfig()" />
          <Button type="button" severity="secondary" outlined label="取消" @click="cancelEdit()" />
        </div>
        <BossConfigLoginPanel :config="selectedConfig" />
      </div>
    </template>
  </Card>
</template>
