<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const error = ref('')

onMounted(async () => {
  try {
    await auth.refreshProfile()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '获取用户信息失败'
    auth.clearSession()
    await router.replace({ name: 'login' })
  }
})

async function onLogout() {
  await auth.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <div class="home-page">
    <div class="home-card">
      <h1>欢迎，{{ auth.user?.name ?? '用户' }}</h1>

      <ul v-if="auth.user" class="profile-list">
        <li>
          <span>用户 ID</span>
          <strong>{{ auth.user.id }}</strong>
        </li>
        <li>
          <span>用户名</span>
          <strong>{{ auth.user.name }}</strong>
        </li>
        <li>
          <span>邮箱</span>
          <strong>{{ auth.user.email }}</strong>
        </li>
      </ul>

      <p v-if="error" class="form-error">{{ error }}</p>

      <div class="home-actions">
        <RouterLink class="btn-primary home-link" to="/boss-crawl">BOSS 抓取</RouterLink>
        <RouterLink class="btn-secondary home-link" to="/images">图片管理</RouterLink>
        <button class="btn-secondary" type="button" @click="onLogout">
          退出登录
        </button>
      </div>
    </div>
  </div>
</template>
