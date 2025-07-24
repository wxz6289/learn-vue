<template>
  <div class="error-page">
    <h2>页面出错了</h2>
    <p>抱歉，页面遇到了一个错误。</p>
    <p v-if="errorMessage">错误信息: {{ errorMessage }}</p>
    <button @click="goHome">返回首页</button>
    <button @click="reload">重新加载</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const errorMessage = ref('');

onMounted(() => {
  // 从查询参数中获取错误信息
  const urlParams = new URLSearchParams(window.location.search);
  errorMessage.value = urlParams.get('error') || '';
});

const goHome = () => {
  router.push('/');
};

const reload = () => {
  window.location.reload();
};
</script>

<style scoped>
.error-page {
  text-align: center;
  padding: 2rem;
}

button {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}
</style>
