<template>
  <div @click="plusAge">
    Pinia {{ user.name }} {{  user.age }} {{  hello }}
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user';
import { storeToRefs } from 'pinia'

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { plusAge, hello } = userStore
console.log('user:', user);

</script>

<style lang="css" scoped>

</style>