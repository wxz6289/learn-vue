<template>
  <div>
    <p>Question:
      <input v-model="question" />
    </p>
    <p>Answer: {{ answer }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const question = ref('想问什么就问吧！以？结束哦！');
const answer = ref('');
watch(question, async (newQuestion, oldQuestion) => {
  console.log(newQuestion);
  if (newQuestion.indexOf('?') > -1) {
    answer.value = '思考中。。。';
    try {
      const response = await fetch('https://yesno.wtf/api');
      answer.value = (await response.json()).answer;
    } catch (e) {
      answer.value = 'opps! ' + e.message;
    }
  }
})
</script>

<style lang="scss" scoped></style>