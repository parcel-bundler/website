# ✨ 生产环境(Production)

当需要绑定应用程序的时候，你可以使用 Parcel 的生产模式。

```bash
parcel build entry.js
```

这将关闭监听模式和热模块替换，所以它只会编译一次。它还会开启 minifier 来减少输出包文件的大小。Parcel 使用的 minifiers 有 JavaScript 的 [uglify-es](https://github.com/mishoo/UglifyJS2/tree/harmony) ，CSS 的 [cssnano](http://cssnano.co) 还有 HTML 的 [htmlnano](https://github.com/posthtml/htmlnano)。

启动生产模式还要设置环境变量 `NODE_ENV=production` 。像 React 这种只用开发调试功能的大型库，通过设置这个环境变量来禁用调试功能，从而构建得更小更快。


### Options

#### 设置输出目录

Default: "dist"

```bash
parcel build entry.js --out-dir build/output
或者
parcel build entry.js -d build/output
```

```base
root
- build
- - output
- - - entry.js
```

#### 设置要提供服务的公共 URL

Default: --out-dir option

```bash
parcel build entry.js --public-url ./
```

将输出到:
```html
<link rel="stylesheet" type="text/css" href="1a2b3c4d.css">
or
<script src="e5f6g7h8.js"></script>
```


#### 禁用压缩

Default: minification enabled

```
parcel build entry.js --no-minify
```

#### 禁用文件系统缓存
Default: cache enabled

```bash
parcel build entry.js --no-cache
```
