---
layout: layout.njk
title: Macros
eleventyNavigation:
  key: features-macros
  title: 🪗 Macros
  order: 4
---

Macros are JavaScript functions that run at build time. The value returned by a macro is inlined into the bundle in place of the original function call. This allows you to generate constants, code, and even additional assets without any custom plugins.

Macros are imported using an [import attribute](https://github.com/tc39/proposal-import-attributes) to indicate that they should run at build time rather than being bundled into the output. You can import any JavaScript or TypeScript module as a macro, including built-in Node modules and packages from npm.

{% warning %}

**Note**: for security reasons, macros cannot be called from inside `node_modules`.

{% endwarning %}

This example uses the [regexgen](https://github.com/devongovett/regexgen) library to generate an optimized regular expression from a set of strings at build time.

```ts
import regexgen from 'regexgen' with {type: 'macro'};

const regex = regexgen(['foobar', 'foobaz', 'foozap', 'fooza']);
console.log(regex);
```

This compiles to the following bundle:

```js
console.log(/foo(?:zap?|ba[rz])/);
```

As you can see, the `regexgen` library has been completely compiled away, and we are left with a static regular expression!

## Arguments

Macro arguments are evaluated statically, which means their value must be known at build time. You can pass any JavaScript literal value, including strings, numbers, booleans, objects, etc. Simple expressions such as string concatenation, arithmetic, and comparison operators are supported as well. However, values referencing non-constant variables, calling functions other than macros, etc. are not supported.

```js
import {myMacro} from './macro.ts' with {type: 'macro'};

const result = myMacro({
  name: 'Devon'
});
```

### Constants

Parcel also evaluates constants declared via the `const` keyword. These may be referenced in a macro argument.

```js/2
import {myMacro} from './macro.ts' with {type: 'macro'};

const name = 'Devon';
const result = myMacro({name});
```

The result of one macro may also be passed to another macro.

```js/3
import {myMacro} from './macro.ts' with {type: 'macro'};
import {getName} from './name.ts' with {type: 'macro'};

const name = getName();
const result = myMacro({name});
```

However, if you attempt to mutate the value of a constant, this will result in an error.

```js/3
import {myMacro} from './macro.ts' with {type: 'macro'};

const arg = {name: 'Devon'};
arg.name = 'Peter'; // Error: Cannot statically evaluate macro argument

const result = myMacro({name});
```

## Return values

Macros can return any JavaScript value, including objects, strings, booleans, numbers, and even functions. These are converted into an AST and replace the original function call in your code.

{% sample %}
{% samplefile "index.ts" %}

```ts
import {getRandomNumber} from './macro.ts' with {type: 'macro'};

console.log(getRandomNumber());
```

{% endsamplefile %}
{% samplefile "macro.ts" %}

```ts
export function getRandomNumber() {
  return Math.random();
}
```

{% endsamplefile %}
{% endsample %}

The bundled output of this example looks like this:

```js
console.log(0.006024956627355804);
```

### Async macros

Macros can also return promises that resolve to any supported value. For example, you could make an HTTP request to fetch the contents of a URL at build time, and inline the result into the bundle as a string.

{% sample %}
{% samplefile "index.ts" %}

```ts
import {fetchText} from './macro.ts' with {type: 'macro'};

console.log(fetchText('http://example.com'));
```

{% endsamplefile %}
{% samplefile "macro.ts" %}

```ts
export async function fetchText(url: string) {
  let res = await fetch(url);
  return res.text();
}
```

{% endsamplefile %}
{% endsample %}

### Generating functions

Macros can return functions, which allows you to generate code at build time. Use the `new Function` constructor to generate a function dynamically from a string.

This example uses the [micromatch](https://github.com/micromatch/micromatch) library to compile a glob matching function at build time.

{% sample %}
{% samplefile "index.ts" %}

```ts
import {compileGlob} from './glob.ts' with {type: 'macro'};

const isMatch = compileGlob('foo/**/bar.js');
```

{% endsamplefile %}
{% samplefile "glob.ts" %}

```ts
import micromatch from 'micromatch';

export function compileGlob(glob) {
  let regex = micromatch.makeRe(glob);
  return new Function('string', `return ${regex}.test(string)`);
}
```

{% endsamplefile %}
{% endsample %}

The bundled output of this example looks like this:

```js
const isMatch = function(string) {
  return /^(?:foo(?:\/(?!\.)(?:(?:(?!(?:^|\/)\.).)*?)\/|\/|$)bar\.js)$/.test(string);
};
```

## Generating assets

A macro can generate additional assets which become dependencies of the JavaScript module that called it. For example, macros can generate CSS which will be statically extracted into a CSS bundle as if it was imported from the JS file.

Within a macro function, `this` is an object with Parcel-provided methods. To create an asset, call `this.addAsset` and provide the type and contents.

This example accepts a string of CSS and returns a generated class name. The CSS is added as an asset and bundled into a CSS file, and the JavaScript bundle only includes the generated class name as a static string.

{% sample %}
{% samplefile "index.ts" %}

```tsx
import {css} from './css.ts' with {type: 'macro'};

<div className={css('color: red; &:hover { color: green }')}>
  Hello!
</div>
```

{% endsamplefile %}
{% samplefile "css.ts" %}

```ts/6-10
import type {MacroContext} from '???';

export async function css(this: MacroContext | void, code: string) {
  let className = hash(code);
  code = `.${className} { ${code} }`;

  this?.addAsset({
    type: 'css',
    content: code
  });

  return className;
}
```

{% endsamplefile %}
{% endsample %}

The bundled output of the above example would look like this:

{% sample %}
{% samplefile "index.js" %}

```tsx
<div className="ax63jk4">
  Hello!
</div>
```

{% endsamplefile %}
{% samplefile "index.css" %}

```css
.ax63jk4 {
  color: red;
  &:hover {
    color: green;
  }
}
```

{% endsamplefile %}
{% endsample %}

## Caching

By default, Parcel caches the result of a macro until the file that calls it changes. However, sometimes, a macro may have other inputs which should invalidate the cache. For example, it might read a file, access an environment variable, etc. The `this` context within a macro function includes methods to control the caching behavior.

```ts
interface MacroContext {
  /** Invalidate the macro call whenever the given file changes. */
  invalidateOnFileChange(filePath: string): void,
  /** Invalidate the macro call when a file matching the given pattern is created. */
  invalidateOnFileCreate(options: FileCreateInvalidation): void,
  /** Invalidate the macro whenever the given environment variable changes. */
  invalidateOnEnvChange(env: string): void,
  /** Invalidate the macro whenever Parcel restarts. */
  invalidateOnStartup(): void,
  /** Invalidate the macro on every build. */
  invalidateOnBuild(): void,
}

type FileCreateInvalidation = FileInvalidation | GlobInvalidation | FileAboveInvalidation;

/** Invalidate when a file matching a glob is created. */
interface GlobInvalidation {
  glob: string
}

/** Invalidate when a specific file is created. */
interface FileInvalidation {
  filePath: string
}

/** Invalidate when a file of a specific name is created above a certain directory in the hierarchy. */
interface FileAboveInvalidation {
  fileName: string,
  aboveFilePath: string
}
```

For example, when reading a file in a macro, add the file path as an invalidation so that the calling code is recompiled whenever that file changes. In this example, whenever `message.txt` is edited, `index.ts` will be recompiled and the `readFile` macro will be called again.

{% sample %}
{% samplefile "index.ts" %}

```tsx
import {readFile} from './macro.ts' with {type: 'macro'};

console.log(readFile('message.txt'))
```

{% endsamplefile %}
{% samplefile "macro.ts" %}

```ts
import type {MacroContext} from '???';
import fs from 'fs';

export async function readFile(this: MacroContext | void, filePath: string) {
  this?.invalidateOnFileChange(filePath);
  return fs.readFileSync(filePath, 'utf8');
}
```

{% endsamplefile %}
{% samplefile "message.txt" %}

```
hello world!
```

{% endsamplefile %}
{% endsample %}

## Usage with other tools

Macros are just normal JavaScript functions, so they integrate with other tools easily. TypeScript supports import attributes out of the box as of version 5.3, and autocomplete and types for macros work just like regular functions. Other tools like Babel and ESLint may require a configuration option to enable import attributes for now.

### Unit testing

Unit testing macros is just like testing any other JavaScript function. One caveat is if your macro uses the `this` context described in the above sections. If you are testing a macro itself, you can mock the `this` argument to verify it is called as expected.

{% sample %}
{% samplefile "css.test.ts" %}

```ts
import {css} from '../src/css.ts';

it('should generate css', () => {
  let addAsset = jest.fn();
  let className = css.call({
    addAsset,
    // ...
  }, 'color: red');

  expect(addAsset).toHaveBeenCalledWith({
    type: 'css',
    content: '.ax63jk4 { color: red }'
  });
  expect(className).toBe('ax63jk4');
});
```

{% endsamplefile %}
{% endsample %}

When testing code that indirectly uses a macro, the macro function will be called as a normal function at runtime rather than by Parcel at compile time. In this case, the macro context that would normally be provided by Parcel won't be available. That's why the `this` argument is typed as `MacroContext | void` in the above examples and we do a runtime check to see if `this` exists. When the context isn't available, code that uses it such as `this?.addAsset` won't run, but the function should return a value as normal.

## Differences from Bun

Macros via import attributes were originally implemented in [Bun](https://bun.sh/docs/bundler/macros). Parcel's implementation is compatible with Bun's macro API for the most part, but there are a few differences:

* Parcel supports returning functions from macros.
* Parcel supports a `this` context in macros to enable generating assets and controlling caching behavior.
* Parcel does not currently support Bun's special-case return values for typed arrays, fetch `Response` objects, or `Blob` objects. You'll need to convert these to a string yourself before returning them from a macro.
* Parcel does not currently support the `"macro"` package.json `exports` condition.
