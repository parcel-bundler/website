---
layout: layout.njk
eleventyNavigation:
  key: features-production
  title: 🏭 Production
  order: 8
summary: How Parcel helps you optimizing your project for production
---

See [Scope hoisting](/features/scope-hoisting/) for how to optimize your code for tree shaking.

## Inspecting bundle size

Parcel has builtin plugins for a few tools to help with analyzing bundle size.

### Bundle Analyzer

To generate a HTML file for every bundle, run the `@parcel/reporter-bundle-analyzer` plugin (eith with the `--reporter` flag or via `"reporters"` in .parcelrc):

{% sample "parcel build src/index.html --reporter @parcel/reporter-bundle-analyzer" %}
{% endsample %}

This generates a folder `parcel-bundle-reports` in your project root with an HTML file for every target:

<div style="border: 1px solid black">

![A screenshot of the bundle analyzer output](/assets/bundle-analyzer.png)

</div>

### Bundle Buddy

{% sample "parcel build src/index.html --reporter @parcel/reporter-bundle-buddy" %}
{% endsample %}

Upload the files in the dist directory on [the Bundle Buddy website](https://bundle-buddy.com/parcel).

<div style="border: 1px solid black">

![A screenshot of the Bundle Buddy website with a loaded project](/assets/bundle-buddy.png)

</div>
