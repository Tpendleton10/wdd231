const courses = [
  { code: "WDD130", name: "Web Fundamentals", credits: 3, completed: true },
  { code: "WDD231", name: "Front-End Frameworks", credits: 3, completed: false },
  { code: "CSE121B", name: "JavaScript Language", credits: 3, completed: true },
  // add more courses as needed
];

function displayCourses(filter) {
  const container = document.getElementById('courseContainer');
  container.innerHTML = '';

  let filtered = courses;
  if (filter === 'WDD') {
    filtered = courses.filter(c => c.code.startsWith('WDD'));
  } else if (filter === 'CSE') {
    filtered = courses.filter(c => c.code.startsWith('CSE'));
  } // else show all courses

  let totalCredits = 0;

  filtered.forEach(course => {
    totalCredits += course.credits;

    const courseDiv = document.createElement('div');
    courseDiv.className = course.completed ? 'course-card completed' : 'course-card incomplete';

    // Example styling: completed vs incomplete visually distinct
    courseDiv.textContent = `${course.code} - ${course.name} (${course.credits} credits)`;

    container.appendChild(courseDiv);
  });

  document.getElementById('creditTotal').textContent = totalCredits;
}

// Button event listeners for filtering courses
document.getElementById('allBtn').addEventListener('click', () => displayCourses('ALL'));
document.getElementById('wddBtn').addEventListener('click', () => displayCourses('WDD'));
document.getElementById('cseBtn').addEventListener('click', () => displayCourses('CSE'));

// Initial load shows all courses
displayCourses('ALL');
