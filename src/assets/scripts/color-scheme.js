let toggle = document.querySelector("#color-scheme-toggle")
toggle.onclick = () => {
  isDarkMode = !isDarkMode;
  sessionStorage.setItem("isDarkMode", isDarkMode);
  updateMode(isDarkMode);
};

document.body.classList.add('loaded');
