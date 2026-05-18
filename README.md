# Vue 学习与实践

本仓库包含两个独立子项目：

| 目录 | 说明 |
|------|------|
| `base/` | Vue 3 学习与实验（路由、Pinia、动画、样式等示例） |
| `vue-nest/` | 对接 Nest 后端的前端（登录注册、图片、Boss 直聘抓取） |

## 开发

```bash
# 学习项目
cd base && pnpm install && pnpm dev

# Nest 联调前端（后端默认 http://localhost:3001）
cd vue-nest && pnpm install && pnpm dev
```

`vue-nest` 开发时通过 Vite 代理将 `/auth`、`/images`、`/boss-crawl/*` 转发到 Nest；生产环境可配置 `VITE_API_BASE_URL`。
