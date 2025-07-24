<template>
  <div>
    <button @click="increment">{{ state.deep.count }}</button>
  </div>
</template>

<script setup>
import { watchEffect, reactive, unref } from 'vue';
const state = reactive({
  deep: {
    count: 0,
  }
});
const increment = () => state.deep.count++;
/* watch(() => state.deep, (cur, pre) => {
  console.log('watch:', cur, pre);
  console.log(cur === pre);
}, { deep: true }); */

watchEffect(() => {
  console.log('watchEffect:', unref(state.deep.count))
})

/* setTimeout(() => {
  state.deep = { count: 100 }
}, 2000) */
</script>

<style lang="scss" scoped></style>