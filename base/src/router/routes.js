function removeHash(to) {
  if (to.hash) return { ...to, hash: '' };
}

export default [
  {
    path: '/', component: () => import('@/pages/home/index.vue')
  },
  {
    path: '/vue-use', component: () => import('@/pages/vue-use/state.vue')
  },
  {
    path: '/home', component: () => import('@/pages/home/home.vue'),
    beforeEnter: [removeHash]
  },
  {
    path: '/ref', component: () => import('@/pages/vue/ref.vue'),
  },
  {
    path: '/pinia', component: () => import('@/pages/pinia/pinia.vue'),
  },
  {
    path: '/setup/:title', props: true, component: () => import('@/pages/home/setup.vue'),
  },
  {
    path: '/option/:name', props: true, component: () => import('@/pages/home/option.vue'),
  },
  {
    path: '/attribute-transparent', component: () => import("@/pages/component/AttributeTransparent.vue")
  },
  {
    path: '/data',
    component: () => import("@/pages/data/TestData.vue")
  },
  {
    path: '/reactive',
    component: () => import('@/pages/data/TestReactive.vue')
  },
  {
    path: '/connect-line',
    component: () => import('@/pages/line-graph/ConnectLine.vue')
  },
  {
    path: '/ripple',
    component: () => import('@/pages/animation/Ripple.vue')
  },
  {
    path: '/glow',
    component: () => import('@/pages/animation/Glow.vue')
  },
  {
    path: '/glow-output',
    component: () => import('@/pages/animation/GlowOutput.vue')
  },
  {
    path: '/type-text',
    component: () => import('@/pages/animation/TypeText.vue')
  },
  {
    path: '/chat',
    component: () => import('@/pages/animation/TestChatMarkdown.vue')
  },
  {
    path: '/error',
    component: () => import('@/pages/ErrorPage.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/ErrorPage.vue')
  }
]