---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-data-structures
  title: Data Structures
  order: 14
summary: A high-level description of the important data structures
---

TODO

{% note %}

This is not intended to be an API documentation but rather introduces the concepts behind these types so that reading the API definition doesn't leave you puzzled.

{% endnote %}

##### Asset 
Any file supported by Parcel, such as JS, CSS, or HTML.

##### Dependency
When a file depends on or requires other files, those imports are dependencies.

##### AssetGraph
Graph data structure representing all assets and their dependencies on one another.

##### Bundle
Groupings of assets that get placed together in a single file. Bundles will (generally) contain only assets in the same language.

##### BundleGraph
Graph data structure containing bundles including their assets and dependencies.
