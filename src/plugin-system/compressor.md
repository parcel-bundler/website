---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-compressor
  title: Compressor
  order: 10
---

Compressors receive a stream containing the final contents of bundles and source maps as they is being written. They return a new stream, which may transform the data in some way, and a `type` containing a file extension to append. If no `type` is returned, then the returned stream replaces the original file.

```js
import {Compressor} from '@parcel/plugin';

export default new Compressor({
  async compress({stream}) {
    return {
      stream: gzipStream(stream),
      type: 'gz'
    };
  },
});
```

## Relevant API

{% include "../../api/compressor.html" %}
