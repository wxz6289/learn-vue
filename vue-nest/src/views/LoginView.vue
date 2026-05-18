<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/components/AuthLayout.vue'
import CaptchaField from '@/components/CaptchaField.vue'
import { ApiError } from '@/api/http'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const captchaRef = ref<InstanceType<typeof CaptchaField> | null>(null)

const form = reactive({
  name: '',
  password: '',
  captchaId: '',
  captchaCode: '',
})

const error = ref('')

async function onSubmit() {
  error.value = ''
  if (!form.captchaId) {
    error.value = '请等待验证码加载完成'
    return
  }

  try {
    await auth.login({
      name: form.name.trim(),
      password: form.password,
      captchaId: form.captchaId,
      captchaCode: form.captchaCode.trim(),
    })
    await router.push({ name: 'home' })
  } catch (e) {
    if (e instanceof ApiError && e.status === 400) {
      captchaRef.value?.refresh()
    }
    error.value = e instanceof Error ? e.message : '登录失败'
  }
}
</script>

<template>
  <AuthLayout title="登录" subtitle="使用 Nest 后端账号登录">
    <form class="auth-form" @submit.prevent="onSubmit">
      <div class="field">
        <label class="field-label" for="name">用户名</label>
        <input
          id="name"
          v-model="form.name"
          class="field-input"
          type="text"
          autocomplete="username"
          placeholder="请输入用户名"
          required
        />
      </div>

      <div class="field">
        <label class="field-label" for="password">密码</label>
        <input
          id="password"
          v-model="form.password"
          class="field-input"
          type="password"
          autocomplete="current-password"
          placeholder="至少 6 位"
          minlength="6"
          required
        />
      </div>

      <CaptchaField
        ref="captchaRef"
        v-model:captcha-id="form.captchaId"
        v-model:captcha-code="form.captchaCode"
      />

      <p v-if="error" class="form-error">{{ error }}</p>

      <button class="btn-primary" type="submit" :disabled="auth.loading">
        {{ auth.loading ? '登录中…' : '登录' }}
      </button>
    </form>

    <p class="auth-footer">
      还没有账号？
      <RouterLink to="/register">立即注册</RouterLink>
    </p>
  </AuthLayout>
</template>
