# OpenGL Shading Language (GLSL)

_支援的副檔名：`glsl`、`vert` 及 `frag`_

## GLSL 範例程式碼

### Vertex shader
```c
uniform vec4 scale;
void main()
{
  vec4 pos = gl_Vertex * scale;
  gl_Position = gl_ModelViewProjectionMatrix * pos;
}
```

### Fragment Shader
```c
void main()
{
  gl_FragColor = vec4(1,1,1,1);
}
```

詳情請見 [OpenGL GLSL 文件](https://www.opengl.org/sdk/docs/tutorials/TyphoonLabs/Chapter_3.pdf)
