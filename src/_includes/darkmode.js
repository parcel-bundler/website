"use strict";
function getPrismCSS(mode) {
  if (mode) return "/assets/prism-okaidia.css";
  else return "/assets/prism.css";
}

let rootEl = document.querySelector("html");
function updateMode(mode) {
  document.getElementById("prism-style").href = getPrismCSS(mode);
  if (mode) {
    rootEl.classList.add("dark");
  } else {
    rootEl.classList.remove("dark");
  }
}

let query = matchMedia && matchMedia("(prefers-color-scheme: dark)");
let isSystemDarkMode = query && query.matches;
if (query)
  query.addListener((e) => {
    updateMode(e.matches);
  });

let isDarkMode = JSON.parse(sessionStorage.getItem("isDarkMode"));
if (isDarkMode == null) isDarkMode = isSystemDarkMode;

document.head.insertAdjacentHTML(
  "beforeend",
  '<link rel="stylesheet" href="' +
    getPrismCSS(isDarkMode) +
    '" id="prism-style" >'
);

updateMode(isDarkMode);
