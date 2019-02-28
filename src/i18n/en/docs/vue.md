# Vue

_Supported extensions: `vue`_

Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web. Parcel supports Vue right out of the box without the need for any additional configuration.

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

NOTE: that you can use all tools you like ( pug, typescript, scss ... ), parcel will handle all!
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

Vue.component('app', App);

new Vue({
  el: '#app',
  template: `<app></app>`,
});

```

Then simply build the project:
```
parcel build index.html
```
Or serve it ( http://127.0.0.1:1234 ):
```
parcel index.html
```

Parcel will automagically add all javascripts and stylesheets!
