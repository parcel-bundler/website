# OpenGL Shading Language (GLSL)

_Supported extensions: `glsl`, `vert`, `frag`_

# Examples of GLSL code

## Vertex shader
`vert.frag`:
```glsl
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d) 
attribute vec3 position; 
void main() {
  gl_FragColor = vec4(snoise3(position), 1.0);
}
```
You can then import the transpiled version and use the string in WebGL:
```js
import vert from "./vert.glsl";
console.log(vert)
```

based on [OpenGL GLSL documentation](https://www.opengl.org/sdk/docs/tutorials/TyphoonLabs/Chapter_3.pdf)
