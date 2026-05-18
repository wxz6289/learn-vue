import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes.js';

const router = createRouter({
  routes,
  history: createWebHashHistory()
});

router.beforeEach(async(to, from) => {
  console.log("beforeEach:")
  console.log('to:', to);
  console.log('from:', from);

  // 检查路由参数
  if (to.params) {
    console.log('Route params:', to.params);
  }

  // next()
});

router.beforeResolve(async(to, from, next) => {
  console.log("beforeResolve:", to, from);
  next()
});

router.afterEach(async(to, from, failure) => {
  console.log("beforeAfter: ", to, from, failure)
});

router.onError((error) => {
  console.error("Router onError: ", error);
  console.error("Error stack:", error.stack);

  // 如果错误信息包含 'start'，添加特殊处理
  if (error.message && error.message.includes('start')) {
    console.error("Detected 'start' property access error:", error.message);
  }

  // 重定向到错误页面，防止无限循环
  if (router.currentRoute.value.path !== '/error') {
    router.push('/error').catch(e => {
      console.error('Failed to navigate to error page:', e);
    });
  }
});


export default router;