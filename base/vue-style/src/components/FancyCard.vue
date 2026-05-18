<script setup>
import InnerButton from './InnerButton.vue'
</script>

<template>
  <!-- $style.card 来自 <style module> 自动哈希后的类名 -->
  <div :class="$style.card">
    <h2>Fancy Card</h2>
    <p>这里展示了 Scoped + CSS Modules + v‑deep + CSS Var 的组合。</p>
    <InnerButton />
  </div>
</template>

<!-- ⚡️ 同时开启 module + scoped -->
<style module scoped>
.card {
  border: 2px solid var(--theme-color);
  padding: 16px;
  border-radius: 10px;
  background: #fafafa;
  transition: border-color 0.3s ease;
}

</style>
<!--  /* 透传区块，避免 module 哈希 */ -->
<style scoped>
/* 深度穿透：修改子组件 InnerButton 中 .inner-btn */
:deep(.inner-btn)  {
  color: var(--theme-color);
  border: 1px solid var(--theme-color);
  background: red;
}
</style>
