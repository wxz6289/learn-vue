<template>
  <div class="ripple-container" @click="createRipple">
    点击我试试
    <span
      v-for="(r, index) in ripples"
      :key="r.id"
      class="ripple"
      :style="{
        left: r.x + 'px',
        top: r.y + 'px'
      }"
    ></span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ripples = ref([])

function createRipple(e) {
  const container = e.currentTarget
  const rect = container.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const id = Date.now()

  ripples.value.push({ x, y, id })

  // 移除动画元素
  setTimeout(() => {
    ripples.value = ripples.value.filter((r) => r.id !== id)
  }, 600)
}
</script>

<style scoped>
.ripple-container {
  position: relative;
  overflow: hidden;
  width: 200px;
  height: 60px;
  background: #3f51b5;
  color: white;
  text-align: center;
  line-height: 60px;
  user-select: none;
  cursor: pointer;
  border-radius: 8px;
}

.ripple {
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  transform: scale(1);
  animation: ripple 0.6s ease-out;
  pointer-events: none;
}

@keyframes ripple {
  from {
    transform: scale(1);
    opacity: 0.6;
  }
  to {
    transform: scale(10);
    opacity: 0;
  }
}
</style>
