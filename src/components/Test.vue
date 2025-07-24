<template>
  <div>
    <h1>{{ $translate('greetings.hello') }}</h1>
    <input type="text" v-model="text" v-focus:hello.trim.once="text" />
    <input type="text" v-model="testNumber"/>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
const text = ref('hello world');
const i18n = inject('i18n');
const testNumber = ref();
onMounted(() => {
  console.log(i18n, 'i18n')
})
</script>
<script>
import { focus } from '../directive/focus';
export default {
  directives: {
    focus
  }
}
</script>

<style lang="scss" scoped></style>