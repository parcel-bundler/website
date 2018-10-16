# CSS

CSS assets can be imported from a JavaScript or HTML file, and can contain dependencies referenced by `@import` syntax as well as references to images, fonts, etc. via the `url()` function. Other CSS files that are `@import`ed are inlined into the same CSS bundle, and `url()` references are rewritten to their output filenames. All filenames should be relative to the current CSS file.

```css
/* Import another CSS file */
@import './other.css';

.test {
  /* Reference an image file */
  background: url('./images/background.png');
}
```

In addition to plain CSS, other compile-to-CSS languages like LESS, SASS, and Stylus are also supported, and work the same way.