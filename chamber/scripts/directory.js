const container = document.getElementById('membersContainer');

async function fetchMembers() {
  const resp = await fetch('data/members.json');
  const data = await resp.json();
  displayMembers(data);
}

function displayMembers(list) {
  container.innerHTML = '';
  list.forEach(m => {
    const card = document.createElement('section');
    card.className = 'member-card';
    card.innerHTML = `<img src="images/${m.image}" alt="${m.name} logo"/>
      <div class="member-info">
        <h3>${m.name}</h3>
        <p>${m.description}</p>
        <p>${m.address}</p>
        <p>${m.phone}</p>
        <a href="${m.website}" target="_blank">Website</a>
        <span class="membership level-${m.membership}">${m.membership === 3 ? 'Gold' : m.membership === 2 ? 'Silver' : 'Member'}</span>
      </div>`;
    container.appendChild(card);
  });
}

// Layout toggle
document.getElementById('gridView').onclick = () => container.className = 'grid-view';
document.getElementById('listView').onclick = () => container.className = 'list-view';

fetchMembers();
