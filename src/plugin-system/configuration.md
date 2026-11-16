# Configuration

Parcel configuration can be shared between projects by publishing a [`.parcelrc`](../features/plugins.md) file in a package on npm. This also allows multiple plugins to be distributed together.

## Shared configuration

This example shows how a company might distribute a shared Parcel configuration to be used between projects. It extends `@parcel/config-default` and adds several additional plugins.

<code-sample>
<code-file name="package.json">

```json
{
  "name": "@company/parcel-config",
  "main": "index.json",
  "version": "1.0.0",
  "engines": {
    "parcel": "^3.0.0-0"
  }
}
```

</code-file>
<code-file name="index.json">

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.svg": ["...", "@parcel/transformer-svg-jsx"]
  },
  "namers": ["@company/parcel-namer", "..."],
  "reporters": ["...", "@company/parcel-reporter"]
}
```

</code-file>
</code-sample>

## Multi-plugin packages

In addition to sharing configuration between projects, Parcel config packages are also useful to distribute multiple plugins that are required to work together. For example, a transformer and optimizer combination may be needed for a new file format.

<p-note>

**Note**: In this case, it's best to not extend the default Parcel config and allow users of your config package to choose which default to extend from.

</p-note>

<code-sample>
<code-file name="package.json">

```json
{
  "name": "parcel-config-xyz",
  "main": "index.json",
  "version": "1.0.0",
  "engines": {
    "parcel": "^3.0.0-0"
  }
}
```

</code-file>
<code-file name="index.json">

```json
{
  "transformers": {
    "*.xyz": ["parcel-transformer-xyz"]
  },
  "optimizers": {
    "*.xyz": ["parcel-optimizer-xyz"]
  }
}
```

</code-file>
</code-sample>

Once published, users can now consume `parcel-config-xyz` in their projects by extending it in addition to the default config of their choice.

<code-sample>
<code-file name=".parcelrc">

```json
{
  "extends": ["@parcel/config-default", "parcel-config-xyz"]
}
```

</code-file>
</code-sample>
