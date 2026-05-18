<template>
  <div @click="sunClick">
    <label for="custom">自定义组件</label>
    <input :value="name" @input="handelInput" />
    <p v-bind="$attrs">{{ $attrs }}</p>
  </div>
</template>

<script setup>
import { useAttrs } from 'vue'
const props = defineProps({
  name: String,
  nameModifiers: { default: () => ({}) }
});
const emit = defineEmits(['update:name']);

const handelInput = (e) => {
  let value = e.target.value;
  if (props.nameModifiers) {
    value = value.charAt(0).toUpperCase() + value.substring(1);
  }
  emit('update:name', value);
}

const sunClick = () => {
  console.log('sunClick');
}

const attrs = useAttrs();
console.log(attrs);
</script>

<script>
export default {
  inheritAttrs: false
}
</script>
