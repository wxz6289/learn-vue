<template>
  <div>
    {{  title }} | {{ name }}
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  props: [ 'title'],
  setup (props, ctx) {
    const name = ref('dreamer')
    console.log("props:", props);
    console.log("ctx:", ctx);
    return { name }
  }
}
</script>

<style lang="scss" scoped>

</style>