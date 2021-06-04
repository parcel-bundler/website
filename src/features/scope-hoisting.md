---
layout: layout.njk
eleventyNavigation:
  key: features-scope-hoisting
  title: 🌳 Scope Hoisting
  order: 9
summary: What scope hoisting is and how it enables smaller builds and ESM output
---

Parcel can remove unused JS code with both CommonJS and ES modules (including [dynamic imports](/features/code-splitting/#unused-exports) in many cases), and unused [CSS modules classes](/languages/postcss/#css-modules-tree-shaking).

## Tips for smaller/faster builds

### Hints for more optimization

#### Specifying `sideEffects: false` for libraries

When `sideEffects: false` is specified in `package.json` (in most cases of some library), we can skip processing some assets entirely (e.g. not even transpiling the `lodash` function that weren't imported) or not include them in the output bundle at all (e.g. because that asset merely does reexporting).

For example:

{% sample null, "column" %}
{% samplefile "app.js" %}

```js
import { add } from "lib";

console.log(add(1, 2));
```

{% endsamplefile %}

{% samplefile "node_modules/lib/package.json" %}

```js
{
  "name": "lob"
  "sideEffects": false
}
```

{% endsamplefile %}

{% samplefile "node_modules/lib/index.js" %}

```js
export { add } from "./add.js";
export { multiply } from "./multiply.js";

let loaded = Date.now();
export function elapsed() {
  return Date.now() - loaded;
}

let cache = new Map();
export function cached(param, func) {
  /* ... */
}
```

{% endsamplefile %}

{% endsample %}

In this case, we don't even have to load (and transpile) `node_modules/lib/multiply.js` because it's definitely unused. Furthermore `node_modules/lib/index.js` can be skipped when concatenating the bundle because none of its direct exports are used (`elapsed`), this alleviates the need to annotate the variable declaration with `/*@__PURE__*/`. This is still neccesary however when only exports in the file are used - so if only `elapsed` is imported, `let cache = new Map()` cannot be removed even though `cached` is unused.

If `export *` is used instead of `export { multiply }`, `multiply.js` has to be transpiled but it's still not included in the output (so this mainly causes longer build times).

Another benefit of `sideEffects` is that this even applies to bundling, so if `multiply.js` imports a CSS stylesheet or contains a dynamic `import()`, that bundle isn't created either if `multiply.js` itself is unused.

### Patterns to avoid

#### Avoid reliance on CommonJS specifics

If a top-level `return` statement or `eval` are being used or a `module` variable is used freely (`module.exports` is fine), we cannot add it into the top-level scope (because `return` would stop the execution of the whole bundle and `eval` might use variables that have been renamed).

#### Avoid conditional `require()`

This is a case where an asset needs to be _wrapped_, that is moved inside a function. This negates some advantages of scope-hoisting.

If an asset is `require`d conditionally or generally no in the toplevel of the asset, we cannot add it into the top-level scope because its content should only be execute when it is actually required. This logic also needs to be applied recursively to not immediately execute dependencies of the wrapped asset.

#### `import * as ns from "...";` can be equivalent to named imports

Even if you use the `import * as` syntax, unused exports are removed reliably as long as the namespace object is only accessed with static member expressions (`ns.foo` or `ns['foo']`).

{% sample %}
{% samplefile %}

```js/5,6
import * as thing from "./foo.js";

console.log(thing.x);
console.log(thing['y']);

let other = thing; // This causes everything to be included!
console.log(other.x);
```

{% endsamplefile %}
{% endsample %}

## Motivation and Advantages of Scope Hoisting

For a long time, many bundlers (like Webpack and Browserify, but not Rollup) achieved the actual bundling by wrapping all assets in a function, creating a map of all included assets and providing a CommonJS runtime. A (very) simplified example of that:

```js
(function (modulesMap, entry) {
  // internal runtime
})(
  {
    "index.js": function (require, module, exports) {
      var { Foo } = require("./thing.js");
      var obj = new Foo();
      obj.run();
    },
    "thing.js": function (require, module, exports) {
      module.exports.Foo = class Foo {
        run() {
          console.log("Hello!");
        }
      };
      module.exports.Bar = class Bar {
        run() {
          console.log("Unused!");
        }
      };
    },
  },
  "index.js"
);
```

This mechanism has both advantages and disadvantages:

<ul style="list-style: none;">
  <li>
    + The bundle can be generated very quickly, the asset's sources are simply copied into a string.
  </li>
  <li>
    – It is hard to optimize because the <code>require</code> function makes it hard to statically analyze which exports are used (think of <code>lodash</code>) and whether a asset that only does reexports could be removed entirely.
  </li>
  <li>
    – This is incompatible with ES module exports, because <code>export</code> declarations cannot be inside of functions.
  </li>
</ul>

## Solution

Instead, the individual assets are concatenated directly in the top-level scope:

```js
// thing.js
var $thing$export$Foo = class {
  run() {
    console.log("Hello!");
  }
};
var $thing$export$Bar = class {
  run() {
    console.log("Unused!");
  }
};

// index.js
var $index$export$var$obj = new $thing$export$Foo();
$index$export$var$obj.run();
```

As you can see, the top-level variables from the assets need to be renamed to have a globally unique name.

Now, removing unused exports has become trivial: the variable `$thing$export$Bar` is not used at all, so we can safely remove it (and a minifier like Terser would do this automatically), this step is referred to as **tree shaking**.

The only real downside is that builds take quite a bit longer and also use more memory than the wrapper-based approach (because every single statement needs to be modified and the bundle as a whole needs to remain in memory during the packaging).

<!--

## How It Really Works

{% note %}

This is a rather in-depth description of the Parcel's scope hoisting implementation and not required reading for using Parcel.

{% endnote %}

```js
var $id$exports$ = function () {
  var exports = this;
  var module = { exports: this };
  // ...the original asset's content
  return module.exports;
}.call({});
```

```js
// ...variable declarations from the original asset
var $thing$export$Foo;
function $id$exec() {
  $id$exports = {};
  $thing$export$Foo = class {
    run() {
      console.log("Hello!");
    }
  };
  // ...the original asset's content
}

function $id$init() {
  if (!$id$executed) {
    $id$executed = true;
    $id$exec();
  }

  return $id$exports;
}
```
-->
