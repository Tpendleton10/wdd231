// Footer date
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// Mobile nav toggle
document.getElementById('menuToggle').onclick = () => {
  document.getElementById('navList').classList.toggle('show');
};