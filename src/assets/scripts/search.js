// When the search input is focused, add a class to the header.
// This is used to hide some other elements and expand the search bar.
let search = document.querySelector("#search-input");
let header = document.querySelector("header");
search.onfocus = () => {
  header.classList.add("search");
};

search.onblur = () => {
  header.classList.remove("search");
};

docsearch({
  appId: "BG2BI65LT3",
  apiKey: "6309d86dabd1e4f3de34109753166903",
  indexName: "parceljs",
  inputSelector: "#search-input",
  algoliaOptions: {
    facetFilters: ["lang:en", "version:v2"],
  },
});

if (typeof visualViewport !== "undefined") {
  visualViewport.addEventListener("resize", () => {
    document.documentElement.style.setProperty(
      "--viewport-height",
      visualViewport.height + "px"
    );
  });
}
