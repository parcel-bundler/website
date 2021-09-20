let KEY = "nav-scrollTop";
let sidebar = document.querySelector('.docs-navigation');

let value = sessionStorage.getItem(KEY);
if (value != null) {
  sidebar.scrollTop = Number(value);
}

window.addEventListener('pagehide', () => {
  sessionStorage.setItem(KEY, sidebar.scrollTop);
});
