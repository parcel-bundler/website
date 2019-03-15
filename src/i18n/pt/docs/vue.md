# Vue

_Extensões suportadas: `vue`_
Vue.js é um progressivo e incrementalmente adoptável framework Javascript para criar UI na Web. O Parcel tem suporte nativo ao Vue sem a necessidade de nenhuma configuração adicional.

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

Você pode usar todas as ferramentas como (Pug, TypeScript, SCSS, ...):

```vue
// app.vue
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
import App from './app.vue';

new Vue(App).$mount('#app')
```
