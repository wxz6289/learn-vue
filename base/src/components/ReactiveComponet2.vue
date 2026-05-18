<template>
  <div @click="increment">
    {{ count }}
  </div>
  <div @click="mutateArray">{{ state.arr.join('|') }}</div>
</template>

<script setup>
import { reactive, ref, nextTick } from 'vue';
let count = ref(0);
const state = reactive({ arr: [1, 2, 3] })
const increment = () => {
  count.value++;
  console.log(count.value);
  nextTick(() => {
    console.log('nextTick:', count.value);
  })
}

const mutateArray = () => {
  state.arr[3] = 4;
}

</script>
