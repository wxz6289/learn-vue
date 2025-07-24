## Pinia

组合式,类型推断

pinia与vuex的区别：

- mutation 已被弃用
- 对TypeScript支持更好
- 无过多的魔法字符串注入
- 不再有嵌套结构的模块
- 不再有可命名的模块

## Store

Store`保存状态和业务逻辑`的实体，它并不与组件树绑定。主要有三个概念: state、getter 和 action。

当确实需要在应用中共享数据或逻辑时使用全局状态管理才有必要，避免将本地化的数据放入到Store中。

定义Store
defineStore(id, options)

store 是一个用 reactive 包装的对象

Pinia 插件是一个函数，可以选择性地返回要添加到 store 的属性。它接收一个可选参数，即 context。插件只会应用于在 pinia 传递给应用后创建的 store，否则它们不会生效。

store.$state
store.$patch()
store.$subscribe()

`storeToRefs(store)`

- createPinia()
- defineStore(id, options)
  - id应该在应用中唯一
  - options 可接受两类值：Setup 函数或 Option 对象 一个带有 state、actions 与 getters 属性的 Option 对象
  - 返回函数应以use开头Store结尾
Setup store 比 Option Store 带来了更多的灵活性，因为你可以在一个 store 内创建侦听器，并自由地使用任何组合式函数。不过，请记住，使用组合式函数会让 SSR 变得更加复杂。
store 是一个用 reactive 包装的对象。因此不能直接使用解构，应使用computed()或storeToRefs()来保持响应性。当可以直接从 store 中解构 action。

state 返回初始状态的函数 向其添加新属性时，需要调用 Vue.set()

- 访问state 通过store实例直接读写
- 重置state store.$reset()
- 变更 state store.$patch() 用一个 state 的补丁对象在同一时间更改多个属性
- 替换 state 不能完全替换掉 store 的 state,但可以可以 patch 它。
- 订阅 state 可以通过 store 的 $subscribe() 方法侦听 state 及其变化。相比于watch,subscriptions 在 patch 后只触发一次。默认情况下，state subscription 会被绑定到添加它们的组件上，可以将 { detached: true } 作为第二个参数，以将 state subscription 从当前组件中分离，从而实现在组件卸载后依旧保留。

getters store 的 state 的计算值

- 向 getter 传递参数 可以从 getter 返回一个函数，该函数可以接受任意参数 这样的getter 将不再被缓存
- 在option API中可使用mapState() 函数来将其映射为 getters

Actions 定义业务逻辑 可以异步
不使用 setup()也可以使用 mapActions() 辅助函数将 action 属性映射为组件中的方法
订阅 action 可以通过 store.$onAction() 来监听 action 和它们的结果。传递给它的回调函数会在 action 本身之前执行。after 表示在 promise 解决之后，允许在 action 解决后执行一个回调函数。同样地，onError 允许你在 action 抛出错误或 reject 时执行一个回调函数。
默认情况下，action 订阅器会被绑定到添加它们的组件上(如果 store 在组件的 setup() 内)。当该组件被卸载时，它们将被自动删除。如果想在组件卸载后依旧保留它们，可以将 true 作为第二个参数传递给 action 订阅器，以便将其从当前组件中分离

getActivePinia()
setActivePinia(pinia)
mapActions(store, keyMapper)
mapGetters(store, keyMapper)
mapState(store, keyMapper) state 属性映射为只读的计算属性
mapWritableState(useStore, keyMapper) 可修改的 state 注意不能传递函数

mapStores(...stores)
setMapStoreSuffix(suffix)
skipHydrate()

插件 Pinia 插件是一个函数，可以选择性地返回要添加到 store 的属性。它接收一个可选参数，即 context。
插件可以扩展的内容：

- 为 store 添加新的属性
- 定义 store 时增加新的选项
- 为 store 增加新的方法
- 包装现有的方法
- 改变甚至取消 action
- 实现副作用，如本地存储
- 仅应用插件于特定 store

插件是通过 pinia.use() 添加到 pinia 实例。插件只会应用于在 pinia 传递给应用后创建的 store，否则它们不会生效。

每个 store 都被 reactive包装过，所以可以自动解包任何它所包含的 Ref(ref()、computed()...)。

在一个插件中， state 变更或添加(包括调用 store.$patch())都是发生在 store 被激活之前，因此不会触发任何订阅函数。
