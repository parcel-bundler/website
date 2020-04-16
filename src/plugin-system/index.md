---
layout: layout.njk
override:eleventyNavigation:
  key: Plugin System
  title: 🔌 Plugin System
  order: 4
summary: A brief overview over the plugin system
---


<div style="overflow-x: auto;">
  <img style="height: 35rem; max-height: 65vh; max-width: none;" src="./full_diagram.opt.png"/>
</div>

*Scroll to the right to see more*

### List of Plugin Types (in a somewhat correct order)

- [Transformer](transformer): Convert an asset (into another asset) <br>
  *Example: convert Typescript to Javascript (per file)*
- [Resolver](resolver): Turn dependency requests into absolute paths (or exclude them) <br>
  *Example: add your own syntax for imports, e.g. `import "^/foo"`*
- [Bundler](bundler): Turns an asset graph into a bundle graph <br>
  *Example: create a bundler that does Vendoring (splitting app and node_modules code)*
- [Runtime](runtime): Programatically insert (synthetic) assets into bundles" <br>
  *Example: add analytics to every bundle*
- [Packager](packager): Turn a group of assets (bundle) into a bundle file" <br>
  *Example: concatenate all input CSS files into a CSS bundle*
- [Optimizer](optimizer): Apply modifications to the finished bundle (similar to a transformer) <br>
  *Example: run a minifier or convert into a data-url for inline usage*

<p></p> <!-- Force two lists -->

- [Validator](validator): Analyze assets and emit warnings and errors <br>
  *Example: do type-checking (Typescript, Flow)*
- [Config](config): A reuseable '.parcelrc' package <br>
  *Example: provide a tailor-made parcel config for your boilerplate* <br>
- [Reporter](reporter): Listen to events of the build
  *Example: generate a bundle report, run a dev server*


*For plugin authors: [a high-level overview over the plugin API](data-structures)*
