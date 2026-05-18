<template>
  <transparent @click="handleClick" name="dreamer">
    透传Click 
  </transparent>
</template>

<script setup>
import Transparent from './Transparent.vue'

const handleClick = () => {
  console.log('from parent');
}
</script>
