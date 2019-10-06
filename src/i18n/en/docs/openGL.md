# OpenGL Shading Language (GLSL)

_Supported extensions: `glsl`, `vert`, `frag`_

# Examples of GLSL code

## Vertex shader
```c
uniform vec4 scale;
void main()
{
  vec4 pos = gl_Vertex * scale;
  gl_Position = gl_ModelViewProjectionMatrix * pos;
}
```

## Fragment Shader
```c
void main()
{
  gl_FragColor = vec4(1,1,1,1);
}
```

based on [OpenGL GLSL documentation](https://www.opengl.org/sdk/docs/tutorials/TyphoonLabs/Chapter_3.pdf)
