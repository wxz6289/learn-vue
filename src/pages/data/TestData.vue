<template>
  <div>
    {{ item.name }} - {{ item.age }}  | {{ name }}
  </div>
  <button @click="addAgeProperty">Add Age</button>
  <button @click="updateName">updateName</button>
  <button @click="removeName">Remove Name</button>

</template>

<script lang="ts">
export default {
  data() {
    return {
      name: 'Dreamer',
      item: { name: 'King' }
  }
  },
  methods: {
    addAgeProperty() {
      this.item = Object.assign({}, {...this.item, age: 23})
     /*  this.age = 23;
      this.$forceUpdate() */
    },
    updateName() {
      this.item.name = 'Dreamer'
    },
    removeName() {
      delete this.$data.name
    }
  },
}
</script>
