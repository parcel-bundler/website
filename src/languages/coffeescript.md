---
layout: layout.njk
title: CoffeeScript
eleventyNavigation:
  key: languages-coffee
  title: <img src="/assets/lang-icons/coffeescript.svg" class="dark-invert" alt=""/> CoffeeScript
  order: 5
---

[CoffeeScript](https://coffeescript.org) is a language that transpiles to JavaScript, which allows you to use a shorter syntax and other features like [the existential operator](https://coffeescript.org/#existential-operator), [shorter array-splicing syntax](https://coffeescript.org/#slices), [block regular expressions](https://coffeescript.org/#regexes) and more.

Parcel supports CoffeeScript automatically using the `@parcel/transformer-coffeescript` plugin. When a `.coffee` file is detected, it will be installed into your project automatically.

CoffeeScript is compiled to JavaScript and processed as described in the [JavaScript docs](/languages/javascript/).

## Example usage

{% sample %}
{% samplefile "index.html" %}

```html
<script type="module" src="app.coffee"></script>
```

{% endsamplefile %}
{% samplefile "app.coffee" %}

```coffeescript
console.log 'Hello world!'
```

{% endsamplefile %}
{% endsample %}

### URL dependencies

In JavaScript files, [URL dependencies](/languages/javascript/#url-dependencies) can be created using the `URL` constructor combined with `import.meta.url`. This can be used to reference URLs such as images, [workers](/languages/javascript/#workers), [service workers](/languages/javascript/#service-workers), and more.

CoffeeScript does not currently support `import.meta`. Instead, you can use the CommonJS `__filename` variable with the `file:` prefix to convert it to a URL. For example, here's how you could create a worker in CoffeeScript:

```coffeescript
new Worker new URL('worker.js', 'file:' + __filename),
  type: 'module'
```

The same goes for other types of dependencies like images:

```coffeescript
img = document.createElement 'img'
img.src = new URL 'hero.jpg', 'file:' + __filename
document.body.appendChild img
```