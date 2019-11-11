# OpenGL 셰이딩 언어 (GLSL - OpenGL Sharding Language)

_지원하는 확장자: `glsl`, `vert`, `frag`_

## 버텍스 셰이더 (Vertex shader)

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

[OpenGL GLSL documentation](https://www.opengl.org/sdk/docs/tutorials/TyphoonLabs/Chapter_3.pdf)을 기반으로 합니다.