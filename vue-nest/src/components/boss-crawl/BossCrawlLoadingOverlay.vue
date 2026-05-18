<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'

defineProps<{
  loading: boolean
}>()
</script>

<template>
  <transition name="fade">
    <div
      v-if="loading"
      class="absolute inset-0 z-[100] flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-[1px]"
      aria-busy="true"
      aria-live="polite"
    >
      <ProgressSpinner aria-label="加载中" stroke-width="4" class="size-14" />
    </div>
  </transition>
</template>
