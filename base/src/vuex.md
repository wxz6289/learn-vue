# Vuex

Vuex Store与全局对象的区别

- Vuex 的状态存储是响应式
- 不能直接改变 store 中的状态 改变 store 中的状态的唯一途径就是显式地提交 (commit)  mutation。明确地追踪到状态的变化。

createStore()

store.state
store.commit()
store.dispatch()
store.subscribe((mutation, state) => {})

核心概念

- State 单一状态树
  - 组件中获取状态的方式
    - store.state
    - this.$store.state
    - mapState()
- Getter
  - store.getters
  - this.$store.getters
  - mapGetters()

- Mutation
  - mutation(state, payload)
  - store.commit(mutionName, payload)
  - Mutation 必须是同步函数
  - mapMutations()
- Action
  - Action 提交的是 mutation，而不是直接变更状态。
  - Action 可以包含任意异步操作。
  - action(context)
  - store.dispatch(action)
  - mapAction(action)
  
- Module
  - modules
  - 支持嵌套
  - namespaced 启用了命名空间的 getter 和 action 会收到局部化的 getter，dispatch 和 commit。
  - createNamespacedHelpers()
  - store.registerModule()/store.unregisterModule(moduleName)
  - 嵌套模块应该以数组形式传递

组合式API

- useStore()

Vuex 插件就是一个函数，它接收 store 作为唯一参数。

Vuex 将store 安装到 Vue 应用中使用了 Vue 的 Provide/Inject 特性。
