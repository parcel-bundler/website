# ReasonML

_支持扩展类型: `ml`, `re`_

## ReasonML/BuckleScript

[ReasonML](https://reasonml.github.io/)在[BuckleScript](https://bucklescript.github.io) 的帮助下将 OCaml 编译为 JavaScript。通过安装依赖和创建`bsconfig.json`文件使用 ReasonML。

```bash
$ yarn add bs-platform --dev
```

```json
// bsconfig.json
// from https://github.com/BuckleScript/bucklescript/blob/master/jscomp/bsb/templates/basic-reason/bsconfig.json

{
  "name": "whatever",
  "sources": {
    "dir": "src",
    "subdirs": true
  },
  "package-specs": {
    "module": "commonjs",
    "in-source": true
  },
  "suffix": ".bs.js",
  "bs-dependencies": [],
  "warnings": {
    "error": "+101"
  },
  "namespace": true,
  "refmt": 3
}
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <body>
    <script src="./src/index.re"></script>
  </body>
</html>
```

```reason
/* src/index.re */
print_endline("Hello World");
```

### ReasonReact

[ReasonReact](https://reasonml.github.io/reason-react/) 通过 ReasonML 构建 React。当然也能在 Parcel 中使用：

```bash
$ yarn add react react-dom reason-react
```

```diff
// bsconfig.json

{
  "name": "whatever",
+ "reason": {
+   "react-jsx": 3
+ },
  "sources": {
    "dir": "src",
    "subdirs": true
  },
  "package-specs": {
    "module": "commonjs",
    "in-source": true
  },
  "suffix": ".bs.js",
  "bs-dependencies": [
+   "reason-react"
  ],
  "warnings": {
    "error": "+101"
  },
  "namespace": true,
  "refmt": 3
}
```

```diff
<!-- index.html -->
<html>
<body>
+ <div id="app"></div>
  <script src="./src/index.re"></script>
</body>
</html>
```

```reason
/* src/Greeting.re */

[@react.component]
let make = (~name) => {
  <div> {React.string("Hello! " ++ name)} </div>;
};
```

```reason
/* src/index.re */

ReactDOMRe.renderToElementWithId(<Greeting name="Parcel" />, "app");
```
