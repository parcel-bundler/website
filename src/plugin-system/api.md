---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-api
  title: API
  order: 17
summary: "The remaining types specified in `@parcel/plugin`"
---

{% note %}
The most important data types are listed on the page of the relevant plugin type.
{% endnote %}

<!-- TODO(v3): api/*.html is the generated v2 API reference (from packages/core/types/index.js, Logger.js, diagnostic.js and the @parcel/source-map repo) and must be regenerated from packages-v3/plugin/src/types.ts. generate-api-docs parses Flow (TypeAlias/InterfaceDeclaration/ObjectTypeAnnotation via @babel/parser "flow"), so it needs to switch to the "typescript" parser plugin and TS node types, point at the new file, drop the logger/diagnostic/source-map inputs, and update SECTION_TO_URL (no packager/runtime/validator/compressor pages; types.ts tags Bundle/BundleGraph with @section bundler). types.ts already uses the same JSDoc @section tags. Native plugin APIs (Rust/Go/Swift) are not covered by it. -->

{% include "../../api/index.html" %}
