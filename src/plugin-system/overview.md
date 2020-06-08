---
layout: layout.njk
eleventyNavigation:
  title: Overview
  order: 1
summary: A high-level overview over the plugin system
---

<figure>
  <div style="overflow-x: auto;">
    <img class="img-plugin-diagram" style="height: 35rem; max-height: 65vh; max-width: none;" src="/assets/diagram-plugin-system.opt.png"/>
  </div>
  <figcaption style="text-align: center;">

_Scroll to the right to see more_

  </figcaption>
</figure>

## Parcel Architecture

Even if you aren't doing anything that complex, if you are going to use Parcel
a lot it makes sense to take some time and understand how it works.

### Phases of Parcel

At a high level Parcel runs through several phases:

- Resolving
- Transforming
- Bundling
- Packaging
- Optimizing
- (Validating)

The **resolving** and **transforming** phases work together in parallel to
build a graph of all your assets.

This asset graph gets translated into bundles in the **bundling** phase.

Then the **packaging** phase takes the assets in the calculated bundles and
merges them together into files each containing an entire bundle.

Finally, in the **optimizing** phase, Parcel takes these bundles files and runs
them through optimizing transforms.

### Asset Graph

During the resolving and transforming phases, Parcel discovers all the assets
in your app or program. Every asset can have its own dependencies on other
assets which Parcel will pull in.

The data structure that represents all of these assets and their dependencies
on one another is called the "Asset Graph".

### Bundle Graph

Once Parcel has built the entire Asset Graph, it begins turning it into
"bundles". These bundles are groupings of assets that get placed together in a
single file. Bundles will (generally) contain only assets in the same language.

Some assets are considered "entry" points into your app, and will stay as
separate bundles. For example, if your `index.html` file links to an
`about.html` file, they won't be merged together.

### Complete List of Plugin Types (in a somewhat correct order)

- [Transformer](transformer): Converts an asset (into another asset) <br>
  _Example: convert Typescript to Javascript (per file)_
- [Resolver](resolver): Turns dependency requests into absolute paths (or exclude them) <br>
  _Example: add your own syntax for imports, e.g. `import "^/foo"`_
- [Bundler](bundler): Turns an asset graph into a bundle graph <br>
  _Example: create a bundler that does Vendoring (splitting app and node_modules code)_
- [Namer](namer): Generates a filename (or filepath) for a bundle <br>
  _Example: create a bundler that does Vendoring (splitting app and node_modules code)_
- [Runtime](runtime): Programatically inserts (synthetic) assets into bundles" <br>
  _Example: add analytics to every bundle_
- [Packager](packager): Turns a group of assets (bundle) into a bundle file" <br>
  _Example: concatenate all input CSS files into a CSS bundle_
- [Optimizer](optimizer): Applies modifications to the finished bundle (similar to a transformer) <br>
  _Example: run a minifier or convert into a data-url for inline usage_

<p></p> <!-- Force two lists -->

- [Validator](validator): Analyzes assets and emit warnings and errors <br>
  _Example: do type-checking (Typescript, Flow)_
- [Config](config): A reuseable '.parcelrc' package <br>
  _Example: provide a tailor-made parcel config for your boilerplate_ <br>
- [Reporter](reporter): Listens to events of the build <br>
  _Example: generate a bundle report, run a dev server_
