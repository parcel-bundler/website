# OpenGL Shading Language (GLSL)

_Supported extensions: `glsl`, `vert`, `frag`_

# Examples of GLSL code

## Fragment shader

`shader.frag`:

```glsl
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
attribute vec3 position;
void main() {
  gl_FragColor = vec4(snoise3(position), 1.0);
}
```

You can then import the transpiled version and use the string in WebGL:

```js
import frag from './shader.frag'

// ...
gl.shaderSource(..., frag);
// ...
```
