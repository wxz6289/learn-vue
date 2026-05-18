<template>
  <div @click="changeName">
    option api
    <p ref="pref"> {{ name }} created at {{ date }}</p>
  </div>
</template>

<script>
export default {
  props: {
    name: String
  },
  data() {
    return { nickName: 'king', date: new Date().toLocaleDateString()}
  },
  setup () {
    return {}
  },
  mounted() {
    console.log(this, 'this', this.$refs.pref)
  },
  methods: {
    changeName() {
      this.nickName = 'dreamer';
    }
  },
  watch: {
    name(n,o) {
      console.log('watch name:',n, o);
    }
  }
}
</script>

<style lang="scss" scoped>

</style>