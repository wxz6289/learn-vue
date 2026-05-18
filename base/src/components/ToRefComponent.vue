<template>
  <div>

  </div>
</template>

<script setup>
import { reactive, toRef } from 'vue';

const state = reactive({
  foo: 1,
  bar: 1
});

const fooRef = toRef(state, 'foo');

console.log('foo:', state.foo, 'bar:', state.bar, "fooRef:", fooRef.value);
state.foo++;
console.log('foo:', state.foo, 'bar:', state.bar, "fooRef:", fooRef.value);
fooRef.value++;
console.log('foo:', state.foo, 'bar:', state.bar, "fooRef:", fooRef.value);
</script>

<style lang="scss" scoped></style>