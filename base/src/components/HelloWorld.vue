<script setup>
import { ref, onMounted } from 'vue';
import * as lockr from 'lockr';

defineProps({
  msg: String
});

onMounted(() => {
  lockr.setPrefix('lockr_');
  lockr.set('username', 'King');
  lockr.set('age', 20);
  let age = lockr.get('age');
  console.log(age + 1);
  localStorage.setItem('ls_age', 20);
  let ls_age = localStorage.getItem('ls_age');
  console.log(ls_age + 1);
  // console.log(lockr.get('username'), lockr.get('age'));
  // console.log(localStorage.getItem('lockr_username'));

  lockr.set('stuff', [1, 2, 3, 4]);
  lockr.set('person', {
    name: 'king',
    age: 30,
    hobbies: ['read', 'walk']
  })
  console.log(lockr.get('stuff'), lockr.get('person'));
  console.log(lockr.get('haha', 'haha123'));
  lockr.set('test', []);
  lockr.sadd('test', 1);
  lockr.sadd('test', 2);
  lockr.sadd('test', 2);
  lockr.sadd('test', 22);
  console.log(lockr.get('test'));
  console.log(lockr.smembers('test'));
  lockr.srem('test', 2);
  console.log(lockr.smembers('test'));
  console.log(lockr.sismember('test', 1));
  console.log(lockr.hasPrefix(), lockr.getPrefix(), lockr.getPrefixedKey('test'));
  console.log(lockr.getAll(true));
  lockr.flush();
})

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
