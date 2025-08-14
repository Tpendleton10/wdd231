// main.js (ES Module)
const workoutsUrl = './data/workouts.json';

// Elements
const workoutsContainer = document.getElementById('workouts-container');
const filterSelect = document.getElementById('filter-type');
const modal = document.getElementById('modal');
const modalContent = modal.querySelector('.modal-content');
const closeModalBtn = modal.querySelector('.close-btn');

let workoutsData = [];

// Fetch workouts data asynchronously
async function fetchWorkouts() {
  try {
    const response = await fetch(workoutsUrl);
    if (!response.ok) throw new Error('Network response was not OK');
    const data = await response.json();
    workoutsData = data;
    displayWorkouts(data);
  } catch (error) {
    workoutsContainer.innerHTML = `<p>Error loading workouts: ${error.message}</p>`;
  }
}

// Generate workout cards
function displayWorkouts(workouts) {
  if (!workouts.length) {
    workoutsContainer.innerHTML = '<p>No workouts found.</p>';
    return;
  }
  
  workoutsContainer.innerHTML = workouts.map(workout => `
    <article class="workout-card" tabindex="0" data-id="${workout.id}">
      <h3>${workout.name}</h3>
      <p><strong>Type:</strong> ${workout.type}</p>
      <p><strong>Duration:</strong> ${workout.duration}</p>
      <p><strong>Difficulty:</strong> ${workout.difficulty}</p>
      <button class="details-btn" aria-label="View details for ${workout.name}">Details</button>
    </article>
  `).join('');
  attachCardEventListeners();
}

// Filter workouts by type
function filterWorkouts() {
  const selectedType = filterSelect.value;
  if (selectedType === 'all') {
    displayWorkouts(workoutsData);
  } else {
    const filtered = workoutsData.filter(w => w.type === selectedType);
    displayWorkouts(filtered);
  }
}

// Show modal with workout details
function showModal(workoutId) {
  const workout = workoutsData.find(w => w.id === parseInt(workoutId));
  if (!workout) return;

  modalContent.innerHTML = `
    <button class="close-btn" aria-label="Close modal">&times;</button>
    <h2 id="modal-title">${workout.name}</h2>
    <p><strong>Type:</strong> ${workout.type}</p>
    <p><strong>Duration:</strong> ${workout.duration}</p>
    <p><strong>Difficulty:</strong> ${workout.difficulty}</p>
    <p>${workout.description}</p>
    <h3>Exercises</h3>
    <ul>
      ${workout.exercises.map(ex => `<li>${ex}</li>`).join('')}
    </ul>
    <button id="log-workout-btn">Log Workout</button>
  `;

  // Show modal
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  modalContent.focus();

  // Close button listener
  modalContent.querySelector('.close-btn').addEventListener('click', closeModal);
  document.getElementById('log-workout-btn').addEventListener('click', () => {
    closeModal();
    window.location.href = 'form.html?workoutId=' + workout.id;
  });
}

function closeModal() {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}

// Attach event listeners to workout cards' detail buttons
function attachCardEventListeners() {
  const detailButtons = document.querySelectorAll('.details-btn');
  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.workout-card');
      showModal(card.dataset.id);
    });
  });
}

// Close modal on outside click or Escape key
window.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
});

// Filter event listener
if (filterSelect) filterSelect.addEventListener('change', filterWorkouts);

// Initial fetch
if (workoutsContainer) fetchWorkouts();