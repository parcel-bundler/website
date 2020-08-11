---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-reporter
  title: Reporter
  order: 10
summary: "A plugin type: Listen to events of the build"
---

Reporters receive events as they happen and can output to stdout/stderr,
or perform other actions.

```js
import {Reporter} from '@parcel/plugin';

export default new Reporter({
  async report({ event: { type, ... } }) {
    // ...
  }
});
```

## Relevant API

{% include "../../api/reporter.html" %}
