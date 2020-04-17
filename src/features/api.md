---
layout: layout.njk
eleventyNavigation:
  key: API
  title: 📚 API
  order: 1
summary: How to use @parcel/core programatically
---

### A minimal example (or "What the `parcel` CLI does")

{% sample %}
{% samplefile %}

```js
import path from "path";
import defaultConfig from "@parcel/config-default";
import Parcel from "@parcel/core";

let bundler = new Parcel({
  entries: path.join(__dirname, "src/index.js"),
  defaultConfig: {
    ...defaultConfig,
    filePath: require.resolve("@parcel/config-default"),
  },
  defaultEngines: {
    browsers: ["last 1 Chrome version"],
    node: "10",
  },
});

await bundler.run();
```

{% endsamplefile %}
{% endsample %}

### Outputting to an in-memory file system


{% sample %}
{% samplefile %}

```js
import path from "path";
import Parcel, { createWorkerFarm } from "@parcel/core";
import defaultConfigContents from "@parcel/config-default";
import { NodeFS, MemoryFS } from "@parcel/fs";

let workerFarm = createWorkerFarm();
let inputFS = new NodeFS();
let outputFS = new MemoryFS(workerFarm);

let b = new Parcel({
  entries: [path.join(__dirname, "src", "index.html")],
  defaultConfig: {
    ...defaultConfigContents,
    filePath: require.resolve("@parcel/config-default"),
  },
  inputFS: inputFS,
  outputFS: outputFS,
  workerFarm,
  defaultEngines: {
    browsers: ["last 1 Chrome version"],
    node: "8",
  },
  serve: { port: 8000, host: "localhost" }
});

await b.build();

for (let file of outputFS.readdir("/")) { // TODO ?
  console.log(file, await outputFS.readFile(file, "utf8"));
}

await workerFarm.end();
```

{% endsamplefile %}
{% endsample %}
