# Vue Router

## 功能

+ 嵌套路由
+ 动态路由
+ 模块化、基于组件的路由配置
+ 路由参数、查询、通配符
+ 导航控制
+ 自动激活 CSS 类的链接
+ 支持history和hash模式
+ 可定制滚动行为
+ URL编码

## 安装

```bash
pnpm install vue-router@4
```

组件映射到路由上

## 组件

router-link
可以在不重新加载页面的情况下更改 URL，处理 URL 的生成以及编码。

router-view
显示与 url 对应的组件

createRouter({
  history,
  rootes
})

this.$router 路由API useRouter() this.$router 与直接使用通过 createRouter 创建的 router 实例完全相同

this.$route 当前路由 useRoute()

+ $route.params
+ $route.query
+ $route.hash

动态路由
路径参数 用冒号 : 表示。当一个路由被匹配时，它的 params 的值将在每个组件中以 this.$route.params 的形式暴露出来。

响应路由参数的变化

+ watch $route 对象上的任意属性
+ 使用 beforeRouteUpdate 导航守卫可以取消导航

捕获路由
使用自定义的 路径参数 正则表达式，在 路径参数 后面的括号中加入 正则表达式。

路由匹配语法

+ 在参数中自定义正则 在括号中为参数指定一个自定义的正则字符串
+ 可重复的参数 在参数后使用`*`（0 个或多个）和 `+`（1 个或多个）将参数标记为可重复
+ strict 和 sensitive
+ 可选参数 `?`(不能重复) `*`

嵌套路由
路径分层，组件也对应嵌套分层
children
以 / 开头的嵌套路径将被视为根路径。这允许你利用组件嵌套，而不必使用嵌套的 URL

编程式导航
router.push(path) 对于不同的Url添加一个新的记录
router.push({path, query?, hash? replace?})
router.push({name, params?, query?, hash?})

+ 当指定 params 时，可提供 string 或 number 参数（或者对于可重复的参数可提供一个数组）
+ 任何其他类型（如 undefined、false 等）都将被自动字符串化
+ 对于可选参数，可以提供一个空字符串（""）来跳过它。

由于属性 to 与 router.push 接受的对象种类相同，所以两者的规则完全相同。
router.push 和所有其他导航方法都会返回一个 Promise

router.replace() 不会向 history 添加新记录而是取代了当前的条目。

router.go(n)
router.forward()
router.back()

命名路由
优势：

+ 无需硬编码url,防止url输错
+ params 的自动编码/解码
+ 绕过路径排序

命名视图
同级展示多个视图
一个视图使用一个组件渲染，因此对于同个路由，多个视图就需要多个组件。确保正确使用 `components`配置。

嵌套命名视图

重定向和别名
redirect: path
redirect: { name}
redirect: function

alias: name
通过别名，你可以自由地将 UI 结构映射到一个任意的 URL，而不受配置的嵌套结构的限制。

路由组件传参
当 props 设置为 true 时，route.params 将被设置为组件的 props。

对于有命名视图的路由，你必须为每个命名视图定义 props 配置。

函数模式 创建一个返回 props 的函数，可以将参数转换为其他类型。

路由模式

+ hash
  + createWebHashHistory()
  + 无须服务器层面上进行任何特殊处理
  + 对SEO不利
+ html5 history模式
  + createWebHistory()
  + 需要在服务器上添加一个简单的回退路由

## 路由守卫

守卫是异步解析执行

通过跳转或取消的方式守卫导航

+ 全局
  + beforeEach()
    + (to, from, next?) => boolen|obj 返回false取消导航,如果url发生变化，则重置为from路由对应的地址
  + router.beforeResolve()
    + 每次导航时都会触发
    + 解析守卫刚好会在导航被确认之前、所有组件内守卫和异步路由组件被解析之后调用。
    + 获取数据或执行任何其他操作的理想位置
    + 返回false或抛错时取消导航
  + afterEach()
    + 不接受 next 函数也不会改变导航本身
    + 分析、更改页面标题、声明页面等辅助功能
+ 路由独享
  beforeEnter()
  在路由配置上定义
  只在进入路由时触发,不会在 params、query 或 hash 改变时触发
+ 组件
  + beforeRouteEnter
    + 在渲染该组件的对应路由被验证前调用
    + 不能获取组件实例 `this`,组件实例还没被创建！
    + 可以通过传一个回调给 next 来访问组件实例
  + beforeRouteUpdate
    + 在当前路由改变，但是该组件被复用时调用
  + beforeRouteLeave
    + 在导航离开渲染该组件的对应路由时调用
    + 通常用来预防用户在还未保存修改前突然离开
  在组合式API或setup函数中可以通过onBeforeRouteUpdate 和 onBeforeRouteLeave 分别添加 update 和 leave 守卫。

导航解析流程

1. 导航被触发。
2. 在失活的组件里调用 beforeRouteLeave 守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫(2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。

组合式API

+ useRoute()
+ useRouter()
+ useLink()
+ onBeforeRouteUpdate()
+ onBeforeRouteLeave()

滚动行为
scrollBehavior(to, fron, savedPoisition)

router-link与a标签的不同

+ 路由模式切换无限修改
+ history模式下守卫点击事件，不重载页面
+ history模式下使用`base`选项后，所有`to`属性都不需要写基础路径
