<template>
  <div class="glow-output">
    <span
      v-for="(char, index) in fullText"
      :key="index"
      class="char"
      :class="{ active: index === glowIndex }"
    >
      {{ char }}
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const fullText = '你好，我是 ChatGPT，可以帮你解决开发中的各种问题。'
const glowIndex = ref(0)

onMounted(() => {
  setInterval(() => {
    glowIndex.value = (glowIndex.value + 1) % fullText.length
  }, 100) // 控制扫动速度
})
</script>

<style scoped>
.glow-output {
  font-size: 20px;
  font-family: 'Courier New', Courier, monospace;
  white-space: pre-wrap;
  display: flex;
  flex-wrap: wrap;
  line-height: 1.6;
}

.char {
  transition: all 0.3s ease;
  position: relative;
}

/* 当前扫动字符 */
.char.active {
  color: #42b983;
  text-shadow: 0 0 10px rgba(66, 185, 131, 0.8);
  animation: shimmer 0.8s ease-in-out;
}

@keyframes shimmer {
  0% {
    text-shadow: 0 0 6px rgba(66, 185, 131, 0.5);
  }
  50% {
    text-shadow: 0 0 14px rgba(66, 185, 131, 1);
  }
  100% {
    text-shadow: 0 0 6px rgba(66, 185, 131, 0.5);
  }
}
</style>
