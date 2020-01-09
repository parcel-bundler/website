# Vue

_支持扩展类型: `vue`_

Vue.js 是一个渐进式、增量采用、在 web 环境构建用户界面的 JavaScript 框架。Parcel 对 Vue 支持是开箱即用的。

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Parcel - Vue</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="./index.js"></script>
  </body>
</html>
```

使用你喜爱的工具(例如：Pug, TypeScript, SCSS, ...):

```vue
// app.vue
<template lang="pug">
  .container Hello {{bundler}}
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      bundler: 'Parcel'
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  color: green;
}
</style>
```

```js
// index.js
import Vue from 'vue'
import App from './app.vue'

new Vue({
  el: '#app',
  render: h => h(App)
})
```
