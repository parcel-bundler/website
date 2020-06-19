---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-resolver
  title: Resolver
  order: 4
summary: "A plugin type: Turn dependency requests into absolute paths (or exclude them)"
---

Resolvers get called with an asset request (consisting of a source file path
and the specifier of what is being requested) which it then attempts to
resolve. If the resolver isn't sure how to handle a request, it can also return
`null` and pass it to the next resolver in the chain.

```js
import { Resolver } from "@parcel/plugin";

export default new Resolver({
  async resolve({ filePath, dependency }) {
    if (!shouldHandle(filePath)) {
      return null;
    }
    // ...
    return {
      filePath: doResolve({ from: filePath, to: dependency.moduleSpecifier }),
    };
  },
});
```

The [result object](/plugin-system/api/#ResolveResult) can also contain `sideEffects` (which corresponds to `package.json#sideEffects`) `code` (used instead of `fs.readFile(filePath)`) and `isExcluded` (e.g. to exclude `node_modules`).

## Relevant API

{% include "../../api/resolver.html" %}
