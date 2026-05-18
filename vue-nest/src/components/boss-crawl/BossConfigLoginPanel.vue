<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionContent from 'primevue/accordioncontent'
import AccordionHeader from 'primevue/accordionheader'
import AccordionPanel from 'primevue/accordionpanel'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Divider from 'primevue/divider'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'
import type { BossCrawlConfig } from '@/types/boss-crawl'
import { useBossCrawl } from '@/composables/useBossCrawl'
import { formatBossTime } from '@/utils/boss-crawl-display'

defineProps<{
  config: BossCrawlConfig
}>()

const {
  loading,
  manualLoginPending,
  credentialForm,
  smsCode,
  needSmsCode,
  sessionJson,
  onStartManualLogin,
  onConfirmManualLogin,
  onCheckManualLoginStatus,
  onCancelManualLogin,
  onSaveCredentials,
  onBossLogin,
  onSaveSession,
} = useBossCrawl()
</script>

<template>
  <Divider />

  <div class="grid gap-4">
    <div>
      <h3 class="text-base font-semibold text-slate-900">BOSS 登录（手动介入）</h3>
      <p class="mt-2 text-sm text-slate-600">
        <Tag
          v-if="config.hasSession"
          rounded
          severity="success"
          icon="pi pi-verified"
          :value="`已保存登录态 · ${formatBossTime(config.sessionLoggedAt)}`"
        />
        <Tag
          v-else
          rounded
          severity="warn"
          icon="pi pi-exclamation-triangle"
          value="尚未保存登录态，抓取前请完成下方步骤"
        />
      </p>
    </div>

    <Message v-if="manualLoginPending" severity="info" class="text-sm">
      <ol class="list-decimal space-y-1 pl-5 text-slate-800">
        <li>系统已在本地启动浏览器窗口。</li>
        <li>在窗口中完成 BOSS 直聘登录（验证码、扫码等）。</li>
        <li>确认可以浏览职位列表后，点击「确认已登录」保存会话。</li>
      </ol>
    </Message>

    <div class="flex flex-wrap gap-2">
      <Button
        type="button"
        label="打开浏览器登录"
        icon="pi pi-external-link"
        :loading="loading"
        :disabled="manualLoginPending"
        @click="onStartManualLogin()"
      />
      <Button
        v-if="manualLoginPending"
        type="button"
        label="确认已登录"
        icon="pi pi-check"
        severity="success"
        :loading="loading"
        @click="onConfirmManualLogin()"
      />
      <Button
        v-if="manualLoginPending"
        type="button"
        label="检测登录状态"
        icon="pi pi-search"
        severity="secondary"
        outlined
        :loading="loading"
        @click="onCheckManualLoginStatus()"
      />
      <Button
        v-if="manualLoginPending"
        type="button"
        label="取消"
        icon="pi pi-times"
        severity="danger"
        text
        :loading="loading"
        @click="onCancelManualLogin()"
      />
    </div>
  </div>

  <Accordion lazy class="rounded-lg ring-1 ring-slate-200">
    <AccordionPanel value="advanced">
      <AccordionHeader class="flex items-center gap-2 text-base font-semibold text-slate-900">
        <i class="pi pi-sliders-h text-primary" aria-hidden="true" />
        <span>高级：自动账号登录 · 粘贴 storageState</span>
      </AccordionHeader>
      <AccordionContent>
        <div class="grid gap-4 border-t border-slate-100 pt-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <label for="cred-phone" class="text-xs font-semibold uppercase tracking-wide text-slate-500">手机号码</label>
              <InputText id="cred-phone" v-model="credentialForm.bossPhone" class="w-full" type="tel" />
            </div>
            <div class="flex flex-col gap-2">
              <label for="cred-pwd" class="text-xs font-semibold uppercase tracking-wide text-slate-500">登录密码</label>
              <InputText
                id="cred-pwd"
                v-model="credentialForm.bossPassword"
                class="w-full"
                type="password"
                autocomplete="new-password"
              />
            </div>
          </div>
          <div v-if="needSmsCode" class="flex flex-col gap-2">
            <label for="sms-code" class="text-xs font-semibold uppercase tracking-wide text-slate-500">短信验证码</label>
            <InputText id="sms-code" v-model="smsCode" class="w-full" maxlength="12" placeholder="六位验证码" />
          </div>
          <label class="flex items-center gap-3 text-sm text-slate-700">
            <Checkbox v-model="credentialForm.autoLogin" binary input-id="auto-login" />
            <span>抓取前自动触发密码登录（不推荐，易受风控）</span>
          </label>
          <div class="flex flex-wrap gap-2">
            <Button
              type="button"
              size="small"
              outlined
              label="保存账号"
              icon="pi pi-save"
              :loading="loading"
              @click="onSaveCredentials()"
            />
            <Button
              type="button"
              size="small"
              severity="warn"
              label="自动登录"
              icon="pi pi-sign-in"
              :loading="loading"
              @click="onBossLogin()"
            />
          </div>
          <Divider />
          <div class="flex flex-col gap-2">
            <label for="storage-json" class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Playwright storageState JSON
            </label>
            <Textarea
              id="storage-json"
              v-model="sessionJson"
              class="w-full font-mono text-sm"
              rows="8"
              placeholder="在此处粘贴导出或调试得到的 storageState JSON"
            />
          </div>
          <Button
            type="button"
            outlined
            icon="pi pi-upload"
            label="保存 JSON 登录态"
            :loading="loading"
            class="max-w-fit"
            @click="onSaveSession()"
          />
        </div>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>
