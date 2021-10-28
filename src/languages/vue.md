---
layout: layout.njk
title: Vue
eleventyNavigation:
  key: languages-vue
  title: <img src="/assets/lang-icons/vue.svg" alt=""/> Vue
  order: 9
---

[Vue.js](https://v3.vuejs.org) is a progressive, incrementally-adoptable JavaScript framework for building UI on the web. Parcel supports Vue automatically using the `@parcel/transformer-vue` plugin. When a `.vue` file is detected, it will be installed into your project automatically.

{% note %}

**Note**: Parcel does not support using SFCs with Vue 2, you must use [Vue 3 beta](https://github.com/vuejs/vue-next) or later.

{% endnote %}

## Example usage

{% sample %}
{% samplefile "index.html" %}

```html
<!DOCTYPE html>
<div id="app"></div>
<script type="module" src="./index.js"></script>
```

{% endsamplefile %}
{% samplefile "index.js" %}

```jsx
import { createApp } from "vue";
import App from "./App";

const app = createApp(App);
app.mount("#app");
```

{% endsamplefile %}
{% samplefile "App.vue" %}

```html
<template>
  <div>Hello {% raw %}{{ name }}{% endraw %}!</div>
</template>

<script>
  export default {
    data() {
      return {
        name: "Vue",
      };
    },
  };
</script>
```

{% endsamplefile %}
{% endsample %}

## HMR

Parcel uses the official Vue SFC compiler, which supports HMR out of the box so you'll have a fast, reactive development experience. See [Hot reloading](/features/development/#hot-reloading) for more details about HMR in Parcel.

## Vue 3 Features

Since Parcel uses the latest Vue 3 beta, you can use all Vue 3 features, such as the [Composition API](https://composition-api.vuejs.org/).

{% sample %}
{% samplefile "App.vue" %}

```html
<template>
  <button @click="increment">
    Count is: {% raw %}{{ state.count }}{% endraw %} Double is: {% raw %}{{
    state.double }}{% endraw %}
  </button>
</template>

<script>
  import { reactive, computed } from "vue";

  export default {
    setup() {
      const state = reactive({
        count: 0,
        double: computed(() => state.count * 2),
      });

      function increment() {
        state.count++;
      }

      return {
        state,
        increment,
      };
    },
  };
</script>
```

{% endsamplefile %}
{% endsample %}

## Language Support

Parcel supports [JavaScript](/languages/javascript/), [TypeScript](/languages/typescript/), and [CoffeeScript](/languages/coffeescript/) as scripting languages in Vue.

Almost any templating language (all those supported by [consolidate](https://www.npmjs.com/package/consolidate)) can be used.

For styling, [Less](/languages/less), [Sass](/languages/sass), and [Stylus](/languages/stylus) are supported. In addition, [CSS Modules](/languages/css/#css-modules) and [scoped style](https://vue-loader.vuejs.org/guide/scoped-css.html) can be used with the `module` and `scoped` modifiers.

{% sample %}
{% samplefile "App.vue" %}

```html
<style lang="scss" scoped>
  /* This style will only apply to this module */
  $red: red;
  h1 {
    background: $red;
  }
</style>

<style lang="less">
  @green: green;
  h1 {
    color: @green;
  }
</style>

<style src="./App.module.css">
  /* The content of blocks with a `src` attribute is ignored and replaced with
   the content of `src`. */
</style>

<template lang="pug"> div h1 This is the app </template>

<script lang="coffee">
  module.exports =
    data: ->
      msg: 'Hello from coffee!'
</script>
```

{% endsamplefile %}
{% endsample %}

## Custom Blocks

You can use custom blocks in your Vue components, but must configure Vue with `.vuerc`, `vue.config.js`, etc. to define how you will preprocess those blocks.

{% sample %}
{% samplefile ".vuerc" %}

```json
{
  "customBlocks": {
    "docs": "./src/docs-preprocessor.js"
  }
}
```

{% endsamplefile %}
{% samplefile "src/docs-preprocessor.js" %}

```js
export default function (component, blockContent, blockAttrs) {
  if (blockAttrs.brief) {
    component.__briefDocs = blockContent;
  } else {
    component.__docs = blockContent;
  }
}
```

{% endsamplefile %}
{% samplefile "HomePage.vue" %}

```html
<template>
  <div>Home Page</div>
</template>

<docs> This component represents the home page of the application. </docs>

<docs brief> Home Page </docs>
```

{% endsamplefile %}
{% samplefile "App.vue" %}

```html
<template>
  <div>
    <child></child>
    docs: {% raw %}{{ docs.standard }}{% endraw %} in brief: {% raw %}{{
    docs.brief }}{% endraw %}
  </div>
</template>

<script>
  import Child from "./HomePage";
  export default {
    components: {
      child: Child,
    },
    data() {
      let docs = { standard: Child.__docs, brief: Child.__docsBrief };
      return { docs };
    },
  };
</script>
```

{% endsamplefile %}
{% endsample %}
