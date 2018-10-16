# Babel

[Babel](https://babeljs.io) is a popular transpiler for JavaScript, with a large plugin ecosystem. Using Babel with Parcel works the same way as using it standalone or with other bundlers.

Install presets and plugins in your app:

```bash
yarn add @babel/preset-react
```

Then, create a `.babelrc`:

```json
{
  "presets": [
    "@babel/preset-react"
  ]
}
```

## Default babel transforms

Parcel transpiles your code with `@babel/preset-env` by default, this is to transpile every module both internal (local requires) and external (node_modules) to match the defined target.

For the `browser` target it utilises [browserslist](https://github.com/browserslist/browserslist), the target browserlist can be defined in `package.json` (`engines.browsers` or `browserslist`) or using a configuration file (`browserslist` or `.browserslistrc`).

The browserlist target defaults to: `> 0.25%` (Meaning, support every browser that has 0.25% or more of the total amount of active web users)

For the `node` target, Parcel uses the `engines.node` defined in `package.json`, this default to *node 8*.
