---
layout: layout.njk
eleventyNavigation:
  key: Resolver
  order: 2
summary: "A plugin type: Turn dependency requests into absolute paths (or exclude them)"
---

Resolvers get called with an asset request (consisting of a source file path
and the specifier of what is being requested) which it then attempts to
resolve. If the resolver isn't sure how to handle a request, it can also return
`null` and pass it to the next resolver in the chain.

```js
import { Resolver } from "@parcel/plugin";

export default new Resolver({
  async resolve({ dependency }) {
    // ...
    return { filePath } || null;
  },
});
```
