---
layout: layout.njk
eleventyNavigation:
  key: getting-started-no-configuration
  title: 🗒️ (No) configuration
  order: 3
summary: How far you can get without any configuration and how to configure Parcel
---

(The meaning of `~` in this section is described in [Module Resolution](/features/module-resolution/#tilde-paths).)

### Targets

When Parcel runs, it can build your files in multiple different ways simultaneously. These are called [_targets_](/configuration/package-json/#targets).

For example, you could have a "modern" target that targets newer browsers and a "legacy" target for older browsers.

Every entrypoint will be processed (and output) once per target.

### Specifying Entrypoints

These are the files that contain the source code to your app before being
compiled by Parcel and are picked up by:

1. [`$ parcel <entries>`](/features/cli/)
2. `$ parcel <folder(s)>` uses [`<folder>/package.json#source`](/configuration/package-json/#source) or [`<folder>/package.json#targets.*.source`](/configuration/package-json/#targets) (respectively)
3. `./src/index.*`
4. `./index.*`

From there, everything those assets depend on will be considered a "source" in
Parcel.

### Setting the output path

The path where the output bundles should be placed can be specified (in order of precedence):
- using a top-level field in `package.json` (see [common targets](/configuration/package-json/#main-%2F-module-%2F-browser) and [custom targets](/configuration/package-json/#custom-targets)),
- using [`targets.*.distDir`](/configuration/package-json/#targets) or
- the [`--dist-dir`](</features/cli/#parameters-specific-to-the-non-server-commands-(watch-and-build)>) CLI parameter.

The default value for the output folder

- for common targets is `path.dirname(package.json#${targetName})`,
- for custom targets is `path.dirname(package.json#${targetName})` or `~/dist/${targetName}/`.

The implicit default target has the output folder `~/dist/`.

With multiple entrypoints, you should use an explicit `distDir` as opposed to the top-level target fields because Parcel wouldn't know which bundle should have the specified name:

{% sample "a.html b.html" %}
{% samplefile "package.json" %}

```json
{
  "targets": {
    "app": {
      "distDir": "./www"
    }
  }
}
```

{% endsamplefile %}
{% endsample %}

### Environments

Environments tell Parcel how to transform and bundle each asset. They tell
Parcel if an asset is going to be run in a browser or in Node/Electron.

They also tell Parcel's plugins what their output should be by specifying which
browsers (-versions) your build is targeting
(e.g. [Babel](http://babeljs.io/docs/en/babel-preset-env#targetsbrowsers) or
[Autoprefixer](https://github.com/postcss/autoprefixer#browsers)).

You can configure environments through [`targets#context` and `targets#engines`](/configuration/package-json/#targets) and [`engines / browserslist`](/configuration/package-json/#engines-%2F-browserslist).

### Configuring Parcel

When you do need to configure Parcel, it will be in one of 3 places.

- If you need to configure the CLI, it will be a [CLI flag](/features/cli/)
- If you need to configure your package, it will be in the [`package.json`](/configuration/package-json/)
- If you need to configure something with your files or the Parcel asset
  pipeline, it will be in [`.parcelrc`](/configuration/plugin-configuration/)
