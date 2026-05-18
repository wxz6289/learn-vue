# Pinia 学习笔记

## 简介

Pinia 是 Vue 3 的官方状态管理库，具有以下特点：

- 组合式 API - 完美支持组合式 API
- 类型推断 - 对 TypeScript 提供强大的类型支持
- 轻量级 - 体积小，性能好
- 模块化 - 支持代码分割和模块化

## Pinia vs Vuex

相比 Vuex 4.x，Pinia 的主要优势：

| 特性 | Pinia | Vuex |
|------|-------|------|
| Mutations | 已弃用，直接在 actions 中修改 state | 需要通过 mutations 修改 state |
| TypeScript 支持 | 原生支持，类型推断强大 | 需要额外配置 |
| 魔法字符串 | 无需使用字符串常量 | 大量使用字符串 |
| 模块嵌套 | 扁平化设计 | 复杂的嵌套结构 |
| 命名空间 | 每个 store 都是独立的 | 需要配置 namespaced |
| 代码分割 | 自动支持 | 需要手动配置 |

## 核心概念

### Store

Store 是保存状态和业务逻辑的实体，它并不与组件树绑定。每个 Store 包含三个核心概念：

- State - 数据状态
- Getters - 计算属性
- Actions - 业务逻辑方法

> 使用原则：只有当确实需要在应用中共享数据或逻辑时才使用全局状态管理，避免将本地化的数据放入 Store 中。

### 创建 Store

```javascript
import { defineStore } from 'pinia'

// 方式一：Options API 风格
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Counter'
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++
    }
  }
})

// 方式二：Composition API 风格 (推荐)
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const name = ref('Counter')

  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, name, doubleCount, increment }
})
```

注意事项：

- id 应该在应用中唯一
- 返回的函数应以 use 开头，Store 结尾
- Setup Store 比 Options Store 更灵活，但会让 SSR 变得复杂

## State 状态管理

### 使用 State

```javascript
// 访问 state
const store = useCounterStore()
console.log(store.count)

// 直接修改 (在 actions 中)
store.count++

// 响应式解构 (需要使用 storeToRefs)
import { storeToRefs } from 'pinia'
const { count, name } = storeToRefs(store)
// actions 可以直接解构
const { increment } = store
```

### State 操作方法

| 方法 | 用途 | 示例 |
|------|------|------|
| $reset() | 重置状态到初始值 | store.$reset() |
| $patch() | 批量更新状态 | store.$patch({ count: 10, name: 'New' }) |
| $patch(fn) | 函数式更新 | store.$patch((state) => state.count++) |
| $subscribe() | 订阅状态变化 | store.$subscribe((mutation, state) => {}) |

### 状态订阅

```javascript
// 订阅状态变化
store.$subscribe((mutation, state) => {
  // 每次状态变化时触发
  console.log(mutation.type) // 'direct' | 'patch object' | 'patch function'
  console.log(state)
}, {
  detached: true // 组件卸载后依然保留订阅
})
```

## Getters 计算属性

### 定义 Getters

```javascript
// Options API 风格
export const useStore = defineStore('main', {
  state: () => ({
    items: [1, 2, 3, 4, 5]
  }),
  getters: {
    // 简单 getter
    itemCount: (state) => state.items.length,

    // 访问其他 getters
    itemCountText() {
      return `总共 ${this.itemCount} 个项目`
    },

    // 带参数的 getter (不会被缓存)
    getItemById: (state) => {
      return (id) => state.items.find(item => item.id === id)
    }
  }
})

// Composition API 风格
export const useStore = defineStore('main', () => {
  const items = ref([1, 2, 3, 4, 5])

  const itemCount = computed(() => items.value.length)
  const itemCountText = computed(() => `总共 ${itemCount.value} 个项目`)

  // 带参数的 getter
  const getItemById = computed(() => {
    return (id) => items.value.find(item => item.id === id)
  })

  return { items, itemCount, itemCountText, getItemById }
})
```

### 在 Options API 中使用 Getters

```javascript
import { mapState } from 'pinia'

export default {
  computed: {
    ...mapState(useStore, ['itemCount', 'itemCountText'])
  }
}
```

## Actions 业务逻辑

### 定义 Actions

```javascript
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false
  }),
  actions: {
    // 同步 action
    setUser(user) {
      this.user = user
    },

    // 异步 action
    async fetchUser(id) {
      this.loading = true
      try {
        const response = await api.getUser(id)
        this.user = response.data
      } catch (error) {
        console.error('获取用户失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 调用其他 store 的 actions
    async logout() {
      this.user = null
      // 可以调用其他 store
      const cartStore = useCartStore()
      cartStore.clearCart()
    }
  }
})
```

### Action 订阅

```javascript
store.$onAction(({
  name, // action 名称
  store, // store 实例
  args, // 传给 action 的参数数组
  after, // 在 action 返回或解析后的钩子
  onError, // action 抛出错误或拒绝时的钩子
}) => {
  console.log(`开始执行 "${name}" action`)

  after((result) => {
    console.log(`"${name}" action 执行完成，结果:`, result)
  })

  onError((error) => {
    console.error(`"${name}" action 执行失败:`, error)
  })
}, true) // 第二个参数为 true 表示组件卸载后依然保留
```

### 在 Options API 中使用 Actions

```javascript
import { mapActions } from 'pinia'

export default {
  methods: {
    ...mapActions(useUserStore, ['fetchUser', 'logout'])
  }
}
```

## 工具函数

### storeToRefs

```javascript
import { storeToRefs } from 'pinia'

const store = useCounterStore()

// 错误：会失去响应性
const { count, doubleCount } = store

// 正确：保持响应性
const { count, doubleCount } = storeToRefs(store)

// Actions 可以直接解构
const { increment } = store
```

### Options API 映射辅助函数

```javascript
import {
  mapState,
  mapWritableState,
  mapActions,
  mapStores
} from 'pinia'

export default {
  computed: {
    // 只读状态映射
    ...mapState(useCounterStore, ['count', 'doubleCount']),

    // 可写状态映射
    ...mapWritableState(useCounterStore, ['count']),

    // 映射整个 store
    ...mapStores(useCounterStore, useUserStore)
  },
  methods: {
    ...mapActions(useCounterStore, ['increment'])
  }
}
```

## 插件系统

### 创建插件

```javascript
// 持久化插件示例
function persistPlugin(context) {
  const { store, app } = context

  // 从 localStorage 恢复状态
  const storageKey = `pinia-${store.$id}`
  const savedState = localStorage.getItem(storageKey)
  if (savedState) {
    store.$patch(JSON.parse(savedState))
  }

  // 监听状态变化并保存
  store.$subscribe((mutation, state) => {
    localStorage.setItem(storageKey, JSON.stringify(state))
  })

  // 返回要添加到 store 的属性
  return {
    clearStorage() {
      localStorage.removeItem(storageKey)
    }
  }
}

// 注册插件
pinia.use(persistPlugin)
```

### 插件功能

插件可以：

- 为 store 添加新的属性
- 定义 store 时增加新的选项
- 为 store 增加新的方法
- 包装现有的方法
- 改变甚至取消 action
- 实现副作用，如本地存储
- 仅应用插件于特定 store

## 高级用法

### 热模块替换 (HMR)

```javascript
// store.js
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot))
}
```

### 在组件外使用

```javascript
import { getActivePinia, setActivePinia } from 'pinia'

// 在 main.js 中创建的 pinia 实例
const pinia = createPinia()

// 在组件外使用时需要手动设置活跃的 pinia 实例
setActivePinia(pinia)
const store = useCounterStore()
```

### 测试

```javascript
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from './counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should increment', () => {
    const counter = useCounterStore()
    expect(counter.count).toBe(0)
    counter.increment()
    expect(counter.count).toBe(1)
  })
})
```

## 最佳实践

### 1. Store 设计原则

- 每个 Store 应该有明确的职责边界
- 避免创建过大的 Store，按功能模块分离
- 优先使用 Composition API 风格的 Setup Store

### 2. 状态设计

- State 保持扁平化，避免深层嵌套
- 使用 storeToRefs 进行响应式解构
- 在 Actions 中进行复杂的业务逻辑处理

### 3. 性能优化

- 合理使用 Getters 进行数据计算
- 避免在 Getters 中进行重复计算
- 使用 $patch 进行批量状态更新

### 4. 类型安全

```typescript
// 定义 Store 类型
interface CounterState {
  count: number
  name: string
}

export const useCounterStore = defineStore('counter', (): CounterState => {
  const count = ref(0)
  const name = ref('Counter')

  return { count, name }
})
```

## 总结

Pinia 是 Vue 3 生态中的优秀状态管理解决方案，它提供了：

- 简洁的 API - 学习成本低，易于上手
- 强大的 TypeScript 支持 - 类型安全，开发体验好
- 优秀的性能 - 轻量级，响应式设计
- 丰富的插件生态 - 可扩展性强
- 易于测试 - 简单的测试接口

选择 Pinia 可以让您的 Vue 3 应用具备更好的状态管理能力和开发体验。
