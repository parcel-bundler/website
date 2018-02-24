# 📚 API

## Bundler

你可以选择使用 API 替代 CLI 来初始化 bunlder ，获取更高级的使用方式(例如: 在每次构建后进行自定义操作)。
针对每个选项都给出了可参考的示例进行说明:
```Javascript
const Bundler = require('parcel-bundler');
const Path = require('path');

// 入口文件路径
const file = Path.join(__dirname, './index.html');

// Bundler 选项
const options = {
  outDir: './dist', // 将生成的文件放入输出目录下，默认为 dist
  outFile: 'index.html', // 输出文件的名称
  publicUrl: './', // 静态资源的 url ，默认为 dist
  watch: true, // 是否需要监听文件并在发生改变时重新编译它们，默认为 process.env.NODE_ENV !== 'production'
  cache: true, // 启用或禁用缓存，默认为 true
  cacheDir: '.cache', // 缓存被放入的目录，默认为 .cache
  minify: false, // 压缩文件，当 process.env.NODE_ENV === 'production' 时，被启用。
  target: 'browser', // 浏览器/node/electron, 默认为 browser
  https: false, // 服务器文件使用 https 或者 http，默认为 false
  logLevel: 3, // 3 = 输出所有内容，2 = 输出警告和错误, 1 = 输出错误
  hmrPort: 0, // hmr socket 运行的端口，默认为随机空闲的端口 (node.js 中的 0 被解析为随机空闲端口)
  sourceMaps: true, // 启用或禁用 sourcemaps，默认为启用(在精简版本中不支持)
  hmrHostname: '', // 热模块重载的主机名，默认为 ''
  detailedReport: false // 打印 bundles ，资源，文件大小以及时间的详细报告，默认为 false ，只有在禁用监听时才打印报告
};

// 使用提供的入口文件路径和选项初始化 bundler
const bundler = new Bundler(file, options);

// 运行 bundler，这将返回主 bundle
// 如果你使用监听模式，请使用这些事件，因为该 promise 只会触发一次，而不是每次重新构建
const bundle = await bundler.bundle();
```

### 事件

这是 bundler 所有的事件列表。

* 一旦 parcel 完成构建，`bundled` 会被调用，主 [bundle](#bundle) 会作为参数传递到该 callback
```Javascript
const bundle = new Bundler(...);
bundle.on('bundled', (bundle) => {
  // bundle 包含所有资源和 bundle，如需了解更多请查看文档
});
```

* 构建结束后 `buildEnd` 会被调用，如果发生错误它也会被触发
```Javascript
const bundle = new Bundler(...);
bundle.on('buildEnd', () => {
  // 做任何事...
});
```

### Bundle

`Bundle` 是 parcel 用来将资源捆绑在一起的工具，它还包含能够构建 bundle 树的子 bundle 和兄弟 bundle。

#### 属性

* `type`: 它包含的资源类型 (例如: js, css, map, ...)
* `name`: bundle 的名称 (使用 `entryAsset` 的 `Asset.generateBundleName()` 生成)
* `parentBundle`: 父 bundle ，在入口 bundle 下为 null
* `entryAsset`: bundle 的入口，用于生成名称和收集资源
* `assets`: bundle 中所有资源的`集合`
* `childBundles`: 所有子 bundle 的`集合`
* `siblingBundles`: 所有兄弟 bundle 的`集合`
* `siblingBundlesMap`: 所有兄弟 bundle 的映射 `Map<String(Type: js, css, map, ...), Bundle>`
* `offsets`: 所有 bundle 中资源位置的映射 `Map<Asset, number(line number inside the bundle)>` ，用于生成准确的 sourcemap 。

#### 树

`Bundle` 包含一个 `parentBundle`，`childBundles` 和 `siblingBundles`，所有这些属性一起创建一个快速迭代的 bundle 树。


资源树及其生成的 bundle 树的基本示例如下:

##### 资源树:

`index.html` 引用 `index.js` 和 `index.css`

`index.js` 引用 `test.js` 和 `test.txt`

```Text
index.html
-- index.js
 |--- test.js
 |--- test.txt
-- index.css
```

##### Bundle 树:

`index.html` 被作为主 bundle 的入口资源，这个主 bundle 创建了两个子 bundle ，一个用于 `index.js`，另一个用于 `index.css` ，这是因为它们的类型不同于 `html` 。

`index.js` 引入了两个文件，`test.js` 和 `test.txt` 。

`test.js` 被添加到了 `index.js` bundle 的资源中，因为它与 `index.js` 的类型相同。

`test.txt` 会创建一个新的 bundle ，并被添加到 `index.js` bundle 的子元素中，因为它是与 `index.js` 不同的资源类型。

`index.css` 不包含引用，因此只包含它的入口资源。

`index.css` 和 `index.js` 的 bundle 彼此互为共享相同父级的兄弟 bundle 。

```Text
index.html
-- index.js (includes index.js and test.js)
 |--- test.txt (includes test.txt)
-- index.css (includes index.css)
```

### 中间件(Middleware)

中间件可以用于 hook 到 http 服务器(例如: `express` 或者 node `http`) 。

express 使用 parcel 中间件的示例：
```Javascript
const Bundler = require('parcel-bundler');
const app = require('express')();

// 使用文件和选项初始化新的 bundler (有关选项和文件的内容，请参阅 bundler 文档)
const bundler = new Bundler(file, options);

// 让 express 使用 bundler 中间件，这将让 parcel 处理你 express 服务器上的每个请求
app.use(bundler.middleware());

// 监听端口 8080
app.listen(8080);
```
