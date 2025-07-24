<template>
  <div @click="increase" class="home-btn">
    home {{ counter }} {{ secret  }}
  </div>
  <button type="reset" @click="counterStore.$reset">重置</button>
</template>

<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import { useCounter } from '@/store/counter';
import { storeToRefs } from 'pinia';
import { inject, onMounted } from 'vue';

const  id  = inject('id');
console.log('id:', id);
const counterStore = useCounter();
const { counter } = storeToRefs(counterStore)
const { increase, secret } = counterStore

console.log(counterStore, 'counterStore')
onBeforeRouteLeave((to, from) => {
  console.log("beforeRouteLeave:", to, from);
})

onBeforeRouteUpdate((to, from) => {
  console.log("beforUpdate:", to, from);
})

</script>

<style lang="css" scoped>
.home-btn {
  cursor: pointer;
}
</style>