<template>
  <div @click="increase">
    Pinia
    {{ counter }}
  </div>
</template>

<script setup>
import { useCounter } from '@/store/counter';
import { storeToRefs } from 'pinia'
const counterStore = useCounter();
console.log(counterStore.secret, 'counter')
const { counter } = storeToRefs(counterStore);
const { increase } = counterStore;
</script>

<style lang="scss" scoped></style>