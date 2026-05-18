<template>
  <div class="markdown-output" v-html="renderedHtml"></div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css' // 代码主题

const props = defineProps({
  markdown: String,
  speed: { type: Number, default: 20 } // 打字速度ms/字符
})

const renderedHtml = ref('')
let currentIndex = 0
let timer = null

// 设置代码高亮
marked.setOptions({
  highlight(code, lang) {
    if (hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  }
})

function typeMarkdown(md) {
  clearInterval(timer)
  renderedHtml.value = ''
  currentIndex = 0

  timer = setInterval(() => {
    currentIndex++
    const partial = md.slice(0, currentIndex)
    renderedHtml.value = marked.parse(partial)

    if (currentIndex >= md.length) clearInterval(timer)
  }, props.speed)
}

watch(() => props.markdown, (newMd) => {
  if (newMd) typeMarkdown(newMd)
})

onMounted(() => {
  if (props.markdown) typeMarkdown(props.markdown)
})
</script>

<style>
.markdown-output {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  padding: 1em;
}
.markdown-output pre {
  background: #f6f8fa;
  padding: 1em;
  overflow-x: auto;
  border-radius: 5px;
}
</style>
