<template>
  <div @click="handleClick">
    Test {{ count }} {{ user.name }} {{ user.inner.age }}
    <p>useModel {{ age }}</p>
  </div>
</template>

<script setup>
import { ref, nextTick, reactive, useModel } from 'vue';

const count = ref(0);
const origin = {
  name: 'king',
  inner: {
    age: 20
  }
};
const user = reactive(origin);
const props = defineProps({ age: Number })
const age = useModel(props, 'age');
const handleClick = () => {
  count.value++;
  count.value++;
  origin.inner.age = 30;
  nextTick(() => {
    console.log(count.value, origin == user);
  })

}

</script>

<style lang="scss" scoped>

</style>