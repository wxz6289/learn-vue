<template>
  <div class="chatgpt-typing">
    <span v-for="(char, index) in displayText" :key="index">{{ char }}</span>
    <span class="cursor">▋</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const fullText = `你好，我是 ChatGPT。\n我可以帮助你解决各种开发问题，包括 Vue、React、Node 等。`
const displayText = ref('')
const speed = 50 // 打字速度（毫秒）
let index = 0

function typeNextChar() {
  if (index < fullText.length) {
    displayText.value += fullText[index]
    index++
    setTimeout(typeNextChar, speed)
  }
}

onMounted(() => {
  typeNextChar()
})
</script>

<style scoped>
.chatgpt-typing {
  font-family: 'Courier New', monospace;
  font-size: 18px;
  white-space: pre-wrap;
  line-height: 1.6;
  position: relative;
}

.cursor {
  display: inline-block;
  width: 10px;
  color: #42b983;
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  49% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
</style>
