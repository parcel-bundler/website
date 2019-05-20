# ✨ 生产环境(Production)

当需要打包你的应用程序的时候，你可以使用 Parcel 的生产模式。

```bash
parcel build entry.js
```

## 最优化

这将关闭监听模式和热模块替换，所以它只会编译一次。它还会开启 minifier 来减少输出包文件的大小。Parcel 使用的 minifiers 有 JavaScript 的 [terser](https://github.com/fabiosantoscode/terser) ，CSS 的 [cssnano](http://cssnano.co) 还有 HTML 的 [htmlnano](https://github.com/posthtml/htmlnano)。

启动生产模式还会设置环境变量 `NODE_ENV=production` 。像 React 这种只用开发调试功能的大型库，通过设置这个环境变量来禁用调试功能，从而构建得更小更快。

若要利用一些仅开发调试才有的特性，要确保[terser's `dead_code` option](https://github.com/terser-js/terser#compress-options)是开启的状态（默认开启）并且将仅开发调试代码包裹在条件检测中：

```js
if (process.env.NODE_ENV === 'development') {
  // 或, `process.env.NODE_ENV !== 'production'`
  // 仅在开发环境下运行并将在生产环境下剔除.
}
```

## 文件命名策略

为了对你的 cdn 设置非常激进的缓存规则，以获得最佳性能和效率，Parcel 将会给大多数 bundles 文件名添加 hash（根据 bundle 包是否有可读/可记忆的名称,主要用于 SEO）

Parcel 在命名 bundles 文件时，遵循以下表格（入口文件不会被 hash 处理）

|                   Bundle Type | Type               | Content hashed |
| ----------------------------: | ------------------ | :------------: |
|                           Any | Entrypoint         |       ❌       |
|                    JavaScript | `<script>`         |       ✅       |
|                    JavaScript | Dynamic import     |       ❌       |
|                    JavaScript | Service worker     |       ❌       |
|                          HTML | iframe             |       ❌       |
|                          HTML | anchor link        |       ❌       |
| Raw (Images, text files, ...) | Import/Require/... |       ✅       |

文件哈希遵循以下命名模式：`<directory name>-<hash>.<extension>`

## 跨平台陷阱

为了优化生产环境的构建性能，在运行 build 命令的机器上 Parcel 将尝试确定可用的 CPU 数量，以便相应地分配工作。为此，Parcel 依赖于[physical-cpu-count](https://www.npmjs.com/package/physical-cpu-count)库

请注意，此模块假定您的系统中提供了[`lscpu`](http://manpages.courier-mta.org/htmlman1/lscpu.1.html)程序

## 使用 CI

如果要将 Parcel 集成到持续集成系统中（例如 Travis 或 Circle CI）中，则可能需要将 Parcel 安装为本地依赖项。

这里是[说明](getting_started.html#添加-parcel-到你的项目)
