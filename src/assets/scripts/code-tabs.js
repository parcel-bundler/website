// Code examples written in multiple languages are rendered as tabs (see the
// codetabs shortcode), and API names in prose have a variant for each language
// (see the api shortcode). Selecting a language updates the whole page, and is
// remembered across pages. code-tabs-init.js applies the stored language before
// the page renders to avoid a flash of the default language.
const STORAGE_KEY = "codeLanguage";

function selectLanguage(lang) {
  document.documentElement.dataset.codeLanguage = lang;
  for (let group of document.querySelectorAll(".code-tabs, .api-name")) {
    let langs = group.dataset.langs.split(" ");
    let selected = langs.includes(lang) ? lang : langs[0];
    for (let tab of group.querySelectorAll("[role=tab]")) {
      let isSelected = tab.dataset.lang === selected;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    }
    for (let variant of group.children) {
      if (variant.dataset.lang) {
        variant.hidden = variant.dataset.lang !== selected;
      }
    }
  }
}

function activate(tab) {
  let lang = tab.dataset.lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {}

  // Switching languages changes the height of examples above this one,
  // so keep the selected tab in the same place on screen.
  let top = tab.getBoundingClientRect().top;
  selectLanguage(lang);
  window.scrollBy(0, tab.getBoundingClientRect().top - top);
}

document.addEventListener("click", (e) => {
  let tab = e.target.closest(".code-tabs [role=tab]");
  if (tab) {
    activate(tab);
  }
});

document.addEventListener("keydown", (e) => {
  let tab = e.target.closest(".code-tabs [role=tab]");
  if (!tab) {
    return;
  }

  let tabs = [...tab.parentElement.querySelectorAll("[role=tab]")];
  let index = tabs.indexOf(tab);
  let next;
  switch (e.key) {
    case "ArrowLeft":
      next = tabs[(index - 1 + tabs.length) % tabs.length];
      break;
    case "ArrowRight":
      next = tabs[(index + 1) % tabs.length];
      break;
    case "Home":
      next = tabs[0];
      break;
    case "End":
      next = tabs[tabs.length - 1];
      break;
    default:
      return;
  }

  e.preventDefault();
  activate(next);
  next.focus();
});

// Keep other open pages in sync.
window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEY && e.newValue) {
    selectLanguage(e.newValue);
  }
});

let lang = document.documentElement.dataset.codeLanguage;
if (lang) {
  selectLanguage(lang);
}
