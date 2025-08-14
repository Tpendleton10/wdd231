// storage.js
const LOG_KEY = "fitpulse-logged-workouts";

export function saveLoggedWorkout(workout) {
  const existing = JSON.parse(localStorage.getItem(LOG_KEY)) || [];
  existing.push(workout);
  localStorage.setItem(LOG_KEY, JSON.stringify(existing));
}

export function getLoggedWorkouts() {
  return JSON.parse(localStorage.getItem(LOG_KEY)) || [];
}
