import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  provide,
  reactive,
  ref,
  watch,
  type InjectionKey,
} from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import type { DataTableRowClickEvent } from 'primevue/datatable'
import {
  createBossConfig,
  deleteBossConfig,
  fetchBossConfigs,
  fetchBossJobs,
  fetchBossTask,
  fetchBossTasks,
  cancelBossManualLogin,
  confirmBossManualLogin,
  fetchBossManualLoginStatus,
  loginBossAccount,
  runBossCrawl,
  stopBossCrawlTask,
  deleteBossCrawlTask,
  startBossManualLogin,
  updateBossConfig,
  updateBossCredentials,
  updateBossSession,
} from '@/api/boss-crawl'
import { useAuthStore } from '@/stores/auth'
import type { BossCrawlConfig, BossCrawlTask, BossJob } from '@/types/boss-crawl'
import type { BossConfigFormState } from '@/components/boss-crawl/boss-crawl.types'
import {
  canViewBossTaskJobs,
  isBossTaskActive,
} from '@/utils/boss-crawl-display'

export type BossCrawlContext = ReturnType<typeof useBossCrawlState>

const bossCrawlContextKey: InjectionKey<BossCrawlContext> = Symbol('boss-crawl')

export function useBossCrawlState() {
  const router = useRouter()
  const auth = useAuthStore()
  const toast = useToast()
  const confirm = useConfirm()

  const activeTab = ref<'configs' | 'tasks' | 'jobs'>('configs')
  const loading = ref(false)
  const error = ref('')

  const configs = ref<BossCrawlConfig[]>([])
  const tasks = ref<BossCrawlTask[]>([])
  const jobs = ref<BossJob[]>([])
  const jobsTotal = ref(0)
  const jobsPage = ref(1)
  const jobsPageSize = 20
  const jobsConfigId = ref<number | ''>('')
  const jobsTaskId = ref<number | ''>('')

  const selectedConfigId = ref<number | null>(null)
  const sessionJson = ref('')
  const smsCode = ref('')
  const needSmsCode = ref(false)
  const loginSessionId = ref('')
  const manualLoginPending = ref(false)
  const pollingTaskId = ref<number | null>(null)

  const credentialForm = reactive({
    bossPhone: '',
    bossPassword: '',
    autoLogin: false,
  })

  let pollTimer: ReturnType<typeof setInterval> | null = null

  const createForm = reactive<BossConfigFormState>({
    name: '',
    keyword: 'Java',
    cityCode: '101010100',
    cityName: '北京',
    salaryMin: undefined,
    salaryMax: undefined,
    maxPages: 3,
    delayMinMs: 1200,
    delayMaxMs: 3500,
    headless: true,
  })

  const editForm = reactive<BossConfigFormState>({
    name: '',
    keyword: '',
    cityCode: '',
    cityName: '',
    salaryMin: undefined,
    salaryMax: undefined,
    maxPages: 3,
    delayMinMs: 1200,
    delayMaxMs: 3500,
    headless: true,
    enabled: true,
  })

  const selectedConfig = computed(
    () => configs.value.find((c) => c.id === selectedConfigId.value) ?? null,
  )

  const activeTask = computed(
    () => tasks.value.find((t) => t.id === pollingTaskId.value) ?? null,
  )

  function ensureToken(): string | null {
    if (!auth.token) {
      void router.replace({ name: 'login' })
      return null
    }
    return auth.token
  }

  function flashSuccess(msg: string) {
    error.value = ''
    toast.add({ severity: 'success', summary: '操作成功', detail: msg, life: 4000 })
  }

  function setError(msg: string) {
    error.value = msg
    toast.add({ severity: 'error', summary: '提示', detail: msg, life: 6000 })
  }

  function onConfigRowClick(event: DataTableRowClickEvent) {
    selectConfig(event.data as BossCrawlConfig)
  }

  function onJobsPageChange(event: { page: number }) {
    jobsPage.value = event.page + 1
    void loadJobs()
  }

  async function loadConfigs() {
    const token = ensureToken()
    if (!token) return
    const list = await fetchBossConfigs(token)
    configs.value = list
    if (selectedConfigId.value && !list.some((c) => c.id === selectedConfigId.value)) {
      selectedConfigId.value = null
    }
  }

  async function loadTasks() {
    const token = ensureToken()
    if (!token) return
    tasks.value = await fetchBossTasks(token)
  }

  async function loadJobs() {
    const token = ensureToken()
    if (!token) return
    const res = await fetchBossJobs(token, {
      page: jobsPage.value,
      pageSize: jobsPageSize,
      configId: jobsConfigId.value || undefined,
      taskId: jobsTaskId.value || undefined,
    })
    jobs.value = res.items
    jobsTotal.value = res.total
  }

  async function refreshAll() {
    loading.value = true
    error.value = ''
    try {
      await Promise.all([loadConfigs(), loadTasks(), loadJobs()])
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败')
    } finally {
      loading.value = false
    }
  }

  function fillEditForm(config: BossCrawlConfig) {
    editForm.name = config.name
    editForm.keyword = config.keyword
    editForm.cityCode = config.cityCode
    editForm.cityName = config.cityName ?? ''
    editForm.salaryMin = config.salaryMin ?? undefined
    editForm.salaryMax = config.salaryMax ?? undefined
    editForm.maxPages = config.maxPages
    editForm.delayMinMs = config.delayMinMs
    editForm.delayMaxMs = config.delayMaxMs
    editForm.headless = config.headless
    editForm.enabled = config.enabled
    credentialForm.autoLogin = config.autoLogin
    credentialForm.bossPhone = ''
    credentialForm.bossPassword = ''
    needSmsCode.value = false
    smsCode.value = ''
    loginSessionId.value = ''
    manualLoginPending.value = false
  }

  function selectConfig(config: BossCrawlConfig) {
    selectedConfigId.value = config.id
    fillEditForm(config)
    sessionJson.value = ''
  }

  function openEdit(config: BossCrawlConfig) {
    selectConfig(config)
    requestAnimationFrame(() => {
      document
        .getElementById('boss-config-edit')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  function cancelEdit() {
    selectedConfigId.value = null
    sessionJson.value = ''
    error.value = ''
  }

  async function onCreateConfig() {
    const token = ensureToken()
    if (!token) return
    if (!createForm.name.trim() || !createForm.keyword.trim()) {
      setError('请填写配置名称和关键词')
      return
    }
    loading.value = true
    error.value = ''
    try {
      await createBossConfig(token, {
        name: createForm.name.trim(),
        keyword: createForm.keyword.trim(),
        cityCode: createForm.cityCode.trim(),
        cityName: createForm.cityName.trim() || undefined,
        salaryMin: createForm.salaryMin,
        salaryMax: createForm.salaryMax,
        maxPages: createForm.maxPages,
        delayMinMs: createForm.delayMinMs,
        delayMaxMs: createForm.delayMaxMs,
        headless: createForm.headless,
      })
      createForm.name = ''
      flashSuccess('配置已创建')
      await loadConfigs()
    } catch (e) {
      setError(e instanceof Error ? e.message : '创建失败')
    } finally {
      loading.value = false
    }
  }

  async function onSaveConfig() {
    if (!selectedConfigId.value) return
    const token = ensureToken()
    if (!token) return
    if (!editForm.name.trim() || !editForm.keyword.trim()) {
      setError('请填写配置名称和关键词')
      return
    }
    if (editForm.delayMinMs > editForm.delayMaxMs) {
      setError('延迟最小值不能大于最大值')
      return
    }
    loading.value = true
    error.value = ''
    try {
      const updated = await updateBossConfig(token, selectedConfigId.value, {
        name: editForm.name.trim(),
        keyword: editForm.keyword.trim(),
        cityCode: editForm.cityCode.trim(),
        cityName: editForm.cityName.trim() || undefined,
        salaryMin: editForm.salaryMin,
        salaryMax: editForm.salaryMax,
        maxPages: editForm.maxPages,
        delayMinMs: editForm.delayMinMs,
        delayMaxMs: editForm.delayMaxMs,
        headless: editForm.headless,
        enabled: editForm.enabled,
      })
      const idx = configs.value.findIndex((c) => c.id === updated.id)
      if (idx >= 0) {
        configs.value[idx] = updated
      }
      fillEditForm(updated)
      flashSuccess('配置已保存')
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存失败')
    } finally {
      loading.value = false
    }
  }

  async function onToggleEnabled(config: BossCrawlConfig) {
    const token = ensureToken()
    if (!token) return
    loading.value = true
    error.value = ''
    try {
      const updated = await updateBossConfig(token, config.id, {
        enabled: !config.enabled,
      })
      const idx = configs.value.findIndex((c) => c.id === updated.id)
      if (idx >= 0) {
        configs.value[idx] = updated
      }
      if (selectedConfigId.value === config.id) {
        fillEditForm(updated)
      }
      flashSuccess(updated.enabled ? '已启用' : '已禁用')
    } catch (e) {
      setError(e instanceof Error ? e.message : '更新状态失败')
    } finally {
      loading.value = false
    }
  }

  async function onSaveCredentials() {
    if (!selectedConfigId.value) return
    const token = ensureToken()
    if (!token) return
    if (!credentialForm.bossPhone.trim() && !credentialForm.bossPassword.trim()) {
      setError('请填写手机号或密码')
      return
    }
    loading.value = true
    error.value = ''
    try {
      const updated = await updateBossCredentials(token, selectedConfigId.value, {
        bossPhone: credentialForm.bossPhone.trim() || undefined,
        bossPassword: credentialForm.bossPassword.trim() || undefined,
        autoLogin: credentialForm.autoLogin,
      })
      const idx = configs.value.findIndex((c) => c.id === updated.id)
      if (idx >= 0) {
        configs.value[idx] = updated
      }
      credentialForm.bossPassword = ''
      flashSuccess('账号已保存')
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存账号失败')
    } finally {
      loading.value = false
    }
  }

  async function onStartManualLogin() {
    if (!selectedConfigId.value) return
    const token = ensureToken()
    if (!token) return
    loading.value = true
    error.value = ''
    try {
      const res = await startBossManualLogin(token, selectedConfigId.value)
      loginSessionId.value = res.loginSessionId
      manualLoginPending.value = true
      toast.add({
        severity: 'info',
        summary: '手动登录',
        detail: res.message,
        life: 8000,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : '无法打开浏览器')
    } finally {
      loading.value = false
    }
  }

  async function onConfirmManualLogin() {
    if (!selectedConfigId.value || !loginSessionId.value) return
    const token = ensureToken()
    if (!token) return
    loading.value = true
    error.value = ''
    try {
      const res = await confirmBossManualLogin(token, selectedConfigId.value, {
        loginSessionId: loginSessionId.value,
      })
      if (!res.success) {
        setError(res.message)
        return
      }
      manualLoginPending.value = false
      loginSessionId.value = ''
      if (res.config) {
        const idx = configs.value.findIndex((c) => c.id === res.config!.id)
        if (idx >= 0) {
          configs.value[idx] = res.config
        }
        fillEditForm(res.config)
      } else {
        await loadConfigs()
      }
      flashSuccess(res.message || '登录态已保存')
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存登录态失败')
    } finally {
      loading.value = false
    }
  }

  async function onCancelManualLogin() {
    if (!selectedConfigId.value || !loginSessionId.value) {
      manualLoginPending.value = false
      return
    }
    const token = ensureToken()
    if (!token) return
    try {
      await cancelBossManualLogin(token, selectedConfigId.value, {
        loginSessionId: loginSessionId.value,
      })
    } catch {
      // ignore
    }
    loginSessionId.value = ''
    manualLoginPending.value = false
    flashSuccess('已取消手动登录')
  }

  async function onCheckManualLoginStatus() {
    if (!loginSessionId.value) return
    const token = ensureToken()
    if (!token) return
    try {
      const status = await fetchBossManualLoginStatus(token, loginSessionId.value)
      if (status.loggedIn) {
        flashSuccess('检测到已登录，请点击「确认已登录」保存会话')
      } else {
        setError('浏览器中尚未检测到登录，请完成登录后再试')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '检测失败')
    }
  }

  async function onBossLogin() {
    if (!selectedConfigId.value) return
    const token = ensureToken()
    if (!token) return
    loading.value = true
    error.value = ''
    try {
      if (credentialForm.bossPhone.trim() || credentialForm.bossPassword.trim()) {
        await updateBossCredentials(token, selectedConfigId.value, {
          bossPhone: credentialForm.bossPhone.trim() || undefined,
          bossPassword: credentialForm.bossPassword.trim() || undefined,
          autoLogin: credentialForm.autoLogin,
        })
      }
      const res = await loginBossAccount(token, selectedConfigId.value, {
        smsCode: smsCode.value.trim() || undefined,
        bossPassword: credentialForm.bossPassword.trim() || undefined,
      })
      if (res.needSmsCode) {
        needSmsCode.value = true
        setError(res.message)
        return
      }
      if (!res.success) {
        setError(res.message)
        return
      }
      needSmsCode.value = false
      smsCode.value = ''
      credentialForm.bossPassword = ''
      if (res.config) {
        const idx = configs.value.findIndex((c) => c.id === res.config!.id)
        if (idx >= 0) {
          configs.value[idx] = res.config
        }
        fillEditForm(res.config)
      }
      flashSuccess(res.message || '登录成功')
    } catch (e) {
      setError(e instanceof Error ? e.message : '登录失败')
    } finally {
      loading.value = false
    }
  }

  async function onSaveSession() {
    if (!selectedConfigId.value || !sessionJson.value.trim()) {
      setError('请粘贴 Playwright storageState JSON')
      return
    }
    const token = ensureToken()
    if (!token) return
    loading.value = true
    error.value = ''
    try {
      JSON.parse(sessionJson.value)
      await updateBossSession(token, selectedConfigId.value, sessionJson.value.trim())
      await loadConfigs()
      flashSuccess('登录态已更新')
      sessionJson.value = ''
    } catch (e) {
      setError(e instanceof Error ? e.message : 'JSON 格式错误或保存失败')
    } finally {
      loading.value = false
    }
  }

  function onDeleteConfig(config: BossCrawlConfig) {
    confirm.require({
      message: `确定删除配置「${config.name}」？`,
      header: '确认删除',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: '取消',
      acceptLabel: '删除',
      acceptClass: 'p-button-danger',
      accept: () => {
        void deleteConfigConfirmed(config)
      },
    })
  }

  async function deleteConfigConfirmed(config: BossCrawlConfig) {
    const token = ensureToken()
    if (!token) return
    loading.value = true
    error.value = ''
    try {
      await deleteBossConfig(token, config.id)
      if (selectedConfigId.value === config.id) {
        selectedConfigId.value = null
      }
      flashSuccess('已删除')
      await loadConfigs()
    } catch (e) {
      setError(e instanceof Error ? e.message : '删除失败')
    } finally {
      loading.value = false
    }
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  async function pollTask(taskId: number) {
    const token = ensureToken()
    if (!token) return
    const task = await fetchBossTask(token, taskId)
    const idx = tasks.value.findIndex((t) => t.id === taskId)
    if (idx >= 0) {
      tasks.value[idx] = task
    } else {
      tasks.value.unshift(task)
    }
    if (isBossTaskActive(task.status)) {
      return
    }
    stopPolling()
    pollingTaskId.value = null
    await loadTasks()
    if (task.status === 'SUCCESS') {
      if (canViewBossTaskJobs(task)) {
        flashSuccess(`任务 #${taskId} 完成，共 ${task.totalJobs} 条职位`)
        jobsTaskId.value = taskId
        jobsConfigId.value = task.configId
        await loadJobs()
      } else {
        flashSuccess(`任务 #${taskId} 已完成，未抓取到职位数据`)
      }
    } else if (task.status === 'CANCELLED') {
      if (canViewBossTaskJobs(task)) {
        flashSuccess(`任务 #${taskId} 已停止，已保存 ${task.totalJobs} 条职位`)
      } else {
        flashSuccess(`任务 #${taskId} 已停止`)
      }
    } else if (task.status === 'FAILED') {
      setError(task.errorMessage ?? '抓取失败')
    }
  }

  function onStopTask(task: BossCrawlTask) {
    confirm.require({
      message: `确定停止任务 #${task.id}？`,
      header: '确认停止',
      icon: 'pi pi-stop-circle',
      rejectLabel: '取消',
      acceptLabel: '停止',
      accept: () => {
        void stopTaskConfirmed(task)
      },
    })
  }

  async function stopTaskConfirmed(task: BossCrawlTask) {
    const token = ensureToken()
    if (!token) return
    loading.value = true
    error.value = ''
    try {
      const res = await stopBossCrawlTask(token, task.id)
      flashSuccess(res.message)
      await loadTasks()
      startPolling(task.id)
    } catch (e) {
      setError(e instanceof Error ? e.message : '停止失败')
    } finally {
      loading.value = false
    }
  }

  function onDeleteTask(task: BossCrawlTask) {
    confirm.require({
      message: `确定删除任务 #${task.id}？关联的 ${task.totalJobs} 条职位数据将一并删除。`,
      header: '确认删除',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: '取消',
      acceptLabel: '删除',
      acceptClass: 'p-button-danger',
      accept: () => {
        void deleteTaskConfirmed(task)
      },
    })
  }

  async function deleteTaskConfirmed(task: BossCrawlTask) {
    const token = ensureToken()
    if (!token) return
    loading.value = true
    error.value = ''
    try {
      const res = await deleteBossCrawlTask(token, task.id)
      flashSuccess(res.message)
      if (pollingTaskId.value === task.id) {
        stopPolling()
        pollingTaskId.value = null
      }
      if (jobsTaskId.value === task.id) {
        jobsTaskId.value = ''
      }
      await loadTasks()
    } catch (e) {
      setError(e instanceof Error ? e.message : '删除失败')
    } finally {
      loading.value = false
    }
  }

  function startPolling(taskId: number) {
    stopPolling()
    pollingTaskId.value = taskId
    activeTab.value = 'tasks'
    void pollTask(taskId)
    pollTimer = setInterval(() => {
      void pollTask(taskId)
    }, 3000)
  }

  async function onRunCrawl(config: BossCrawlConfig) {
    const token = ensureToken()
    if (!token) return
    if (!config.hasSession) {
      setError('请先完成手动登录并保存会话后再抓取')
      if (selectedConfigId.value !== config.id) {
        openEdit(config)
      }
      return
    }
    loading.value = true
    error.value = ''
    try {
      const res = await runBossCrawl(token, config.id)
      flashSuccess(res.message)
      await loadTasks()
      startPolling(res.taskId)
    } catch (e) {
      setError(e instanceof Error ? e.message : '启动失败')
    } finally {
      loading.value = false
    }
  }

  function viewJobsByTask(task: BossCrawlTask) {
    jobsTaskId.value = task.id
    jobsConfigId.value = task.configId
    jobsPage.value = 1
    activeTab.value = 'jobs'
    void loadJobs()
  }

  watch(activeTab, (tab) => {
    if (tab === 'tasks') void loadTasks()
    if (tab === 'jobs') void loadJobs()
  })

  onMounted(() => {
    void refreshAll()
  })

  onUnmounted(() => {
    stopPolling()
    // 不在组件卸载时自动取消手动登录，避免路由切换/热更新误关浏览器
  })

  return {
    activeTab,
    loading,
    error,
    configs,
    tasks,
    jobs,
    jobsTotal,
    jobsPage,
    jobsPageSize,
    jobsConfigId,
    jobsTaskId,
    selectedConfigId,
    selectedConfig,
    sessionJson,
    smsCode,
    needSmsCode,
    manualLoginPending,
    activeTask,
    credentialForm,
    createForm,
    editForm,
    refreshAll,
    onCreateConfig,
    onSaveConfig,
    cancelEdit,
    openEdit,
    selectConfig,
    onConfigRowClick,
    onToggleEnabled,
    onRunCrawl,
    onDeleteConfig,
    onStartManualLogin,
    onConfirmManualLogin,
    onCheckManualLoginStatus,
    onCancelManualLogin,
    onSaveCredentials,
    onBossLogin,
    onSaveSession,
    onJobsPageChange,
    loadJobs,
    onStopTask,
    startPolling,
    onDeleteTask,
    viewJobsByTask,
    isTaskActive: isBossTaskActive,
    canViewTaskJobs: canViewBossTaskJobs,
  }
}

export function provideBossCrawl() {
  const ctx = useBossCrawlState()
  provide(bossCrawlContextKey, ctx)
  return ctx
}

export function useBossCrawl() {
  const ctx = inject(bossCrawlContextKey)
  if (!ctx) {
    throw new Error('useBossCrawl() must be used within BossCrawlView')
  }
  return ctx
}
