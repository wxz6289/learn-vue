<template>
  <div>
    {{ person.name }} |> {{ person.age }}
  </div>
  <button @click="addAge">Add Age</button>
  <button @click="removeName">RemoveName</button>
</template>

<script setup>
import { reactive } from 'vue';
const person = reactive({
  name: "Dreamer"
});

const addAge = () => {
  person.age = 23
}

const removeName = () => {
  delete person.name
}

</script>
