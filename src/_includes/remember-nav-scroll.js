"use strict";
(function () {
  let KEY = "nav-scrollTop";
  let sidebar = document.getElementsByClassName("docs-navigation");

  let value = sessionStorage.getItem(KEY);
  if (value != null) {
    sidebar[0].scrollTop = Number(value);
  }

  window.addEventListener("beforeunload", function (event) {
    sessionStorage.setItem(KEY, sidebar[0].scrollTop);
  });
})();
