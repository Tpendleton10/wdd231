// workouts.js
export async function fetchWorkouts(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch workouts:", error);
    return [];
  }
}

export function renderWorkoutCards(workouts, container) {
  container.innerHTML = ""; // clear container

  workouts.forEach(workout => {
    const card = document.createElement("article");
    card.className = "workout-card";
    card.tabIndex = 0; // make focusable for accessibility

    card.innerHTML = `
      <img src="${workout.image}" alt="Image of ${workout.name}" loading="lazy" />
      <h3>${workout.name}</h3>
      <p><strong>Type:</strong> ${workout.type}</p>
      <p><strong>Duration:</strong> ${workout.duration} min</p>
      <p><strong>Difficulty:</strong> ${workout.difficulty}</p>
      <button class="details-btn" data-id="${workout.id}" aria-haspopup="dialog" aria-controls="modal">View Details</button>
    `;

    container.appendChild(card);
  });
}
