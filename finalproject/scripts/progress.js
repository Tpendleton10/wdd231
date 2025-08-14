// progress.js (ES Module)

const progressContainer = document.getElementById('progress-container');
const noProgressMessage = document.getElementById('no-progress-message');

function loadProgress() {
  const loggedWorkouts = JSON.parse(localStorage.getItem('loggedWorkouts')) || [];

  if (loggedWorkouts.length === 0) {
    noProgressMessage.style.display = 'block';
    progressContainer.innerHTML = '';
    return;
  } else {
    noProgressMessage.style.display = 'none';
  }

  progressContainer.innerHTML = loggedWorkouts.map(log => `
    <article class="logged-workout" tabindex="0">
      <h3>${log.name}</h3>
      <p><strong>Date:</strong> ${log.date}</p>
      <p><strong>Duration:</strong> ${log.duration}</p>
      <p><strong>Notes:</strong> ${log.notes || 'None'}</p>
    </article>
  `).join('');
}

window.addEventListener('DOMContentLoaded', loadProgress);
