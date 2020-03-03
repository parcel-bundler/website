# OpenGL Shading Language (GLSL)

_支援的副檔名：`glsl`、`vert` 及 `frag`_

## GLSL 範例程式碼

## Vertex shader

`shader.frag`:

```glsl
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
attribute vec3 position;
void main() {
  gl_FragColor = vec4(snoise3(position), 1.0);
}
```

接著你可以匯入轉譯後的版本，並在 WebGL 中使用這個字串：

```js
import frag from './shader.frag'

// ...
gl.shaderSource(..., frag);
// ...
```
