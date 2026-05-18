<script setup>
import { ref } from 'vue'
import FancyCard from './components/FancyCard.vue'

const isDark = ref(false)
const themeColor = ref('#42b983') // 亮色模式默认绿

function toggleTheme() {
  isDark.value = !isDark.value
  themeColor.value = isDark.value ? '#333' : '#42b983'
}
</script>

<template>
  <!-- 通过内联 style 把 CSS 变量注入根节点 -->
  <div :style="{ '--theme-color': themeColor }" class="app">
    <button class="switch" @click="toggleTheme">
      切换主题
    </button>
    <FancyCard />
  </div>
</template>

<style>
.app {
  font-family: system-ui, sans-serif;
  padding: 2rem;
  line-height: 1.6;
}
.switch {
  margin-bottom: 1rem;
  padding: 6px 14px;
  border: 1px solid var(--theme-color);
  background: white;
  color: var(--theme-color);
  cursor: pointer;
}
</style>
