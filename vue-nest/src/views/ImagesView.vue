<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  createExternalImage,
  deleteImage,
  fetchImages,
  updateImage,
  uploadImage,
} from '@/api/images'
import { useAuthStore } from '@/stores/auth'
import type { ImageItem, ImageStorageType } from '@/types/image'

const router = useRouter()
const auth = useAuthStore()

const loading = ref(false)
const error = ref('')
const items = ref<ImageItem[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 20
const filterType = ref<ImageStorageType | ''>('')

const uploadTitle = ref('')
const uploadFile = ref<File | null>(null)
const uploadPreview = ref('')

const externalForm = reactive({ url: '', title: '' })
const editingId = ref<number | null>(null)
const editTitle = ref('')

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

function ensureToken(): string | null {
  if (!auth.token) {
    void router.replace({ name: 'login' })
    return null
  }
  return auth.token
}

async function loadList() {
  const token = ensureToken()
  if (!token) return

  loading.value = true
  error.value = ''
  try {
    const res = await fetchImages(token, {
      page: page.value,
      pageSize,
      storageType: filterType.value || undefined,
    })
    items.value = res.items
    total.value = res.total
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  uploadFile.value = file
  if (uploadPreview.value) {
    URL.revokeObjectURL(uploadPreview.value)
  }
  uploadPreview.value = file ? URL.createObjectURL(file) : ''
}

async function onUpload() {
  const token = ensureToken()
  if (!token || !uploadFile.value) {
    error.value = '请选择图片文件'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await uploadImage(token, uploadFile.value, uploadTitle.value)
    uploadTitle.value = ''
    uploadFile.value = null
    if (uploadPreview.value) URL.revokeObjectURL(uploadPreview.value)
    uploadPreview.value = ''
    await loadList()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '上传失败'
  } finally {
    loading.value = false
  }
}

async function onAddExternal() {
  const token = ensureToken()
  if (!token) return
  loading.value = true
  error.value = ''
  try {
    await createExternalImage(token, {
      url: externalForm.url.trim(),
      title: externalForm.title.trim() || undefined,
    })
    externalForm.url = ''
    externalForm.title = ''
    await loadList()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '添加失败'
  } finally {
    loading.value = false
  }
}

function startEdit(item: ImageItem) {
  editingId.value = item.id
  editTitle.value = item.title ?? ''
}

async function saveEdit(item: ImageItem) {
  const token = ensureToken()
  if (!token) return
  loading.value = true
  error.value = ''
  try {
    await updateImage(token, item.id, { title: editTitle.value })
    editingId.value = null
    await loadList()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '保存失败'
  } finally {
    loading.value = false
  }
}

async function onDelete(item: ImageItem) {
  if (!confirm(`确定删除「${item.title || item.url}」？`)) return
  const token = ensureToken()
  if (!token) return
  loading.value = true
  error.value = ''
  try {
    await deleteImage(token, item.id)
    await loadList()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '删除失败'
  } finally {
    loading.value = false
  }
}

function formatSize(size: number | null) {
  if (!size) return '-'
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / 1024 / 1024).toFixed(2)} MB`
}

function storageLabel(type: ImageStorageType) {
  return type === 'OSS' ? 'OSS' : '外链'
}

onMounted(() => {
  void loadList()
})
</script>

<template>
  <div class="images-page">
    <header class="images-header">
      <div>
        <h1>图片管理</h1>
        <p>本地上传至阿里云 OSS，或维护外链图片（不存入 OSS）</p>
      </div>
      <RouterLink class="btn-secondary" to="/home">返回首页</RouterLink>
    </header>

    <p v-if="error" class="form-error">{{ error }}</p>

    <section class="panel">
      <h2>上传到 OSS</h2>
      <div class="panel-grid">
        <div class="field">
          <label class="field-label">标题（可选）</label>
          <input v-model="uploadTitle" class="field-input" type="text" placeholder="例如：活动海报" />
        </div>
        <div class="field">
          <label class="field-label">选择图片</label>
          <input class="field-input" type="file" accept="image/jpeg,image/png,image/gif,image/webp" @change="onFileChange" />
        </div>
      </div>
      <div class="panel-actions">
        <img v-if="uploadPreview" :src="uploadPreview" alt="预览" class="thumb-preview" />
        <button class="btn-primary" type="button" :disabled="loading" @click="onUpload">上传</button>
      </div>
    </section>

    <section class="panel">
      <h2>添加外链图片</h2>
      <div class="panel-grid">
        <div class="field">
          <label class="field-label">图片 URL</label>
          <input v-model="externalForm.url" class="field-input" type="url" placeholder="https://example.com/a.png" required />
        </div>
        <div class="field">
          <label class="field-label">标题（可选）</label>
          <input v-model="externalForm.title" class="field-input" type="text" placeholder="例如：第三方 CDN 图" />
        </div>
      </div>
      <button class="btn-primary" type="button" :disabled="loading" @click="onAddExternal">添加外链</button>
    </section>

    <section class="panel">
      <div class="list-toolbar">
        <h2>图片列表</h2>
        <select v-model="filterType" class="field-input filter-select" @change="page = 1; loadList()">
          <option value="">全部类型</option>
          <option value="OSS">OSS</option>
          <option value="EXTERNAL">外链</option>
        </select>
      </div>

      <div v-if="loading && !items.length" class="empty-hint">加载中…</div>
      <div v-else-if="!items.length" class="empty-hint">暂无图片</div>

      <div v-else class="image-grid">
        <article v-for="item in items" :key="item.id" class="image-card">
          <a :href="item.url" target="_blank" rel="noopener noreferrer">
            <img :src="item.url" :alt="item.title ?? '图片'" class="thumb" loading="lazy" />
          </a>
          <div class="image-card-body">
            <span class="badge" :class="item.storageType === 'OSS' ? 'badge-oss' : 'badge-ext'">
              {{ storageLabel(item.storageType) }}
            </span>
            <div v-if="editingId === item.id" class="edit-row">
              <input v-model="editTitle" class="field-input" type="text" />
              <button class="btn-primary btn-sm" type="button" @click="saveEdit(item)">保存</button>
              <button class="btn-secondary btn-sm" type="button" @click="editingId = null">取消</button>
            </div>
            <p v-else class="image-title">{{ item.title || '（无标题）' }}</p>
            <p class="image-meta">{{ formatSize(item.size) }} · ID {{ item.id }}</p>
            <p class="image-url" :title="item.url">{{ item.url }}</p>
            <div class="card-actions">
              <button class="btn-secondary btn-sm" type="button" @click="startEdit(item)">编辑标题</button>
              <button class="btn-danger btn-sm" type="button" @click="onDelete(item)">删除</button>
            </div>
          </div>
        </article>
      </div>

      <div v-if="totalPages > 1" class="pager">
        <button class="btn-secondary btn-sm" type="button" :disabled="page <= 1 || loading" @click="page--; loadList()">上一页</button>
        <span>{{ page }} / {{ totalPages }}（共 {{ total }} 条）</span>
        <button class="btn-secondary btn-sm" type="button" :disabled="page >= totalPages || loading" @click="page++; loadList()">下一页</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.images-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
}

.images-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.images-header h1 {
  margin: 0 0 0.35rem;
  font-size: 1.6rem;
}

.images-header p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.panel {
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.panel h2 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.thumb-preview {
  width: 5rem;
  height: 5rem;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}

.list-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.list-toolbar h2 {
  margin: 0;
}

.filter-select {
  width: auto;
  min-width: 8rem;
}

.empty-hint {
  color: var(--text-muted);
  text-align: center;
  padding: 2rem 0;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.image-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: #fff;
}

.thumb {
  display: block;
  width: 100%;
  height: 140px;
  object-fit: cover;
  background: #f1f5f9;
}

.image-card-body {
  padding: 0.75rem;
}

.badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  margin-bottom: 0.5rem;
}

.badge-oss {
  background: var(--primary-soft);
  color: var(--primary);
}

.badge-ext {
  background: #ecfdf5;
  color: #059669;
}

.image-title {
  margin: 0 0 0.25rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.image-meta {
  margin: 0 0 0.35rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.image-url {
  margin: 0 0 0.65rem;
  font-size: 0.72rem;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-actions,
.edit-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.edit-row .field-input {
  flex: 1;
  min-width: 6rem;
}

.btn-sm {
  height: 2rem;
  padding: 0 0.65rem;
  font-size: 0.8rem;
}

.btn-danger {
  height: 2rem;
  padding: 0 0.65rem;
  border: 1px solid #fecaca;
  border-radius: var(--radius-sm);
  background: #fff;
  color: var(--danger);
  font-size: 0.8rem;
  cursor: pointer;
}

.btn-danger:hover {
  background: var(--danger-soft);
}

.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}
</style>
