---
layout: layout.njk
title: GLSL
eleventyNavigation:
  key: languages-glsl
  title: <img src="/assets/lang-icons/openGL.svg" alt=""/> GLSL
  order: 14
---

Parcel supports importing [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) shaders using the `@parcel/transformer-glsl` plugin. When a `.glsl`, `.vert` or `.frag` file is detected, it will be installed into your project automatically.

## Example usage

GLSL files are imported into JavaScript as a string, which you can load into a WebGL context.

```js
import frag from './shader.frag'

// ...
gl.shaderSource(..., frag);
// ...
```

### Dependencies

Parcel also supports dependencies within GLSL files using a pragma, including from libraries in node_modules. These are bundled together into a single shader that you can load into a WebGL context.

{% sample %}
{% samplefile "app.js" %}

```js
import frag from './shader.frag';

// ...
gl.shaderSource(..., frag);
// ...
```

{% endsamplefile %}
{% samplefile "shader.frag" %}

```glsl
// import a function from another file
#pragma glslify: calc_frag_color = require('./lib.glsl')

precision mediump float;
varying vec3 vpos;

void main() {
  gl_FragColor = calc_frag_color(vpos);
}
```

{% endsamplefile %}
{% samplefile "lib.glsl" %}

```glsl
// import a function from node_modules
#pragma glslify: noise = require('glsl-noise/simplex/3d')

vec4 calc_frag_color(vec3 pos) {
  return vec4(noise(pos * 25.0), 1);
}

// export a function
#pragma glslify: export(calc_frag_color)

```

{% endsamplefile %}
{% endsample %}
