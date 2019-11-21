# OpenGL Shading Language (GLSL)

_Extensions supportées : `glsl`, `vert`, `frag`_

# Exemples de code GLSL

## Vertex shader

`shader.frag`:

```glsl
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
attribute vec3 position;
void main() {
  gl_FragColor = vec4(snoise3(position), 1.0);
}
```

Vous pouvez ensuite importer la version transpilée et utiliser la chaîne dans WebGL :

```js
import frag from './shader.frag'
// ...
gl.shaderSource(..., frag);
// ...
```