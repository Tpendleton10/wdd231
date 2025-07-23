document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('membersContainer');
  const gridButton = document.getElementById('gridView');
  const listButton = document.getElementById('listView');

  // Set default layout
  container.className = 'grid-view';

  // Fetch and display members
  async function fetchMembers() {
    try {
      const resp = await fetch('data/members.json');
      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
      const data = await resp.json();
      displayMembers(data);
    } catch (err) {
      console.error('Error fetching members:', err);
      container.innerHTML = `<p class="error">Failed to load member data. Please try again later.</p>`;
    }
  }

  function displayMembers(list) {
    container.innerHTML = ''; // Clear existing content
    list.forEach(m => {
      const card = document.createElement('section');
      card.className = 'member-card';
      card.innerHTML = `
        <img src="images/${m.image}" alt="${m.name} logo">
        <div class="member-info">
          <h3>${m.name}</h3>
          <p>${m.description}</p>
          <p>${m.address}</p>
          <p>${m.phone}</p>
          <a href="${m.website}" target="_blank">Website</a>
          <span class="membership level-${m.membership}">
            ${m.membership === 3 ? 'Gold' : m.membership === 2 ? 'Silver' : 'Member'}
          </span>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // View toggle buttons
  gridButton.onclick = () => {
    container.className = 'grid-view';
  };

  listButton.onclick = () => {
    container.className = 'list-view';
  };

  fetchMembers();
});
