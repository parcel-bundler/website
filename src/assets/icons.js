var icons = ['js', 'json', 'css', 'sass', 'less', 'html', 'jpg', 'png', 'gif', 'bmp', 'svg', 'raw', 'rs', 'ts']

var container = document.querySelector('.icons')

function spawn() {
  var icon = icons[Math.floor(Math.random() * icons.length)]
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.style.left = 25 + Math.random() * 50 + '%'
  svg.setAttribute('class', 'icon')
  var use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'assets/icons.svg#' + icon)
  svg.appendChild(use)
  container.appendChild(svg)

  setTimeout(function() {
    container.removeChild(svg)
  }, 3000)
}

setTimeout(function run() {
  spawn()
  setTimeout(run, 500 + Math.random() * 400)
}, 500 + Math.random() * 400)

spawn()
