<template>
  <div @click="increment">
    {{ count }} - {{ double }}
  </div>
</template>

<script setup>
import { useCounterStore, useCounterStoreOrThrow } from './useCounterStore';

const { count, double, increment } = useCounterStoreOrThrow();
</script>

<style lang="scss" scoped>

</style>