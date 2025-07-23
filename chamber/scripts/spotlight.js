const spotlightContainer = document.querySelector('.spotlight-cards');

async function loadSpotlights() {
  try {
    const response = await fetch('data/members.json');
    const data = await response.json();
    const members = data.members;

    // Filter gold and silver members
    const topMembers = members.filter(m => m.membership === "Gold" || m.membership === "Silver");

    // Shuffle and pick 2 or 3
    const selected = topMembers.sort(() => 0.5 - Math.random()).slice(0, 3);

    spotlightContainer.innerHTML = ''; // Clear placeholders

    selected.forEach(member => {
      const card = document.createElement('article');
      card.innerHTML = `
        <img src="${member.image}" alt="${member.name} logo">
        <h3>${member.name}</h3>
        <p>${member.address}</p>
        <p>${member.phone}</p>
        <a href="${member.website}" target="_blank">Visit Website</a>
        <div class="membership level-${member.membership === "Gold" ? 3 : 2}">${member.membership}</div>
      `;
      spotlightContainer.appendChild(card);
    });

  } catch (error) {
    console.error('Failed to load spotlight data:', error);
  }
}

loadSpotlights();
