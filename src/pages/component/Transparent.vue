<template>
  <div @click="handleClick">
    {{ $attrs.name }}
    <slot></slot>
  </div>
</template>

<script setup>
import { useAttrs } from 'vue'
const attrs = useAttrs();
const handleClick = () => {
    console.log('form sun', attrs)
  }
</script>
