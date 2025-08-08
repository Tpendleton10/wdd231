// Load JSON and build cards
async function loadAttractions() {
  try {
    const response = await fetch("data/discover.json");
    const data = await response.json();
    const container = document.getElementById("places-container");

    data.forEach((place, index) => {
      const card = document.createElement("section");
      card.classList.add("card");
      card.style.gridArea = `card${index + 1}`; // For grid-template-areas

      card.innerHTML = `
        <h2>${place.name}</h2>
        <figure>
          <img src="${place.image}" alt="${place.name}" loading="lazy" />
        </figure>
        <address>${place.address}</address>
        <p>${place.description}</p>
        <button>Learn More</button>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load attractions:", error);
  }
}

loadAttractions();
