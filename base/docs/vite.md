# Vite

```bash
yarn create vite project --template vue
```

```css
drop-shadow(offset-x offset-y blur-radius spread-radius color)
```

- blur-radius 模糊半径，默认值为 0,不允许负值。
- spread-radius 扩展半径 默认值为 0,阴影的大小,目前大多数浏览器不支持。
- color 可选,默认使用 color 属性值。

```js
will-change: auto | <animateable-feature>#
```

```js
<anitmateable-feature> =
  scroll-position | contents | <custom-ident>
```

提前告知浏览器元素可能的属性值变化，让浏览器在元素属性真正变化前做好对应的优化工作，从而提升反应速度。

注意事项：

- 不要将 will-change 应用到大多数元素上
- 有节制地使用
- 不要过早应用 will-change 优化
- 给予 will-change 足够的时间
