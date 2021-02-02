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

### Wrapped Assets

There are a few cases where an asset needs to be _wrapped_, that is moved inside a function. This negates some advantages of scope-hoisting.

- If a top-level `return` statement or `eval` are being used or a `module` variable is used freely (`module.exports` is fine), we cannot add it into the top-level scope (because `return` would stop the execution of the whole bundle and `eval` might use variables that have been renamed).

- If an asset is imported conditionally (or generally in a try/catch, a function an if statement) using CommonJS `require` (this isn't possible with the ESM syntax), we cannot add it into the top-level scope because its content should only be execute when it is actually required.

### `sideEffects: false`

When `sideEffects: false` is specified in `package.json` (in most cases of some library), Parcel can skip processing some assets entirely (e.g. not even transpiling the `lodash` function that weren't imported) or not include them in the output bundle at all (e.g. because that asset merely does reexporting).

### `import * as ns from "...";`

Even if you use the `import * as` syntax, unused exports are removed reliably as long as the namespace object is only accessed with static member expressions (`ns.foo` or `ns['foo']`).

{% sample %}
{% samplefile %}

```js
import * as thing from "./foo.js";

console.log(thing.x);

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
