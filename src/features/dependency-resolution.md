---
layout: layout.njk
title: Dependency resolution
eleventyNavigation:
  key: features-dependency-resolution
  title: 📔 Dependency resolution
  order: 3
---

As Parcel builds your source code, it discovers **dependencies**, which allow code to be broken into separate files and reused in multiple places. Dependencies describe where to find the file containing the code you rely on, as well as metadata about how to build it.

## Dependency specifiers

A **dependency specifier** is a string that describes the location of a dependency relative to the file that imports it. For example, in JavaScript the `import` statement or `require` function may be used to create dependencies. In CSS, `@import` and `url()` may be used. Typically, these dependencies do not specify a full absolute path, but rather a shorter specifier that is resolved to an absolute path by Parcel and other tools.

Parcel implements an enhanced version of the [Node module resolution algorithm](https://nodejs.org/api/modules.html#modules_all_together). It is responsible for turning a dependency specifier into an absolute path that can be loaded from the file system. In addition to the standard dependency specifiers supported across many tools, Parcel also supports some additional specifier types and features.

### Relative specifiers

Relative specifiers start with `.` or `..`, and resolve a file relative to the importing file.

{% sample %}
{% samplefile "/path/to/project/src/client.js" %}

```javascript
import './utils.js';
import '../constants.js';
```

{% endsamplefile %}
{% endsample %}

In the above example, the first import would resolve to `/path/to/project/src/utils.js` and the second would resolve to `/path/to/project/constants.js`.

#### File extensions

It is recommended to include the full file extension in all import specifiers. This both improves dependency resolution performance and reduces ambiguity.

That said, for compatibility with CommonJS in Node, and with TypeScript, Parcel allows the file extension to be omitted for certain file types. The file extensions that may be omitted include `.ts`, `.tsx`, `.js`, `.jsx`, and `.json`. A file extension is required to import all other file types.

The following example resolves to the same files as above.

{% sample %}
{% samplefile "/path/to/project/src/client.js" %}

```javascript
import './utils';
import '../constants';
```

{% endsamplefile %}
{% endsample %}

Note that these may only be omitted when importing from a JavaScript or TypeScript file. File extensions are always required for dependencies defined in other file types like HTML and CSS.

#### Directory index files

In JavaScript, Typescript, and other JS-based languages, dependency specifiers may resolve to a directory rather than a file. If the directory contains a `package.json` file, the main entry will be resolved as described in the [Package entries](#package-entries) section. If no `package.json` is present, it will attempt to resolve to an index file within the directory, such as `index.js` or `index.ts`. All extensions listed above are supported for index files.

{% sample %}
{% samplefile "/path/to/project/src/app.js" %}

```javascript
import './client';
```

{% endsamplefile %}
{% endsample %}

For example, if `/path/to/project/src/client` were a directory, the above specifier could resolve to `/path/to/project/src/client/index.js`.

### Bare specifiers

Bare specifiers start with any character except `.`, `/`, or `~`. In JavaScript, TypeScript, and other JS-based languages, they resolve to a package in `node_modules`. For other types of files, such as HTML and CSS, bare specifiers are treated the same way as [relative specifiers](#relative-specifiers).

{% sample %}
{% samplefile "/path/to/project/src/client/index.js" %}

```javascript
import 'react';
```

{% endsamplefile %}
{% endsample %}

In the above example, `react` may resolve to something like `/path/to/project/node_modules/react/index.js`. The exact location will depend on the location of the `node_modules` directory, as well as configuration within the package.

`node_modules` directories are searched upwards from the importing file. The search stops at the project root directory. For example, if the importing file was at `/path/to/project/src/client/index.js` the following locations would be searched:

- `/path/to/project/src/client/node_modules/react`
- `/path/to/project/src/node_modules/react`
- `/path/to/project/node_modules/react`

Once a module directory is found, the package entry is resolved. See [Package entries](#package-entries) for more details on this process.

#### Package sub-paths

Bare specifiers may also specify a sub-path within a package. For example, a package may publish multiple entry points rather than only a single one.

```javascript
import 'lodash/clone';
```

The above example resolves `lodash` within a `node_modules` directory as described above, and then resolves the `clone` module within the package rather than its main entrypoint. This could be a `node_modules/lodash/clone.js` file, for example.

#### Builtin modules

Parcel includes shims for many builtin Node.js modules, e.g. `path` and `url`. When a dependency specifier references one of these module names, the builtin module is preferred over any module installed in `node_modules` with the same name. When building for a node environment, builtin modules are excluded from the bundle, otherwise a shim is included. See the [Node docs](https://nodejs.org/dist/latest-v16.x/docs/api/) for a full list of builtin modules.

When building for an Electron environment, the `electron` module is also considered a builtin and excluded from the bundle.

### Absolute specifiers

Absolute specifiers start with `/`, and resolve a file relative to the project root. The **project root** is the base directory of your project, which would typically contain a package manager lock file (e.g. `yarn.lock` or `package-lock.json`), or a source control directory (e.g. `.git`). Absolute specifiers could be useful to avoid very long relative paths in deeply nested hierarchies.

```javascript
import '/src/client.js';
```

The above example could be placed in any file, at any point in your project’s directory structure, and will always resolve to `/path/to/project/src/client.js`.

### Tilde specifiers

Tilde specifiers start with `~`, and resolve relative to the nearest package root from the importing file. A **package root** is a directory with a `package.json` file, which would typically be found in `node_modules`, or as the root of a package in a monorepo. Tilde specifiers are useful for similar purposes as absolute specifiers, but are more useful when you have more than one package.

{% sample %}
{% samplefile "/path/to/project/packages/frontend/src/client/index.js" %}

```javascript
import '~/src/utils.js';
```

{% endsamplefile %}
{% endsample %}

The above example would resolve to `/path/to/project/packages/frontend/src/utils.js`.

### Query parameters

Dependency specifiers may also include query parameters, which specify transformation options for the resolved file. For example, you can specify the width and height to resize an image when loading it.

```css
.logo {
  background: url(logo.png?width=400&height=400);
}
```

See the [Image transformer](/recipes/image/) docs for more details on images. You can also use query parameters in custom [Transformer](/plugin-system/transformer/) plugins.

{% note %}

**Note**: Query parameters are not supported for CommonJS specifiers (created by the `require` function).

{% endnote %}

### URL schemes

Dependency specifiers may use URL schemes to target [Named pipelines](/features/plugins/#named-pipelines). These allow you to specify a different pipeline to compile a file with than the default one. For example, the `bundle-text:` scheme can be used to inline a compiled bundle as text. See [Bundle inlining](/features/bundle-inlining/) for more details.

There are a few reserved URL schemes that may not be used for named pipelines, and have builtin behavior.

- `node:` – an alternative way of specifying a builtin Node module. See [Builtin modules](#builtin-modules).
- `npm:` – a way for URL dependencies (e.g. in HTML, CSS, or web workers) to import files from a `node_modules` package.
- `http:` and `https:` – a fully qualified URL dependency. These are resolved at runtime, and left untouched by Parcel.
- `data:` – A [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) including the dependency source code inline. Currently not implemented by Parcel, but reserved for future use.
- `file:` – A [file URL](https://datatracker.ietf.org/doc/html/rfc8089). Reserved for future use.
- `mailto:` and `tel:` - Commonly used URL schemes. These are left untouched by Parcel.

### Glob specifiers

Parcel supports importing multiple files at once via globs, however, since glob imports are non-standard, they are not included in the default Parcel config. To enable them, add `@parcel/resolver-glob` to your `.parcelrc`.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": "@parcel/config-default",
  "resolvers": ["@parcel/resolver-glob", "..."]
}
```

{% endsamplefile %}
{% endsample %}

Once enabled, you can import multiple files using a specifier like `./files/*.js`. This returns an object with keys corresponding to the files names.

```javascript
import * as files from './files/*.js';
```

is equivalent to:

```javascript
import * as foo from './files/foo.js';
import * as bar from './files/bar.js';

let files = {
  foo,
  bar
};
```

Specifically, the dynamic parts of the glob pattern become keys of the object. If there are multiple dynamic parts, a nested object will be returned. For example, if a `pages/profile/index.js` file existed, the following would match it.

```javascript
import * as pages from './pages/*/*.js';

console.log(pages.profile.index);
```

This also works with URL schemes like `bundle-text:`, as well as with dynamic import. When using dynamic import, the resulting object will include a mapping of filenames to functions. Each function can be called to load the resolved module. This means that each file is loaded on demand rather than all up-front.

```javascript
let files = import('./files/*.js');

async function doSomething() {
  let foo = await files.foo();
  let bar = await files.bar();
  return foo + bar;
}
```

Glob imports also work with CSS:

```css
@import "./components/*.css";
```

is equivalent to:

```css
@import "./components/button.css";
@import "./components/dropdown.css";
```

## Package entries

When resolving a package directory, the `package.json` file is consulted to determine the package entry. Parcel checks the following fields (in order):

- `source` – If the module is behind a symlink (e.g. in a monorepo, or via `npm link`), then Parcel uses the `source` field to compile the module from source. The `source` field can also be used as an alias mapping if a package has multiple entry points – see [Aliases](#aliases) below for details.
- `browser` – A browser-specific version of a package. If building for a [browser environment](/features/targets/#environments), the browser field overrides other fields. The `browser` field can also be used as an alias mapping if a package has multiple entry points – see [Aliases](#aliases) below for details.
- `module` – An ES module version of the package.
- `main` – A CommonJS version of the package.

If none of these fields are set, or the files they point to do not exist, then resolution falls back to an index file. See [Directory index files](#directory-index-files) for more details.

## Aliases

An alias can be used to override the normal resolution of a dependency. For example, you may want to override a module with a different but API-compatible replacement, or map a dependency to a global variable defined by a library loaded from a CDN.

Aliases are defined via the `alias` field in package.json. They can be defined either locally in the nearest `package.json` to the source file containing the dependency, or globally in the `package.json` in the project root directory. Global aliases apply to all files and packages in the project, including those in `node_modules`.

### Package aliases

Package aliases map a `node_modules` dependency to a different package, or to a local file within your project. For example, to replace `react` and `react-dom` with Preact across both files in your project as well as any other libraries in `node_modules`, you could define a global alias in the `package.json` in your project root directory.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "alias": {
    "react": "preact/compat",
    "react-dom": "preact/compat"
  }
}
```

{% endsamplefile %}
{% endsample %}

You can also map a module to a file within your project by using a relative path from the `package.json` in which the alias is defined.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "alias": {
    "react": "./my-react.js"
  }
}
```

{% endsamplefile %}
{% endsample %}

Aliasing only certain [sub-paths](#package-sub-paths) of a module is also supported. This example will alias `lodash/clone` to `tiny-clone`. Other imports within the `lodash` package will be unaffected.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "alias": {
    "lodash/clone": "tiny-clone"
  }
}
```

{% endsamplefile %}
{% endsample %}

This also works the other way: if an entire module is aliased, then any sub-path imports of that package will be resolved within the aliased module. For example, if you aliased `lodash` to `my-lodash` and imported `lodash/clone`, this would resolve to `my-lodash/clone`.

### File aliases

Aliases can also be defined as relative paths to replace a specific file within a package with a different file. This can be done using the `alias` field to replace the file unconditionally, or with the `source` or `browser` fields to do conditionally. See [Package entries](#package-entries) above for details about these fields.

For example, to replace a certain file with a browser-specific version, you could use the `browser` field.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "browser": {
    "./fs.js": "./fs-browser.js"
  }
}
```

{% endsamplefile %}
{% endsample %}

Now, if `my-module/fs.js` is imported in a browser environment, they'll actually get `my-module/fs-browser.js`. This applies both to imports from outside (e.g. [package sub-paths](#package-sub-paths)), as well as internally within the module.

### Glob aliases

File aliases can also be defined using globs, which allows replacing many files using a single pattern.  The replacement can include patterns such as `$1` to access the captured glob matches. This can be done using the `alias` field to replace files unconditionally, or with the `source` or `browser` fields to do conditionally. See [Package entries](#package-entries) above for details about these fields.

For example, you could use the `source` field to provide a mapping between compiled code in a package and the original source code. When the module is symlinked, or within a monorepo, this will allow Parcel to compile the module from source rather than use the pre-compiled version.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "source": {
    "./dist/*": "./src/$1"
  }
}
```

{% endsamplefile %}
{% endsample %}

Now, any time a file in the `dist` directory is imported, the corresponding file in the `src` folder will be loaded instead.

### Shim aliases

Files or packages can be aliased to `false` to be excluded from the build, and replaced with an empty module. This could be useful to exclude certain modules from browser builds that only work in Node.js, for example.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "alias": {
    "fs": false
  }
}
```

{% endsamplefile %}
{% endsample %}

### Global aliases

Files or packages may also be aliased to global variables that will be defined at runtime. For example, a particular library may be loaded from a CDN. Rather than bundling it, any time a dependency on that library is resolved, it will be replaced with a reference to that global variable instead of being bundled.

This can be done by creating an alias to an object with a `global` property. The following example aliases the `jquery` dependency specifier to the global variable `$`.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "alias": {
    "jquery": {
      "global": "$"
    }
  }
}
```

{% endsamplefile %}
{% endsample %}

## Configuring other tools

This section covers how to configure other tools to work with Parcel’s extensions to the Node resolution algorithm.

### TypeScript

TypeScript will need to be configured to support Parcel features like absolute and tilde dependency specifiers, and aliases. This can be done using the `paths` option in `tsconfig.json`. See the [TypeScript Module Resolution docs](https://www.typescriptlang.org/docs/handbook/module-resolution.html) for more information.

For example, to map tilde paths to the root directory, this configuration could be used:

{% sample %}
{% samplefile "tsconfig.json" %}

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~*": ["./*"]
    }
  }
}
```

{% endsamplefile %}
{% endsample %}

Support for [URL schemes](#url-schemes) can also be enabled by creating an [ambient module](https://www.typescriptlang.org/docs/handbook/modules.html#ambient-modules) declaration in your project. For example, to map dependencies loaded with the `bundle-text:` scheme to a string, you could use the following declaration. This can be placed in a file such as `parcel.d.ts` anywhere in your project.

{% sample %}
{% samplefile "parcel.d.ts" %}

```typescript
declare module 'bundle-text:*' {
  const value: string;
  export default value;
}
```

{% endsamplefile %}
{% endsample %}

### Flow

Flow needs to be configured to support absolute and tilde specifiers, and aliases. This can be done using the [module.name_mapper](https://flow.org/en/docs/config/options/#toc-module-name-mapper-regex-string) feature in your `.flowconfig`.

For example, to map absolute specifiers to resolve from the project root, this configuration could be used:

{% sample %}
{% samplefile ".flowconfig" %}

```
[options]
module.name_mapper='^\/\(.*\)$' -> '<PROJECT_ROOT>/\1'
```

{% endsamplefile %}
{% endsample %}

To enable [URL schemes](#url-schemes), you'll need to create a mapping to a `.flow` [declaration file](https://flow.org/en/docs/declarations/) which exports the expected type. For example, to map dependencies loaded with the `bundle-text:` scheme to a string, you could create a file called `bundle-text.js.flow` and map all dependencies referencing the scheme to it.

{% sample %}
{% samplefile "bundle-text.js.flow" %}

```javascript
// @flow
declare var value: string;
export default value;
```

{% endsamplefile %}
{% samplefile ".flowconfig" %}

```
[options]
module.name_mapper='^bundle-text:.*$' -> '<PROJECT_ROOT>/bundle-text.js'
```

{% endsamplefile %}
{% endsample %}
