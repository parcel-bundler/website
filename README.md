# 🌎 parcel-website

This is the source of the [parceljs.org](https://parceljs.org) website.

Aside from the homepage, each documentation page is generated from a markdown file using the [markdown-styles](https://github.com/mixu/markdown-styles) generator.

## Contributing

Start a local server using:

```bash
npm install
npm run build
npm start
```

The website is deployed using [Zeit Now](https://zeit.co/now).

### Changing the displayed language

Change the displayed language using a query string:

E.g.: access the Korean version using the following url: http://localhost:5000/?locale=ko
