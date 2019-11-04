# Vue

_지원되는 확장자: `vue`_

Vue.js는 웹 UI를 구축하기 위한 진보적이고, 점진적으로 적용 가능한 Javascript 프레임워크입니다. Parcel은 부가적인 설정 없이 Vue를 직접 지원합니다.

```html
<!-- index.html -->

<!DOCTYPE html>

<html lang="en">
  <head>
    <title>Parcel - Vue</title>
  </head>
  
  <body>
    <div id="app"></div>
    <script src="./index.js"></script>
  </body>
</html>
```

모든 선호하는 툴들(Pug, TypeScript, SCSS 등등..)을 사용 가능합니다.

```vue
// App.vue

<template lang="pug">
  .container Hello {{bundler}}
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      bundler: "Parcel"
    };
  }
});
</script>

<style lang="scss" scoped>
.container {
  color: green;
}
</style>
```

```js
// index.js

import Vue from 'vue';
import App from './App.vue';

new Vue({ render: createElement => createElement(App) }).$mount('#app');
```

