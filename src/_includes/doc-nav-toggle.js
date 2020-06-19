"use strict";
(function () {
  var navToggles = document.querySelectorAll(".toggle-doc-nav-tree");
  navToggles.forEach((toggle) => {
    toggle.addEventListener("change", function (evt) {
      try {
        var navTreeId = evt.target.id.replace("toggle", "nav-tree");
        var target = document.getElementById(navTreeId);
        var isChecked = evt.target.checked;

        if (target) {
          target.setAttribute("class", isChecked ? "" : "visually-hidden");
        }
      } catch (err) {
        console.error(err);
      }
    });
  });
})();
