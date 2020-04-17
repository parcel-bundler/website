---
layout: layout.njk
override:eleventyNavigation:
  key: Plugin System
  title: 🔌 Plugin System
  order: 4
summary: A brief overview over the plugin system
---

<figure>
  <div style="overflow-x: auto;">
    <img style="height: 35rem; max-height: 65vh; max-width: none;" src="./full_diagram.opt.png"/>
  </div>
  <figcaption style="text-align: center;">

_Scroll to the right to see more_

  </figcaption>
</figure>

### List of Plugin Types (in a somewhat correct order)

- [Transformer](transformer): Convert an asset (into another asset) <br>
  _Example: convert Typescript to Javascript (per file)_
- [Resolver](resolver): Turn dependency requests into absolute paths (or exclude them) <br>
  _Example: add your own syntax for imports, e.g. `import "^/foo"`_
- [Bundler](bundler): Turns an asset graph into a bundle graph <br>
  _Example: create a bundler that does Vendoring (splitting app and node_modules code)_
- [Runtime](runtime): Programatically insert (synthetic) assets into bundles" <br>
  _Example: add analytics to every bundle_
- [Packager](packager): Turn a group of assets (bundle) into a bundle file" <br>
  _Example: concatenate all input CSS files into a CSS bundle_
- [Optimizer](optimizer): Apply modifications to the finished bundle (similar to a transformer) <br>
  _Example: run a minifier or convert into a data-url for inline usage_

<p></p> <!-- Force two lists -->

- [Validator](validator): Analyze assets and emit warnings and errors <br>
  _Example: do type-checking (Typescript, Flow)_
- [Config](config): A reuseable '.parcelrc' package <br>
  _Example: provide a tailor-made parcel config for your boilerplate_ <br>
- [Reporter](reporter): Listen to events of the build <br>
  _Example: generate a bundle report, run a dev server_

_For plugin authors: [a high-level overview over the plugin API](data-structures)_
