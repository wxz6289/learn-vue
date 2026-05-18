<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchCaptcha } from '@/api/auth'

const captchaId = defineModel<string>('captchaId', { required: true })
const captchaCode = defineModel<string>('captchaCode', { required: true })

const image = ref('')
const loading = ref(false)
const error = ref('')

async function refresh() {
  loading.value = true
  error.value = ''
  captchaCode.value = ''
  try {
    const res = await fetchCaptcha()
    captchaId.value = res.captchaId
    image.value = res.image
  } catch (e) {
    error.value = e instanceof Error ? e.message : '验证码加载失败'
    captchaId.value = ''
    image.value = ''
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void refresh()
})

defineExpose({ refresh })
</script>

<template>
  <div class="captcha-field">
    <label class="field-label" for="captchaCode">验证码</label>
    <div class="captcha-row">
      <input
        id="captchaCode"
        v-model="captchaCode"
        class="field-input"
        type="text"
        autocomplete="off"
        maxlength="6"
        placeholder="请输入验证码"
        :disabled="loading"
      />
      <button
        type="button"
        class="captcha-image-btn"
        :disabled="loading"
        title="点击刷新验证码"
        @click="refresh"
      >
        <img
          v-if="image"
          :src="image"
          alt="验证码"
          class="captcha-image"
        />
        <span v-else class="captcha-placeholder">
          {{ loading ? '加载中…' : '点击加载' }}
        </span>
      </button>
    </div>
    <p v-if="error" class="field-error">{{ error }}</p>
  </div>
</template>

<style scoped>
.captcha-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.captcha-row {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
}

.captcha-row .field-input {
  flex: 1;
}

.captcha-image-btn {
  flex-shrink: 0;
  width: 7.5rem;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: #fff;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.15s ease;
}

.captcha-image-btn:hover:not(:disabled) {
  border-color: var(--primary);
}

.captcha-image-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.captcha-image {
  display: block;
  width: 100%;
  height: 2.75rem;
  object-fit: cover;
}

.captcha-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.75rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
