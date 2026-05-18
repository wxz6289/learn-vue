<template>
  <div @click="state.count++">
    {{ state.count }}
  </div>
</template>

<script>
import { reactive } from 'vue'
export default {
  setup() {
    const state = reactive({ count: 0 })

    return {
      state
    }
  }
}
</script>

<style lang="scss" scoped></style>