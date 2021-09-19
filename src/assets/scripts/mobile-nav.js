let button = document.querySelector('.hamburger-button');
let nav = document.querySelector('.docs-navigation');
let main = document.querySelector('main');
let header = document.querySelector('.parcel-docs-header');

// Hide everything except the button element.
let ariaHide = (element, isHidden) => {
  for (let child of element.children) {
    if (!child.contains(button)) {
      if (isHidden) {
        child.setAttribute('aria-hidden', 'true');
      } else {
        child.removeAttribute('aria-hidden');
      }
    } else if (child !== button) {
      ariaHide(child, isHidden);
    }
  }
};

let hide = () => {
  nav.classList.remove('visible');
  main.removeAttribute('aria-hidden');
  nav.removeAttribute('tabindex');
  button.setAttribute('aria-pressed', 'false');
  ariaHide(header, false);

  if (nav.contains(document.activeElement)) {
    button.focus();
  }
};

button.onclick = () => {
  nav.classList.toggle('visible');

  if (nav.classList.contains('visible')) {
    main.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-pressed', 'true');
    ariaHide(header, true);
    nav.tabIndex = -1;
    nav.focus();
  } else {
    hide();
  }
};

document.body.onclick = e => {
  if (!nav.contains(e.target) && !button.contains(e.target)) {
    hide();
  }
};

nav.onkeydown = e => {
  if (e.key === 'Escape') {
    hide();
  }

  // Trap focus when nav is open.
  if (e.key === 'Tab' && nav.classList.contains('visible')) {
    let tabbables = nav.querySelectorAll('button, a[href]');
    let first = tabbables[0];
    let last = tabbables[tabbables.length - 1];

    if (event.shiftKey && event.target === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && event.target === last) {
      event.preventDefault();
      first.focus();
    }
  }
};

let mq = window.matchMedia('(max-width: 1024px)');
mq.addListener(e => {
  if (!e.matches) {
    hide();
  }
});
