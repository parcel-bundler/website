---
layout: layout.njk
eleventyNavigation:
  key: languages-typescript
  title: <img src="/assets/lang-icons/typescript.svg" alt=""/> TypeScript
  order: 2
summary: Explains the different ways TypeScript can be transpiled
---

Typescript works out of the box with Parcel, but you have multiple options:

## Babel

Babel can strip TypeScript type annotations using `@babel/preset-typescript`, this is the default way in which Parcel transpiles TypeScript because it is generally faster in our pipeline. There are however a few downsides to this:

- No type checking
- `tsconfig.json` is ignored, so language features like class properties, decorators need to be provided by a Babel plugin.
- `const enum` isn't supported

For a full list, take a look at the [Babel documentation](https://babeljs.io/docs/en/babel-plugin-transform-typescript#caveats).

## TypeScript's `tsc`

If you are using more advanced TypeScript features that include custom config settings in `tsconfig.js`, you can use the `@parcel/transformer-typescript-tsc` transformer which uses the offical TypeScript compiler:

{% sample %}
{% samplefile ".parcelrc" %}

```json/3
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{ts,tsx}": ["@parcel/transformer-typescript-tsc"]
  }
}
```

{% endsamplefile %}
{% endsample %}

Because Parcel processes each file individually, it implicitly sets `isolatedModules: true` in the tsc options, this comes with limitations as well, namely constant `const enum`s not being supported either.

- No type checking
- `const enum` isn't supported
- Some `tsconfig.json` options (such as `paths`) are currently not respected with the default config.

## Type Checking

Neither the Babel transformer nor the tsc transformer perform type checking, they merely strip the type annotations. The only builtin way to validate the types is to use the tsc validator which runs after the bundles are generated. You need to add a `tsconfig.json` file that includes your source files (although the validator still only runs on the assets that Parcel processed). TODO

{% sample %}
{% samplefile ".parcelrc" %}

```json/3
{
  "extends": "@parcel/config-default",
  "validators": {
    "*.{ts,tsx}": ["@parcel/validator-typescript"]
  }
}
```

{% endsamplefile %}
{% samplefile "tsconfig.json" %}

```json
{
  "include": ["src/**/*"],
  "compilerOptions": {
    "target": "es2021",
    "strict": true  
  }
}
```

{% endsamplefile %}
{% endsample %}

## Generating Typings

Parcel can extract the typings of your entry point by specifying `package.json#types` (an automatic target like `main`)

{% sample %}
{% samplefile "package.json" %}

```json/3
{
  "source": "src/index.ts",
  "module": "dist/index.js",
  "types": "dist/index.d.ts"
}
```

{% endsamplefile %}
{% endsample %}

(This functionality is provided by `@parcel/transformer-babel` or `@parcel/transformer-typescript-tsc`.)
