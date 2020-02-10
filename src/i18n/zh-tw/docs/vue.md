# Vue

_支援的副檔名：`vue`_

Vue.js 是款漸進式的 JavaScript 網頁 UI 框架。Parcel 預設就支援 Vue，完全不需額外設定。

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

你也可以使用如 pug、typescript 及 scss…那些你最愛的工具：

```html
<!-- App.vue -->

<template lang="pug">
  .container Hello {{bundler}}
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      bundler: "Parcel"
    };
  }
});
</script>

<style lang="scss" scoped>
.container {
  color: green;
}
</style>
```

```js
// index.js

import Vue from 'vue';
import App from './App.vue';

new Vue({ render: createElement => createElement(App) }).$mount('#app');
```
