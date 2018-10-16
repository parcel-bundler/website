# HTML

HTML assets are often the entry file that you provide to Parcel, but can also be referenced by JavaScript files, e.g. to provide links to other pages. URLs to scripts, styles, media, and other HTML files are extracted and compiled as described above. The references are rewritten in the HTML so that they link to the correct output files. All filenames should be relative to the current HTML file.

```html
<html>
<body>
  <!-- reference an image file -->
  <img src="./images/header.png">

  <a href="./other.html">Link to another page</a>

  <!-- import a JavaScript bundle -->
  <script src="./index.js"></script>
</body>
</html>
```