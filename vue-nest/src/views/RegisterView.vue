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
  email: '',
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
    await auth.register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      captchaId: form.captchaId,
      captchaCode: form.captchaCode.trim(),
    })
    await router.push({ name: 'home' })
  } catch (e) {
    if (e instanceof ApiError && e.status === 400) {
      captchaRef.value?.refresh()
    }
    error.value = e instanceof Error ? e.message : '注册失败'
  }
}
</script>

<template>
  <AuthLayout title="注册" subtitle="创建账号并自动登录">
    <form class="auth-form" @submit.prevent="onSubmit">
      <div class="field">
        <label class="field-label" for="name">用户名</label>
        <input
          id="name"
          v-model="form.name"
          class="field-input"
          type="text"
          autocomplete="username"
          placeholder="2–20 个字符"
          minlength="2"
          maxlength="20"
          required
        />
      </div>

      <div class="field">
        <label class="field-label" for="email">邮箱</label>
        <input
          id="email"
          v-model="form.email"
          class="field-input"
          type="email"
          autocomplete="email"
          placeholder="name@example.com"
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
          autocomplete="new-password"
          placeholder="6–20 个字符"
          minlength="6"
          maxlength="20"
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
        {{ auth.loading ? '注册中…' : '注册' }}
      </button>
    </form>

    <p class="auth-footer">
      已有账号？
      <RouterLink to="/login">去登录</RouterLink>
    </p>
  </AuthLayout>
</template>
