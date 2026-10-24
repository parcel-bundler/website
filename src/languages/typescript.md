---
layout: layout.njk
title: TypeScript
eleventyNavigation:
  key: languages-typescript
  title: <img src="/assets/lang-icons/typescript.svg" alt=""/> TypeScript
  order: 4
---

[TypeScript](https://www.typescriptlang.org/) is a typed superset of JavaScript that compiles to JavaScript. Parcel supports TypeScript out of the box without any additional configuration.

## Transpilation

Parcel automatically transpiles TypeScript whenever you use a `.ts` or `.tsx` file. In addition to stripping the types to convert TypeScript to JavaScript, Parcel also compiles modern language features like classes and async await as necessary, [according to your browser targets](/languages/javascript/#browser-compatibility). It also transpiles [JSX](/languages/javascript/#jsx) automatically. See the [Transpilation](/languages/javascript/#transpilation) section of the JavaScript docs for more details.

A `tsconfig.json` file can be used to configure some aspects of the transpilation. Currently, JSX options are supported (`jsx`, `jsxFactory`, `jsxFragmentFactory`, and `jsxImportSource`), as well as the `experimentalDecorators` and `useDefineForClassFields` options. If `useDefineForClassFields` is not set, it defaults to `true` when `target` is `ES2022` or higher. Settings from tsconfigs referenced via `extends` are also applied. See the [TSConfig reference](https://www.typescriptlang.org/tsconfig) for details.

{% sample %}
{% samplefile "tsconfig.json" %}

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "jsxImportSource": "preact"
  }
}
```

{% endsamplefile %}
{% endsample %}

### `isolatedModules`

Because Parcel processes each file individually, it implicitly enables the [`isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) option. This means that some TypeScript features like `const enum` that require cross-file type information to compile will not work. To be warned about usages of these features in your IDE and during type checking, you should enable this option in your `tsconfig.json`.

{% sample %}
{% samplefile "tsconfig.json" %}

```json
{
  "compilerOptions": {
    "isolatedModules": true
  }
}
```

{% endsamplefile %}
{% endsample %}

## Resolution

Parcel supports the `baseUrl`, `paths`, and `moduleSuffixes` options in `tsconfig.json`, which are TypeScript specific resolution extensions. See [TSConfig](/features/dependency-resolution/#tsconfig) in the dependency resolution docs for more details. You can also use Parcel's [tilde](/features/dependency-resolution/#tilde-specifiers) or [absolute](/features/dependency-resolution/#absolute-specifiers) specifiers. See [Configuring other tools](/features/dependency-resolution/#configuring-other-tools) for information about how to configure TypeScript to support these.

## Type checking

By default, Parcel does not perform any type checking. The recommended way to type check is by using an editor with TypeScript support (such as VSCode), and using `tsc` to type check your code in CI. You can configure this using npm scripts to run alongside your build, tests, and linting.

{% sample %}
{% samplefile "package.json" %}

```json/5
{
  "scripts": {
    "build": "parcel build src/index.ts",
    "test": "jest",
    "lint": "eslint",
    "check": "tsc --noEmit",
    "ci": "yarn build && yarn test && yarn lint && yarn check"
  }
}
```

{% endsamplefile %}
{% endsample %}
