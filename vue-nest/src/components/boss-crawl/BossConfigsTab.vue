<script setup lang="ts">
import BossConfigCreateCard from './BossConfigCreateCard.vue'
import BossConfigEditCard from './BossConfigEditCard.vue'
import BossConfigListCard from './BossConfigListCard.vue'
</script>

<template>
  <div class="grid gap-6">
    <BossConfigCreateCard />
    <BossConfigListCard />
    <BossConfigEditCard />
  </div>
</template>
