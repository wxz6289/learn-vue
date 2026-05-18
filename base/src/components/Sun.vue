<template>
  <div @click="updateTest">
    {{ test }}
  </div>
</template>

<script setup>
import { inject } from 'vue';
const { test } = inject('test');
const updateTest = () => {
  test.value = 'Sun update'
}
</script>
