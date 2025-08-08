const infoBox = document.getElementById("visitor-info");
const today = Date.now();
const lastVisit = localStorage.getItem("lastVisit");

if (!lastVisit) {
  infoBox.textContent = "Welcome! Let us know if you have any questions.";
} else {
  const diffTime = today - parseInt(lastVisit);
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (days < 1) {
    infoBox.textContent = "Back so soon! Awesome!";
  } else if (days === 1) {
    infoBox.textContent = "You last visited 1 day ago.";
  } else {
    infoBox.textContent = `You last visited ${days} days ago.`;
  }
}

localStorage.setItem("lastVisit", today);
