try {
  let codeLanguage = localStorage.getItem("codeLanguage");
  if (codeLanguage) {
    document.documentElement.dataset.codeLanguage = codeLanguage;
  }
} catch {}
