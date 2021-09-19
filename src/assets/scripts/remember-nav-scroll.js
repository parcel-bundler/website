let KEY = "nav-scrollTop";
let sidebar = document.getElementsByClassName("docs-navigation")[0];

let value = sessionStorage.getItem(KEY);
if (value != null) {
  sidebar.scrollTop = Number(value);
}

sidebar.addEventListener("scroll", function (event) {
  sessionStorage.setItem(KEY, sidebar.scrollTop);
});
