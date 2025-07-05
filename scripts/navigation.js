// Toggle the navigation menu open/close on hamburger click
document.getElementById('menu').addEventListener('click', () => {
  const nav = document.getElementById('navMenu');
  nav.classList.toggle('open');

  // Optionally: toggle aria-expanded attribute for accessibility
  const expanded = nav.classList.contains('open');
  document.getElementById('menu').setAttribute('aria-expanded', expanded);
});
