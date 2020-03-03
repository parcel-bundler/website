# Vue

_Extensions supportées : `vue`_

Vue.js est un framework JavaScript évolutif avec une adaptation progressive pour construire des interfaces utilisateur sur le web. Parcel prend en charge Vue dès sa mise en place sans nécessiter de configuration supplémentaire.

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

Vous pouvez utiliser tous les outils que vous aimez (Pug, TypeScript, SCSS, ...) :

```vue
// App.vue

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
import App from './App.vue'

new Vue({ render: createElement => createElement(App) }).$mount('#app');
```
