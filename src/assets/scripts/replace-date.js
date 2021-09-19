(function() {
  const replaceElements = document.querySelectorAll(
    "time[datetime].js-replace-date"
  );
  
  if (replaceElements.length === 0) {
    return;
  }

  const lang = navigator.languages.length
    ? navigator.languages
    : document.documentElement.lang;

  const dateFormatter = new Intl.DateTimeFormat(lang, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  Array.prototype.forEach.call(replaceElements, function (elem) {
    try {
      const date = Date.parse(elem.dateTime + "T00:00:00");
      elem.innerHTML = dateFormatter.format(date);
    } catch (e) {
      // skip
    }
  });
})();
