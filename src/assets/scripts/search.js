// When the search input is focused, add a class to the header.
// This is used to hide some other elements and expand the search bar.
let search = document.querySelector('#search-input');
let header = document.querySelector('.parcel-docs-header');
search.onfocus = () => {
  header.classList.add('search');
};

search.onblur = () => {
  header.classList.remove('search');
};
