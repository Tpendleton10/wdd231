// main.js (ES Module) - Complete Updated Version
const workoutsUrl = './data/workouts.json';

// Elements
const workoutsContainer = document.getElementById('workouts-container');
const workoutsListContainer = document.getElementById('workouts-list');
const progressContainer = document.getElementById('progress-list');
const filterForm = document.getElementById('filter-form');
const typeFilterSelect = document.getElementById('type-filter');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');

let workoutsData = [];

// Fetch workouts data asynchronously with proper error handling
async function fetchWorkouts() {
  try {
    const response = await fetch(workoutsUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    workoutsData = data;
    
    // Display workouts on different pages
    if (workoutsContainer) {
      displayWorkouts(data.slice(0, 6)); // Show first 6 on home page
    }
    if (workoutsListContainer) {
      displayWorkouts(data); // Show all on workouts page
    }
  } catch (error) {
    console.error('Error fetching workouts:', error);
    const container = workoutsContainer || workoutsListContainer;
    if (container) {
      container.innerHTML = `<p>Error loading workouts: ${error.message}</p>`;
    }
  }
}

// Generate workout cards using template literals and array methods
function displayWorkouts(workouts) {
  const container = workoutsContainer || workoutsListContainer;
  if (!container) return;
  
  if (!workouts.length) {
    container.innerHTML = '<p>No workouts found.</p>';
    return;
  }
  
  // Using map array method for data processing
  container.innerHTML = workouts.map(workout => `
    <article class="workout-card" tabindex="0" data-id="${workout.id}">
      <img src="${workout.image}" alt="${workout.name} workout" loading="lazy" />
      <h3>${workout.name}</h3>
      <p><strong>Type:</strong> ${workout.type}</p>
      <p><strong>Duration:</strong> ${workout.duration} minutes</p>
      <p><strong>Difficulty:</strong> ${workout.difficulty}</p>
      <p><strong>Equipment:</strong> ${workout.equipment}</p>
      <button class="details-btn" data-id="${workout.id}" aria-label="View details for ${workout.name}">
        View Details
      </button>
    </article>
  `).join('');
  
  attachCardEventListeners();
}

// Filter workouts by type using array filter method
function filterWorkouts(event) {
  event.preventDefault();
  const selectedType = typeFilterSelect.value;
  
  // Using filter array method
  const filtered = selectedType === 'all' 
    ? workoutsData 
    : workoutsData.filter(workout => workout.type.toLowerCase() === selectedType.toLowerCase());
    
  displayWorkouts(filtered);
}

// Show modal with workout details - DOM manipulation
function showModal(workoutId) {
  const workout = workoutsData.find(w => w.id === parseInt(workoutId));
  if (!workout || !modal) return;

  // DOM manipulation - modifying content and properties
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  
  modalTitle.textContent = workout.name;
  
  // Using template literals for dynamic content
  modalDesc.innerHTML = `
    <img src="${workout.image}" alt="${workout.name}" style="width: 100%; max-width: 300px; border-radius: 8px; margin-bottom: 1rem;" />
    <p><strong>Type:</strong> ${workout.type}</p>
    <p><strong>Duration:</strong> ${workout.duration} minutes</p>
    <p><strong>Difficulty:</strong> ${workout.difficulty}</p>
    <p><strong>Equipment:</strong> ${workout.equipment}</p>
    <p><strong>Description:</strong> ${workout.description}</p>
    <h4>Exercises:</h4>
    <ul>
      ${workout.exercises.map(exercise => `<li>${exercise}</li>`).join('')}
    </ul>
    <button id="log-workout-btn" class="button">Log This Workout</button>
  `;

  // Show modal - DOM manipulation
  modal.removeAttribute('hidden');
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  modalTitle.focus();

  // Add event listener for log workout button
  const logBtn = document.getElementById('log-workout-btn');
  if (logBtn) {
    logBtn.addEventListener('click', () => {
      closeModal();
      window.location.href = `form.html?workoutId=${workout.id}`;
    });
  }
}

// Close modal function
function closeModal() {
  if (!modal) return;
  modal.setAttribute('hidden', '');
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}

// Attach event listeners to workout cards
function attachCardEventListeners() {
  const detailButtons = document.querySelectorAll('.details-btn');
  const workoutCards = document.querySelectorAll('.workout-card');
  
  // Event handling for buttons
  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showModal(btn.dataset.id);
    });
  });
  
  // Event handling for card clicks
  workoutCards.forEach(card => {
    card.addEventListener('click', () => {
      showModal(card.dataset.id);
    });
    
    // Keyboard accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showModal(card.dataset.id);
      }
    });
  });
}

// Load and display progress from local storage
function loadProgress() {
  if (!progressContainer) return;
  
  const loggedWorkouts = JSON.parse(localStorage.getItem('loggedWorkouts')) || [];
  
  if (loggedWorkouts.length === 0) {
    progressContainer.innerHTML = '<p>No workouts logged yet. <a href="form.html">Log your first workout!</a></p>';
    return;
  }
  
  // Using map to process and display data
  progressContainer.innerHTML = loggedWorkouts.map(log => `
    <article class="logged-workout">
      <h3>${log.name}</h3>
      <p><strong>Date:</strong> ${new Date(log.date).toLocaleDateString()}</p>
      <p><strong>Duration:</strong> ${log.duration} minutes</p>
      <p><strong>Notes:</strong> ${log.notes || 'No notes added'}</p>
    </article>
  `).join('');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize data fetching
  fetchWorkouts();
  
  // Load progress if on progress page
  loadProgress();
  
  // Filter form event listener
  if (filterForm) {
    filterForm.addEventListener('submit', filterWorkouts);
  }
  
  // Modal close event listeners
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  // Close modal on outside click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'block') {
      closeModal();
    }
  });
  
  // Hamburger menu functionality
  const hamburger = document.getElementById('hamburger');
  const navList = document.querySelector('.nav-list');
  
  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      navList.classList.toggle('active');
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
    });
  }
});