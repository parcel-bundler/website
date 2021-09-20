let rootEl = document.querySelector("html");
function updateMode(mode) {
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
    delete sessionStorage.isDarkMode;
    updateMode(e.matches);
  });

let isDarkMode = JSON.parse(sessionStorage.getItem('isDarkMode'));
if (isDarkMode == null) isDarkMode = isSystemDarkMode;

updateMode(isDarkMode);
