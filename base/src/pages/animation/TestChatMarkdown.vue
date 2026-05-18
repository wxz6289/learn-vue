<template>
  <ChatMarkdown :markdown="mdContent" :speed="15" />
</template>

<script setup>
import ChatMarkdown from './ChatMarkdown.vue'

const mdContent = `
# 你好，世界 👋

这是一个**Markdown 动态渲染示例**。

## 代码高亮

\`\`\`js
function greet(name) {
  console.log("Hello, " + name)
}
greet("ChatGPT")
\`\`\`

- 支持列表
- 支持标题
- 支持斜体、粗体

> 这是一个引用块。
`
</script>
