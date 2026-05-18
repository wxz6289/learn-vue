import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCounter = defineStore('counter', () => {
  const counter = ref(0);
  const increase = () => counter.value++;
  function $reset() {
    counter.value = 0;
  }
  return { counter, increase, $reset };
});