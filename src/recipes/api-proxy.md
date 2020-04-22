---
layout: layout.njk
eleventyNavigation:
  key: API Proxy
  title: 🚇 API Proxy
  order: 1
summary: Configuration the builtin dev server to forward specific paths to another server
---

To better emulate the actual production environment when developing web apps, you can specify paths that should be proxied to another server (e.g. your real API server or a local testing server) in a `.proxyrc` or `.proxyrc.js` file.


### `.proxyrc`

In this JSON file, you specify an object where every key is a pattern against which the URL is matched and the value is a [`http-proxy-middleware` options](https://github.com/chimurai/http-proxy-middleware#options) object:

{% sample %}
{% samplefile ".proxyrc.js" %}

```js
{
  "/api": {
    "target": "http://localhost:8000/",
    "pathRewrite": {
      "^/api": ""
    }
  }
}

```

{% endsamplefile %}
{% endsample %}

This would cause `http://localhost:1234/api/endpoint` to be proxied to `http://localhost:8000/endpoint`.

### `.proxyrc.js`

For more complex configurations, a `.proxyrc.js` file allows you to attach any (connect-compatible) middleware, this example has the same behaviour as the `.proxyrc` version above.

{% sample %}
{% samplefile ".proxyrc.js" %}

```js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://localhost:8000/",
      pathRewrite: {
        "^/api": "",
      },
    })
  );
};
```

{% endsamplefile %}
{% endsample %}

(This functionality is provided by `@parcel/reporter-dev-server` TODO LINK.)
