---
layout: layout.njk
title: Tree shaking
description: In production builds, Parcel statically analyzes the imports and exports of each module, and removes everything that isn't used. This is called "tree shaking".
eleventyNavigation:
  key: features-tree-shaking
  title: 🌳 Tree shaking
  order: 7
---

In production builds, Parcel statically analyzes the imports and exports of each module, and removes everything that isn't used. This is called **"tree shaking"** or **"dead code elimination".** Tree shaking is supported for both static and [dynamic import](/features/code-splitting/#tree-shaking), [CommonJS](/languages/javascript/#commonjs) and [ES modules](/languages/javascript/#es-modules), and even across languages with [CSS modules](/languages/css/#tree-shaking).

## How tree shaking works

Parcel’s implementation of tree shaking works by analyzing the imports and exports of each module independently and in parallel. Once all modules have been compiled, Parcel determines which exports of each module are actually used, and removes the unused exports. Any code that is no longer referenced is then removed by the minifier.

{% sample %}
{% samplefile "index.js" %}

```javascript
import { add } from "./math";

console.log(add(2, 3));
```

{% endsamplefile %}
{% samplefile "math.js" %}

```javascript
export function add(a, b) {
  return a + b;
}

export function square(a) {
  return a * a;
}
```

{% endsamplefile %}
{% endsample %}

In this example, only the `add` function is used, so the `square` function is removed from the output.

## Avoiding bail outs

Parcel can statically analyze many patterns including ES module `import` and `export` statements, CommonJS `require()` and `exports` assignments, dynamic `import()` destructuring, and more. However, when it comes across code that cannot be statically analyzed ahead of time, Parcel may have to "bail out" and include all exports of a module in order to preserve side effects or allow exports to be resolved at runtime.

To determine why tree shaking is not occurring as expected, run Parcel with the `--log-level verbose` CLI option. This will print diagnostics for each bailout that occurs, including a code frame showing what caused it.

```javascript
parcel build src/app.html --log-level verbose
```

### Namespace imports

Parcel tracks which exports are used through named imports, but when a namespace import is used, all exports of the module must be included in the build. Use named imports instead to allow unused exports to be removed.

```javascript
// ✅ Named import
import { add } from "./math";
console.log(add(2, 3));

// 🚫 Namespace import
import * as math from "./math";
console.log(math.add(2, 3));
```

<!-- TODO(v3): v2 tree shook static property accesses of namespace imports (`math.add`) and only bailed out on dynamic accesses (`math[op]`), re-assignment, or unknown usage of the namespace. v3 keeps all exports for any namespace import (fixture tree-shaking/esm-namespace asserts "namespace import keeps unused namespace export conservatively"; confirmed with the release binary). The BailoutReason::NonStaticAccess diagnostic still only reports dynamic accesses. Restore the v2 "Dynamic member accesses" section if static member tracking comes back. -->

### Dynamic imports

Parcel supports tree shaking dynamic imports with destructuring. This is supported with both `await` and Promise `then` syntax. However, if the Promise returned from `import()` is accessed in any other way, Parcel must preserve all exports of the resolved module.

{% note %}

**Note:** For the `await` cases, unused exports can unfortunately only be removed when `await` is not transpilied away (i.e. with a modern browserslist config).

{% endnote %}

```swift
// ✅ Destructuring await
let {add} = await import('./math');

// ✅ Destructuring Promise#then
import('./math').then(({add}) => console.log(add(2, 3)));

// 🚫 Member access of await
let math = await import('./math');
console.log(math.add(2, 3));

// 🚫 Member access of Promise#then
import('./math').then(math => console.log(math.add(2, 3)));

// 🚫 Unknown use of returned Promise
doSomething(import('./math'));

// 🚫 Unknown argument passed to Promise#then
import('./math').then(doSomething);
```

### CommonJS

In addition to ES modules, Parcel can also analyze many CommonJS modules. Parcel supports static assignments to `exports`, `module.exports`, and `this` within a CommonJS module. This means the property name must be known statically at build time (i.e. not a variable).

<!-- TODO(v3): `this.foo = 2` is collected as a static export, but the packager's tree_shake (crates/js/src/packager/tree_shake.rs) only removes unused `exports.foo =` / `module.exports.foo =` assignments, so unused `this.foo` exports are kept in production output (verified with the release binary). Either fix or drop `this` from this list. -->

When a non-static pattern is seen, the exports of the module can only be resolved at runtime. All exports must be included in the final build and no tree shaking can be performed.

```javascript
// ✅ Static exports assignments
exports.foo = 2;
module.exports.foo = 2;
this.foo = 2;

// ✅ module.exports assignment
module.exports = 2;

// 🚫 Dynamic exports assignments
exports[someVar] = 2;
module.exports[someVar] = 2;
this[someVar] = 2;

// 🚫 Exports re-assignment
let e = exports;
e.foo = 2;

// 🚫 Module re-assignment
let m = module;
m.exports.foo = 2;

// 🚫 Unknown exports usage
doSomething(exports);
doSomething(this);

// 🚫 Unknown module usage
doSomething(module);
```

On the importing side, Parcel supports destructuring and static property accesses directly on `require` calls. When a non-static access is seen, all exports of the resolved module must be included and no tree shaking can be performed.

```javascript
// ✅ Static destructuring
const { add } = require("./math");

// ✅ Static property assignment
const add = require("./math").add;

// 🚫 Property access of require result
const math = require("./math");
console.log(math.add(2, 3));

// 🚫 Inline require
doSomething(require("./math"));
console.log(require("./math").add(2, 3));
```

### Avoid `eval`

The `eval` function executes arbitrary JavaScript code in a string within the current scope. This means Parcel cannot statically analyze the module, since any of the variables within the scope could be accessed by `eval`. In this case, tree shaking is disabled for the module and its dependencies, and the minifier must avoid renaming the variable names.

```javascript
let x = 2;

// 🚫 Eval disables tree shaking and minification
eval("x = 4");
```

If you need to run JavaScript code from a string, you may be able to use the [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function) constructor instead.

### Avoid top-level `return`

CommonJS allows `return` statements at the top-level of a module (i.e. outside a function). When this is seen, tree shaking is disabled because exports may not be known statically (e.g. if the return is conditional).

```javascript
exports.foo = 2;

if (someCondition) {
  // 🚫 Top-level return disables tree shaking
  return;
}

exports.bar = 3;
```

### Avoid `module` and `exports` re-assignment

When the CommonJS `module` or `exports` variables are re-assigned, Parcel cannot statically analyze the exports of the module. In this case, tree shaking is disabled.

```javascript
exports.foo = 2;

// 🚫 Exports reassignment disables tree shaking
exports = {};

exports.foo = 5;
```

### Avoid conditional `require()`

Unlike ES module `import` statements which are only allowed at the top-level of a module, `require` is a function that may be called from anywhere. However, when `require` is called from within a conditional or another control flow statement, Parcel cannot statically determine which exports are used, so all exports of the resolved module must be included.

```javascript
// 🚫 Conditional requires disable tree shaking of the resolved module
if (someCondition) {
  const { add } = require("./math");
}
```

## Side effects

Many modules only contain declarations, like functions or classes, but some may also include **side effects**. For example, a module might insert something into the DOM, log something to the console, assign to a global variable (i.e. a polyfill), or initialize a singleton. These side effects must always be retained for the program to work correctly, even if the exports of the module are unused.

By default, Parcel includes all modules, which ensures side effects are always run. However, the `sideEffects` field in `package.json` can be used to give Parcel and other tools a hint about whether your files include side effects. This makes the most sense for libraries to include in their package.json files.

The `sideEffects` field supports the following values:

- `false` – All files in this package have no side effects.
- `string` – A glob matching files that includes side effects.
- `Array<string>` – An array of globs matching files that include side effects.

When a file is marked as side effect free, Parcel is able to skip the entire file if it does not have any used exports. This can reduce bundle sizes significantly, especially if the module calls helper functions during its initialization.

{% sample null, "column" %}
{% samplefile "app.js" %}

```js
import { add } from "math";

console.log(add(2, 3));
```

{% endsamplefile %}

{% samplefile "node_modules/math/package.json" %}

```json
{
  "name": "math",
  "sideEffects": false
}
```

{% endsamplefile %}

{% samplefile "node_modules/math/index.js" %}

```js
export { add } from "./add.js";
export { multiply } from "./multiply.js";

let loaded = Date.now();
export function elapsed() {
  return Date.now() - loaded;
}
```

{% endsamplefile %}
{% endsample %}

In this case, only the `add` function from the `math` library is used. `multiply` and `elapsed` are unused. Normally, the `loaded` variable would still be needed because it includes a side effect that runs during the module's initialization. However, because the `package.json` includes the `sideEffects` field, the `index.js` module can be entirely skipped.

In addition to size benefits, using the `sideEffects` field also has build performance benefits. In the above example, because Parcel knows `multiply.js` has no side effects, and none of its exports are used, it is never even compiled at all. However, if `export *` had been used instead, this would not be true because Parcel would not know what exports are available.

Another benefit of `sideEffects` is that it also applies to bundling. If a module imports a CSS file or contains a dynamic `import()`, the bundle will not be created if the module is unused.

### PURE annotations

You can also annotate individual function calls with a `/*#__PURE__*/` comment, which tells the minifier that it's safe to remove that function call when the result is unused.

```javascript
export const radius = 23;
export const circumference = /*#__PURE__*/ calculateCircumference(radius);
```

In this example, if the `circumference` export is unused, then the `calculateCircumference` function will also not be included. Without the PURE annotation, `calculateCircumference` would still be called in case it had side effects.
