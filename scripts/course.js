const courses = [
  { code: "WDD130", name: "Web Fundamentals", credits: 3, completed: true },
  { code: "WDD231", name: "Front-End Frameworks", credits: 3, completed: false },
  { code: "CSE121B", name: "JavaScript Language", credits: 3, completed: true },
  // more courses...
];

function displayCourses(filter) {
  const container = document.getElementById('courseContainer');
  container.innerHTML = '';
  let filtered = courses;

  if (filter === 'WDD') filtered = courses.filter(c => c.code.includes('WDD'));
  else if (filter === 'CSE') filtered = courses.filter(c => c.code.includes('CSE'));

  let totalCredits = 0;

  filtered.forEach(course => {
    totalCredits += course.credits;
    const div = document.createElement('div');
    div.className = course.completed ? 'completed' : 'incomplete';
    div.textContent = `${course.code} - ${course.name}`;
    container.appendChild(div);
  });

  document.getElementById('creditTotal').textContent = totalCredits;
}

document.getElementById('allBtn').addEventListener('click', () => displayCourses('ALL'));
document.getElementById('wddBtn').addEventListener('click', () => displayCourses('WDD'));
document.getElementById('cseBtn').addEventListener('click', () => displayCourses('CSE'));

// Initial display
displayCourses('ALL');
