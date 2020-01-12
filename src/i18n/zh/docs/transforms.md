# 🐠 转换(Transforms)

许多打包工具需要你安装和配置插件来转换资源，Parcel 支持许多开箱即用的转换器和内置的编译器。您可以使用 [Babel](https://babeljs.cn) 转换 JavaScript ，使用 [PostCSS](http://postcss.org) 转换 CSS ，使用 [PostHTML](https://github.com/posthtml/posthtml) 转换 HTML。Parcel 在模块中找到配置文件 (例如 `.babelrc` ，`.postcssrc`) 时会自动运行并进行转换。（除了在`.babelrc`指定的转换外，Parcel 总会在所有模块上使用 Babel 编译成浏览器支持的现代 JavaScript。请参阅[JavaScript/Default Babel Transforms](javascript.html#default-babel-transforms) 查看更多信息。)

## 第三方模块

配置文件（例如 `.babelrc`）默认情况下不会应用于第三方`node_modules`中的文件。但是，如果这个模块目录是软链接的（这在一些 monorepo 约定中很常见）并且这个模块的`package.json`有`source`字段，那么将遵守当前模块目录下的配置文件。下列是`source`字段支持的类型值：

- 将所有文件视为源码，不做解析

```json
{
  "main": "foo.js",
  "source": true
}
```

- 当使用源码编译时，使用 bar.js 作为入口

```json
{
  "main": "foo.js",
  "source": "bar.js"
}
```

- 当使用源码编译时，指定文件别名

```json
{
  "main": "foo.js",
  "source": {
    "./foo.js": "./bar.js",
    "./baz.js": "./yay.js"
  }
}
```

- 当使用源码编译时，使用 glob 模式指定别名

```json
{
  "main": "foo.js",
  "source": {
    "./lib/**": "./src/$1"
  }
}
```

最后一个例子是以 src 替换你的 lib 入口目录，所以 import 'my-module/lib/test.js' 将会解析为 'my-module/src/test.js'。

针对那些根目录有许多文件要替换的包，比如 lodash，则你可以使用`"**":"./src/$1"`这种模式匹配所有（例如把 lodash/cloneDeep 替换成 lodash/src/cloneDeep）
