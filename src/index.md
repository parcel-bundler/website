---
layout: layout.njk
title: Parcel
---

Parcel is a compiler for all your code, regardless of the language or toolchain.

Parcel takes all of your files and dependencies, transforms them, and merges
them together into a smaller set of output files that can be used to run your
code.

Parcel supports many different languages and file types out of the box, from
web technologies like HTML, CSS, and JavaScript, to lower level languages like
Rust, and anything that compiles to WebAssembly (WASM), to assets like images,
fonts, videos, and more.

Parcel makes your code portable. You can build your code for different
environments, for the web for your server, or for an app. You can even build
multiple targets at once and have them live update as you make changes.

Parcel is fast and predictable. It compiles all of your files in isolation in
parallel inside workers, caching all of them as it goes along. Caches are
stable across machines and are only affected by the files and configs within
your project (unless you want to pass specific environment variables).

# "Design System":

## Second Heading

### Third Heading

#### Fourth Heading

##### Fifth Heading

###### Sixth Heading

Welcome!

{% note %}
...
{% endnote %}
{% warning %}
!!
{% endwarning %}
{% error %}
!!!
{% enderror %}

{% sample null, "column" %}
{% samplefile "index.html" %}

```html
<script src="./index.js"></script>
```

{% endsamplefile %}
{% samplefile "index.js" %}

```js
console.log("hello!");
```

{% endsamplefile %}
{% endsample %}

{% sample %}
{% samplefile "index.html" %}

```html
<script src="./index.js"></script>
```

{% endsamplefile %}
{% samplefile "index.js" %}

```js/2
import "x";

console.log("hello!");
```

{% endsamplefile %}
{% endsample %}

{% migration %}
{% samplefile "index.html" %}

```html/0
<script src="./index.js"></script>
```

{% endsamplefile %}
{% samplefile "index.js" %}

```js/0
console.log("hello!");
```

{% endsamplefile %}
{% endmigration %}
