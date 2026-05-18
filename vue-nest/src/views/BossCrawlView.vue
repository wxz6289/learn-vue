<script setup lang="ts">
import Tab from 'primevue/tab'
import TabList from 'primevue/tablist'
import TabPanel from 'primevue/tabpanel'
import TabPanels from 'primevue/tabpanels'
import Tabs from 'primevue/tabs'
import BossCrawlAlerts from '@/components/boss-crawl/BossCrawlAlerts.vue'
import BossCrawlLoadingOverlay from '@/components/boss-crawl/BossCrawlLoadingOverlay.vue'
import BossCrawlPageHeader from '@/components/boss-crawl/BossCrawlPageHeader.vue'
import BossConfigsTab from '@/components/boss-crawl/BossConfigsTab.vue'
import BossJobListCard from '@/components/boss-crawl/BossJobListCard.vue'
import BossTaskListCard from '@/components/boss-crawl/BossTaskListCard.vue'
import { provideBossCrawl } from '@/composables/useBossCrawl'

const { activeTab, loading } = provideBossCrawl()
</script>

<template>
  <div class="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
    <BossCrawlLoadingOverlay :loading="loading" />
    <BossCrawlPageHeader />
    <BossCrawlAlerts />

    <Tabs v-model:value="activeTab">
      <TabList class="mb-6 flex-wrap gap-1">
        <Tab value="configs">抓取配置</Tab>
        <Tab value="tasks">任务记录</Tab>
        <Tab value="jobs">职位数据</Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="configs">
          <BossConfigsTab />
        </TabPanel>
        <TabPanel value="tasks">
          <BossTaskListCard />
        </TabPanel>
        <TabPanel value="jobs">
          <BossJobListCard />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
