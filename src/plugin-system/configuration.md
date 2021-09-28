---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-configuration
  title: Configuration
  order: 13
---

Parcel configuration can be shared between projects by publishing a [`.parcelrc`](/features/plugins/) file in a package on npm. This also allows multiple plugins to be distributed together.

## Shared configuration

This example shows how a company might distribute a shared Parcel configuration to be used between projects. It extends `@parcel/config-default` and adds several additional plugins.

{% sample %}
{% samplefile "package.json" %}

```json
{
  "name": "@company/parcel-config",
  "main": "index.json",
  "version": "1.0.0",
  "engines": {
    "parcel": "2.x"
  }
}
```

{% endsamplefile %}
{% samplefile "index.json" %}

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.svg": ["...", "@parcel/transformer-svg-react"]
  },
  "namers": ["@company/parcel-namer", "..."],
  "compressors": {
    "*.{js,html,css}": [
      "...",
      "@parcel/compressor-gzip", 
      "@parcel/compressor-brotli"
    ]
  }
}
```

{% endsamplefile %}
{% endsample %}

## Multi-plugin packages

In addition to sharing configuration between projects, Parcel config packages are also useful to distribute multiple plugins that are required to work together. For example, a transformer and packager combination may be needed for a new file format.

{% note %}

**Note**: In this case, it's best to not extend the default Parcel config and allow users of your config package to choose which default to extend from.

{% endnote %}

{% sample %}
{% samplefile "package.json" %}

```json
{
  "name": "parcel-config-xml",
  "main": "index.json",
  "version": "1.0.0",
  "engines": {
    "parcel": "2.x"
  }
}
```

{% endsamplefile %}
{% samplefile "index.json" %}

```json
{
  "transformers": {
    "*.xml": ["parcel-transformer-xml"]
  },
  "packagers": {
    "*.xml": "parcel-packager-xml"
  }
}
```

{% endsamplefile %}
{% endsample %}

Once published, users can now consume `parcel-config-xml` in their projects by extending it in addition to the default config of their choice.

{% sample %}
{% samplefile ".parcelrc" %}

```json
{
  "extends": ["@parcel/config-default", "parcel-config-xml"]
}
```

{% endsamplefile %}
{% endsample %}
