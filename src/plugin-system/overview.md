---
layout: layout.njk
title: Plugin System Overview
eleventyNavigation:
  key: plugin-system-overview
  title: Overview
  order: 1
summary: A high-level overview over the plugin system
---

<figure>
  <a href="/assets/diagram-plugin-system.opt.png" target="_blank">
    <img class="img-plugin-diagram" alt="A diagram of the Parcel plugin system" src="/assets/diagram-plugin-system.opt.png"/>
  </a>
</figure>

## Parcel Architecture

Even if you aren't doing anything that complex, if you are going to use Parcel
a lot it makes sense to take some time and understand how it works.

### Phases of Parcel

At a high level Parcel runs through several phases:

- Resolving
- Transforming
- Bundling
- Naming
- Packaging
- Optimizing
- Compressing

The **resolving** and **transforming** phases work together in parallel to
build a graph of all your assets.

The asset graph gets translated into bundles in the **bundling** phase. The output filename of each bundle is determined in the **naming** phase.

Then, the **packaging**, **optimizing**, and **compressing** phases work together to generate the final contents of every bundle, in parallel.

The **packaging** phase merges the assets in each bundle together into output files.

The **optimizing** phase transforms the contents of each bundle. When this is done, Parcel determines the content hashes of each bundle, which are applied to the final output filenames.

Finally, the **compressing** phase generates one or more encodings for each output file as they are being written to the file system.

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

### Complete List of Plugin Types

- [Transformer](/plugin-system/transformer): Converts an asset (into another asset) <br>
  _Example: convert Typescript to JavaScript (per file)_
- [Resolver](/plugin-system/resolver): Turns dependency requests into absolute paths (or exclude them) <br>
  _Example: add your own syntax for imports, e.g. `import "^/foo"`_
- [Bundler](/plugin-system/bundler): Turns an asset graph into a bundle graph <br>
  _Example: create a bundler that does vendoring (splitting app and node_modules code)_
- [Namer](/plugin-system/namer): Generates a filename (or filepath) for a bundle <br>
  _Example: place output bundles in a hierarchical file structure, omit hashes in bundle names_
- [Runtime](/plugin-system/runtime): Programmatically inserts (synthetic) assets into bundles" <br>
  _Example: add analytics to every bundle_
- [Packager](/plugin-system/packager): Turns a group of assets (bundle) into a bundle file" <br>
  _Example: concatenate all input CSS files into a CSS bundle_
- [Optimizer](/plugin-system/optimizer): Applies modifications to the finished bundle (similar to a transformer) <br>
  _Example: run a minifier or convert into a data-url for inline usage_
- [Compressor](/plugin-system/compressor): Compresses or encodes bundles in one or more ways <br>
  _Example: compress a bundle with Gzip_
- [Validator](/plugin-system/validator): Analyzes assets and emit warnings and errors <br>
  _Example: do type-checking (TypeScript, Flow)_
- [Config](/features/plugins/): A reuseable '.parcelrc' package <br>
  _Example: provide a tailor-made parcel config for your boilerplate_ <br>
- [Reporter](/plugin-system/reporter): Listens to events of the build <br>
  _Example: generate a bundle report, run a dev server_
