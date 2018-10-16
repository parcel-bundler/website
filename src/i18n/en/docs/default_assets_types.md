# 📦 Default Assetd Types

| Asset Type                     | Associated Extension(s)          |
| ------------------------------ | -------------------------------- |
| JavaScript                     | `js`, `jsx`, `es6`, `jsm`, `mjs` |
| ReasonML                       | `ml`,`re`                        |
| TypeScript                     | `ts`, `tsx`                      |
| CoffeeScript                   | `coffee`                         |
| Vue                            | `vue`                            |
| JSON                           | `json`, `json5`                  |
| YAML                           | `yaml`, `yml`                    |
| TOML                           | `toml`                           |
| GraphQL                        | `gql`, `graphql`                 |
| CSS                            | `css`, `pcss`, `postcss`         |
| Stylus                         | `stylus`                         |
| LESS                           | `less`                           |
| SASS                           | `sass`, `scss`                   |
| HTML                           | `htm`, `html`                    |
| Rust                           | `rs`                             |
| WebManifest                    | `webmanifest`                    |
| OpenGL Shading Language (GLSL) | `glsl`, `vert`, `frag`           |
| Pug                            | `jade`, `pug`                    |

<sub>\* Documentation can sometimes get out of date, for the current supported asset types see [parcel/src/Parser.js](https://github.com/parcel-bundler/parcel/blob/28df546a2249b6aac1e529dd629f506ba6b0a4bb/src/Parser.js#L10). For the actual list of Parsers see [parcel/src/assets/](https://github.com/parcel-bundler/parcel/tree/master/src/assets).</sub>

For any asset type not supported by default you can check if a plugin already exists:

- [Yarn](https://yarnpkg.com/en/packages?q=parcel-plugin-&p=1)
- [npm](https://www.npmjs.com/search?q=parcel-plugin-)
- [awesome-parcel](https://github.com/parcel-bundler/awesome-parcel#plugins)

or [create your own](https://parceljs.org/plugins.html).
