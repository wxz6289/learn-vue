<template>
  <div>
  <router-link to="/home">Home</router-link>
  <router-link to="/pinia">Pinia</router-link>
   <input type="number" v-model.number="testNumber">
   <input type="text" v-model.number="testNumber">
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router'
const testNumber = ref();


</script>

<style lang="scss" scoped>

</style>
