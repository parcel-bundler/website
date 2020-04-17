---
layout: layout.njk
title: Parcel Documentation
---

## TODO

- Landing page (this)
- Babel
- Plugins

<br>

- Responsive on mobile (the sidebar should somehow collapse)
- Print: syntax highlighting is lost
- better contrast for sidebar links (and search bar)
- (Eventually add "Open in REPL" link to the code samples)

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
