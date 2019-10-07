# OpenGL Shading Language (GLSL)

_Extensions supportées : `glsl`, `vert`, `frag`_

# Exemples de code GLSL

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

Basé sur la [documentation OpenGL GLSL](https://www.opengl.org/sdk/docs/tutorials/TyphoonLabs/Chapter_3.pdf)
