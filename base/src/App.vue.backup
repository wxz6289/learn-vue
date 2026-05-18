<script setup>
import { ref, provide, readonly } from 'vue';
import { RouterView } from 'vue-router'

const test = ref('hello world');

// 若子组件定义了,父组件的事件失效
const fatherClick = () => {
  test.value = 'Prime';
  console.log('father Component clicked')
}

const updateTest = () => {
  test.value = 'update Test'
}

provide('test', { test: readonly(test), updateTest });
</script>

<template>
  <router-view></router-view>
</template>
