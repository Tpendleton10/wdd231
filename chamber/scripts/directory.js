document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('membersContainer');
  const gridButton = document.getElementById('gridView');
  const listButton = document.getElementById('listView');

  // Set default layout
  if (container) {
    container.className = 'grid-view';
  }

  // Fetch and display members
  async function fetchMembers() {
    try {
      const resp = await fetch('data/members.json');
      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
      const data = await resp.json();
      
      // Handle the nested structure where members are in data.members
      const membersList = data.members || data;
      displayMembers(membersList);
    } catch (err) {
      console.error('Error fetching members:', err);
      if (container) {
        container.innerHTML = `<p class="error">Failed to load member data. Please try again later.</p>`;
      }
    }
  }

  function displayMembers(list) {
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing content
    
    if (!Array.isArray(list) || list.length === 0) {
      container.innerHTML = '<p class="error">No member data available.</p>';
      return;
    }
    
    list.forEach(member => {
      const card = document.createElement('section');
      card.className = 'member-card';
      
      // Ensure all required fields exist
      const name = member.name || 'Unknown Business';
      const description = member.description || 'No description available';
      const address = member.address || 'Address not provided';
      const phone = member.phone || 'Phone not provided';
      const website = member.website || '#';
      const image = member.image || 'placeholder-logo.jpg';
      const membership = member.membership || 1;
      
      // Determine membership level text
      const membershipText = getMembershipText(membership);
      
      card.innerHTML = `
        <img src="images/${image}" alt="${name} logo" onerror="this.src='images/placeholder-logo.jpg'">
        <div class="member-info">
          <h3>${name}</h3>
          <p class="member-description">${description}</p>
          <p class="member-address">📍 ${address}</p>
          <p class="member-phone">📞 ${phone}</p>
          <a href="${ensureProtocol(website)}" target="_blank" rel="noopener noreferrer" class="member-website">🌐 Website</a>
          <span class="membership level-${membership}">
            ${membershipText}
          </span>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function getMembershipText(level) {
    switch(level) {
      case 3:
        return 'Gold Member';
      case 2:
        return 'Silver Member';
      case 1:
        return 'Bronze Member';
      default:
        return 'Member';
    }
  }

  function ensureProtocol(url) {
    if (!url || url === '#') return '#';
    
    if (!url.match(/^https?:\/\//)) {
      return `https://${url}`;
    }
    
    return url;
  }

  // View toggle buttons
  if (gridButton) {
    gridButton.onclick = () => {
      if (container) {
        container.className = 'grid-view';
        gridButton.classList.add('active');
        if (listButton) listButton.classList.remove('active');
      }
    };
  }

  if (listButton) {
    listButton.onclick = () => {
      if (container) {
        container.className = 'list-view';
        listButton.classList.add('active');
        if (gridButton) gridButton.classList.remove('active');
      }
    };
  }

  // Initialize with grid view active
  if (gridButton) {
    gridButton.classList.add('active');
  }

  // Fetch members data
  fetchMembers();
});