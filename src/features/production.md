---
layout: layout.njk
eleventyNavigation:
  key: features-production
  title: 🏭 Production
  order: 8
summary: How Parcel helps you optimizing your project for production
---

TODO

## Inspecting bundle size

Parcel has builtin plugins for a few tools to help with analyzing bundle size.

### Bundle Analyzer

To generate a HTML file for every bundle, set the `PARCEL_BUNDLE_ANALYZER` environment variable.

{% sample "PARCEL_BUNDLE_ANALYZER=1 parcel build src/index.html" %}
{% endsample %}

This generates a folder `parcel-bundle-reports` in your project root with an HTML file for every target:

<div style="border: 1px solid black">

![A screenshot of the bundle analyzer output](/assets/bundle-analyzer.png)

</div>

### Bundle Buddy

Set the `BUNDLE_BUDDY` environment variable

{% sample "BUNDLE_BUDDY=1 parcel build src/index.html" %}
{% endsample %}

and use the files (in the dist directory) on [the Bundle Buddy website](https://bundle-buddy.com/parcel).

<div style="border: 1px solid black">

![A screenshot of the Bundle Buddy website with a loaded project](/assets/bundle-buddy.png)

</div>
