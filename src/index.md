---
layout: layout.njk
title: Parcel Documentation
---

## TODO

- landing page (this)?
- Responsive on mobile (the sidebar should somehow collapse)
- Print: syntax highlighting is lost

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

```js
console.log("hello!");
```

{% endsamplefile %}
{% endsample %}
