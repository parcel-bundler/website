---
layout: layout.njk
title: 'Announcing Parcel CSS: A new CSS parser, compiler, and minifier written in Rust!'
eleventyNavigation:
  key: blog-parcel-css
  title: Announcing Parcel CSS
date: 2022-01-12
---

I'm very excited to announce <a href="https://github.com/parcel-bundler/parcel-css" target="_blank">@parcel/css</a>, a new CSS parser, compiler, and minifier written in Rust! Check it out <a href="https://github.com/parcel-bundler/parcel-css" target="_blank">on GitHub</a>, or try a <a href="https://parcel-css.vercel.app" target="_blank">live demo</a> right in your browser.

Parcel CSS has significantly better performance than existing tools, while also improving minification quality. In addition to minification, Parcel CSS handles compiling CSS modules, tree shaking, automatically adding and removing vendor prefixes for your browser targets, and transpiling modern CSS features like nesting, logical properties, level 4 color syntax, and much more.

It can be used with Parcel, as a standalone library from JavaScript or Rust, or wrapped as a plugin within any other tool. The Rust library is designed as a platform for CSS tooling, with access to fully parsed data structures for all CSS rules, selectors, properties, and values.

## Performance

Parcel CSS is extremely fast. It is over 100x faster than CSSNano for minification, and over 3x faster than ESBuild. It can minify over 2.7 million lines of code per second on a single thread. This example shows a benchmark that minifies Bootstrap 4, which is about 10,000 lines.

{% include "./performance.svg" %}

Even though it is extremely fast, Parcel CSS does not compromise on size. It can produce much smaller output than other tools in many cases thanks to the ability to convert legacy CSS syntax used in many libraries to smaller modern syntax, as well as its full understanding of every individual CSS property.

{% include "./size.svg" %}

Parcel CSS is fast not only because it is written in a native language, but because it was designed from the start with performance in mind. It is designed to be efficient in the way it uses memory, including optimizations such as representing vendor prefixes using single byte bit flags, and parsing all CSS properties into structured data rather than representing them as strings that need to be re-parsed each time they are used.

## Architecture

Parcel CSS is based on the <a href="https://github.com/servo/rust-cssparser" target="_blank">cssparser</a> Rust crate, a browser-grade CSS tokenizer created by Mozilla and used in Firefox. This provides a solid foundation, including tokenization and basic parsing. However, it does not interpret any CSS properties or at rules. That's where Parcel CSS comes in. It handles parsing each individual rule and property value, as well as minification, compilation, and printing back to CSS.

Many other CSS processors treat property values as strings, or an untyped series of tokens. This means that each transformer that wants to do something with these values must parse and interpret them itself, leading to duplicate work and inconsistencies. For example, the AST for a CSS property parsed by PostCSS looks like this:

```json
{
  "type": "decl",
  "prop": "background",
  "value": "url(img.png) 20px 10px / 50px 100px"
}
```

Even if you use `postcss-value-parser`, a separate library used by many PostCSS plugins to tokenize property values, the meaning of each token is still not interpreted. The above value parses like this:

```javascript
[
  {
    type: 'function',
    value: 'url',
    nodes: [ { type: 'word', value: 'img.png' } ]
  },
  { type: 'space', value: ' ' },
  { type: 'word', value: '20px' },
  { type: 'space', value: ' ' },
  { type: 'word', value: '10px' },
  { type: 'div', value: '/' },
  { type: 'word', value: '50px' },
  { type: 'space', value: ' ' },
  { type: 'word', value: '100px' }
]
```

While a bit more structured and easier to deal with than a string, it's not clear that `20px` is the value for `background-position-x` and `50px` is the value for the background width. This must be interpreted by the user.

Parcel CSS parses all values using the grammar from the CSS specification, and exposes a specific value type for each property. For example, Parcel CSS represents the above property like this:

```rust
Background([Background {
  image: Url(Url { url: "img.png" }),
  color: CssColor(RGBA(RGBA { red: 0, green: 0, blue: 0, alpha: 0 })),
  position: Position {
    x: Length(Dimension(Px(20.0))),
    y: Length(Dimension(Px(10.0))),
  },
  repeat: BackgroundRepeat {
    x: Repeat,
    y: Repeat,
  },
  size: Explicit {
    width: LengthPercentage(Dimension(Px(50.0))),
    height: LengthPercentage(Dimension(Px(100.0))),
  },
  attachment: Scroll,
  origin: PaddingBox,
  clip: BorderBox,
}])
```

This is exactly how browsers parse CSS. Values are interpreted, and implicit default values like background attachment are filled in. This improves performance because every time a transformer wants to do something with a property, it doesn't need to re-parse it, transform, and stringify it again. This also improves reliability, because each transformer won't parse the value slightly differently, or take shortcuts like using regexes or string replacement, which can lead to bugs.

Since property values are individually interpreted, this approach also enables better minification. For example, implicit default values can be automatically removed, whitespace can be removed where not needed, longhand properties can be merged into shorthands when possible, etc.

This architecture provides a foundation for CSS tooling, which can focus on using properties in interesting ways rather than on parsing and interpreting them.

## Try it out

**If you're using Parcel**, you can try out Parcel CSS as your CSS transformer, minifier, or both. We hope to replace the default CSS transformer and minifier soon, but would like to get feedback first. For now, just add the following to your `.parcelrc` file:

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.css": ["@parcel/transformer-css-experimental"]
  },
  "optimizers": {
    "*.css": ["@parcel/optimizer-css"]
  }
}
```

You should also add a `browserslist` property to your package.json, which defines the target browsers that your CSS will be compiled for.

While Parcel CSS handles the most commonly used PostCSS plugins like `autoprefixer`, `postcss-preset-env`, and CSS modules, you may still need PostCSS for more custom plugins like TailwindCSS. If that's the case, just add `@parcel/transformer-postcss` before `@parcel/transformer-css-experimental`, and your PostCSS config will be picked up automatically. You can remove the plugins listed above from your PostCSS config, and they'll be handled by Parcel CSS.

**If you are not using Parcel**, you can still try Parcel CSS. You can either use it standalone with the <a href="https://github.com/parcel-bundler/parcel-css#from-javascript" target="_blank">JavaScript API</a>, or create a plugin for your favorite build tool. We hope to see Parcel CSS adopted by many tools, not just Parcel, so we can move the entire CSS tooling ecosystem forward.

**You can also try out the <a href="https://docs.rs/parcel_css" target="_blank">parcel_css</a> Rust crate**, which gives you full access to the parsed AST, and allows you to build custom tooling. More API docs are coming soon, but for now, you'll want to start with the <a href="https://docs.rs/parcel_css/1.0.0-alpha.10/parcel_css/stylesheet/struct.StyleSheet.html" target="_blank">StyleSheet</a> API. Note that while the JavaScript API is stable, the Rust API is still alpha and structures may change between versions as we continue improving Parcel CSS.

Please let us know how it goes! You can file issues for bugs or feature requests on <a href="https://github.com/parcel-bundler/parcel-css" target="_blank">GitHub</a>.
