---
layout: layout.njk
eleventyNavigation:
  key: features-parcel-api
  title: 📚 Parcel API
  order: 7
summary: How to use @parcel/core programatically
---

The options that can be passed to the `Parcel` constructor are [InitialParcelOptions](/plugin-system/api/#InitialParcelOptions).

By default, the behaviour is similar to `parcel serve` (building for development) — set `mode: 'production'` to create production builds (scope hoisting, minification, ...).

### A minimal example (or "What the `parcel` CLI does")

{% sample %}
{% samplefile %}

```js
import path from "path";
import Parcel from "@parcel/core";

(async () => {
  let bundler = new Parcel({
    entries: path.join(__dirname, "src/index.js"),
    defaultConfig: require.resolve("@parcel/config-default"),
    defaultTargetOptions: {
      engines: {
        browsers: ["last 1 Chrome version"],
        node: "10",
      },
    },
    mode: "production",
  });

  await bundler.run();
})();
```

{% endsamplefile %}
{% endsample %}

### Outputting to an in-memory file system

{% sample %}
{% samplefile %}

```js
import path from "path";
import Parcel, { createWorkerFarm } from "@parcel/core";
import { NodeFS, MemoryFS } from "@parcel/fs";

const DIST_DIR = "/dist";

(async () => {
  let workerFarm = createWorkerFarm();
  let inputFS = new NodeFS();
  let outputFS = new MemoryFS(workerFarm);

  await outputFS.mkdirp(DIST_DIR);

  try {
    let b = new Parcel({
      entries: [path.join(__dirname, "src", "index.html")],
      defaultConfig: require.resolve("@parcel/config-default"),
      inputFS: inputFS,
      outputFS: outputFS,
      workerFarm,
      defaultTargetOptions: {
        engines: {
          browsers: ["last 1 Chrome version"],
          node: "8",
        },
        distDir: DIST_DIR,
      },
      patchConsole: false,
      mode: "production",
    });

    await b.run();

    for (let file of await outputFS.readdir(DIST_DIR)) {
      console.log("---------", file, "---------");
      console.log(await outputFS.readFile(path.join(DIST_DIR, file), "utf8"));
    }
  } catch (e) {
    console.error(e);
  } finally {
    await workerFarm.end();
  }
})();
```

{% endsamplefile %}
{% endsample %}
