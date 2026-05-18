<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import BossConfigFormFields from './BossConfigFormFields.vue'
import { useBossCrawl } from '@/composables/useBossCrawl'

const { createForm, loading, onCreateConfig } = useBossCrawl()
</script>

<template>
  <Card>
    <template #title>
      <span class="flex items-center gap-2 font-semibold text-slate-900">
        <i class="pi pi-plus-circle text-primary" aria-hidden="true" />
        新建配置
      </span>
    </template>
    <template #content>
      <div class="grid gap-6">
        <BossConfigFormFields id-prefix="create" v-model="createForm" />
        <div class="flex flex-wrap gap-2">
          <Button type="button" icon="pi pi-check" label="创建配置" :loading="loading" @click="onCreateConfig()" />
        </div>
      </div>
    </template>
  </Card>
</template>
