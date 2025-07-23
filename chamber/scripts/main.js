// Footer date
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// Mobile nav toggle
document.getElementById('menuToggle').onclick = () => {
  document.getElementById('navList').classList.toggle('show');
};

const current = location.pathname.split('/').pop();
document.querySelectorAll('nav a').forEach(link => {
  if (link.getAttribute('href') === current) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});
