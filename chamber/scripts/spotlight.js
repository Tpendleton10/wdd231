// Enhanced spotlight functionality for chamber home page with accessibility
document.addEventListener('DOMContentLoaded', () => {
  loadSpotlights();
});

async function loadSpotlights() {
  const spotlightContainer = document.getElementById('spotlightContainer');
  
  if (!spotlightContainer) {
    console.error('Spotlight container not found');
    return;
  }
  
  try {
    // Show loading state
    spotlightContainer.innerHTML = `
      <div class="loading-state" aria-live="polite">
        <p>Loading featured businesses...</p>
      </div>
    `;
    
    const response = await fetch('data/members.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const members = data.members;

    // Filter to get only Gold (3) and Silver (2) members
    const qualifiedMembers = members.filter(member => 
      member.membership === 2 || member.membership === 3
    );

    if (qualifiedMembers.length === 0) {
      displayNoMembers();
      return;
    }

    // Randomly shuffle the qualified members
    const shuffledMembers = qualifiedMembers.sort(() => 0.5 - Math.random());

    // Select 2-3 members (3 if available, otherwise take what we have, minimum 2)
    const numberOfSpotlights = Math.min(3, Math.max(2, shuffledMembers.length));
    const selectedMembers = shuffledMembers.slice(0, numberOfSpotlights);

    // Clear loading state
    spotlightContainer.innerHTML = '';

    // Create spotlight cards for selected members
    selectedMembers.forEach((member, index) => {
      const spotlightCard = createSpotlightCard(member, index);
      
      // Add with animation delay
      setTimeout(() => {
        spotlightCard.style.opacity = '0';
        spotlightCard.style.transform = 'translateY(20px)';
        spotlightContainer.appendChild(spotlightCard);
        
        // Animate in
        requestAnimationFrame(() => {
          spotlightCard.style.transition = 'all 0.6s ease';
          spotlightCard.style.opacity = '1';
          spotlightCard.style.transform = 'translateY(0)';
        });
      }, index * 200);
    });

    // Announce completion to screen readers
    setTimeout(() => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
      announcement.textContent = `Featured businesses loaded. Showing ${selectedMembers.length} ${selectedMembers.length === 1 ? 'business' : 'businesses'}.`;
      document.body.appendChild(announcement);
      
      setTimeout(() => document.body.removeChild(announcement), 1000);
    }, (selectedMembers.length * 200) + 500);

  } catch (error) {
    console.error('Failed to load spotlight data:', error);
    displayError();
  }
}

function createSpotlightCard(member, index) {
  const card = document.createElement('article');
  card.className = 'spotlight-card';
  card.setAttribute('role', 'article');
  card.setAttribute('aria-labelledby', `spotlight-title-${index}`);
  
  // Determine membership level display
  const membershipLevel = getMembershipLevel(member.membership);
  const membershipClass = `level-${member.membership}`;
  
  // Format phone number for display
  const formattedPhone = formatPhoneNumber(member.phone);
  
  // Ensure website URL has protocol
  const websiteUrl = ensureProtocol(member.website);
  
  // Create unique IDs for accessibility
  const titleId = `spotlight-title-${index}`;
  const descId = `spotlight-desc-${index}`;
  
  card.innerHTML = `
    <div class="spotlight-header">
      <img src="images/${member.image}" 
           alt="${member.name} logo" 
           onerror="this.src='images/placeholder-logo.jpg'; this.alt='${member.name} - logo not available';"
           loading="lazy">
      <div class="membership ${membershipClass}" role="text" aria-label="${membershipLevel} membership level">
        ${membershipLevel} Member
      </div>
    </div>
    <div class="spotlight-content">
      <h3 id="${titleId}">${escapeHtml(member.name)}</h3>
      <p id="${descId}" class="member-description">${escapeHtml(member.description)}</p>
      <div class="contact-info">
        <p class="address">
          <span aria-label="Address">📍</span> 
          <span>${escapeHtml(member.address)}</span>
        </p>
        <p class="phone">
          <span aria-label="Phone number">📞</span> 
          <a href="tel:${member.phone.replace(/\D/g, '')}" aria-label="Call ${member.name}">
            ${formattedPhone}
          </a>
        </p>
        <a href="${websiteUrl}" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="website-link"
           aria-label="Visit ${member.name} website (opens in new tab)">
          <span aria-hidden="true">🌐</span> Visit Website
        </a>
      </div>
    </div>
  `;
  
  return card;
}

function displayNoMembers() {
  const spotlightContainer = document.getElementById('spotlightContainer');
  spotlightContainer.innerHTML = `
    <div class="no-members-message" role="alert">
      <p>No qualified members available for spotlight at this time.</p>
      <p>Check back soon for featured businesses!</p>
    </div>
  `;
}

function displayError() {
  const spotlightContainer = document.getElementById('spotlightContainer');
  spotlightContainer.innerHTML = `
    <div class="error-message" role="alert">
      <h3>Unable to Load Featured Businesses</h3>
      <p>We're experiencing technical difficulties loading our business spotlights.</p>
      <button onclick="reloadSpotlights()" 
              class="retry-button"
              aria-label="Try loading featured businesses again">
        Try Again
      </button>
    </div>
  `;
}

function getMembershipLevel(membershipNumber) {
  switch(membershipNumber) {
    case 3:
      return 'Gold';
    case 2:
      return 'Silver';
    case 1:
      return 'Bronze';
    default:
      return 'Member';
  }
}

function formatPhoneNumber(phone) {
  if (!phone) return 'Phone not available';
  
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a 10-digit US number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Return original if not standard format
  return phone;
}

function ensureProtocol(url) {
  if (!url) return '#';
  
  // If URL doesn't start with http:// or https://, add https://
  if (!url.match(/^https?:\/\//)) {
    return `https://${url}`;
  }
  
  return url;
}

function escapeHtml(text) {
  if (!text) return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Function to reload spotlights (useful for testing random selection)
function reloadSpotlights() {
  const spotlightContainer = document.getElementById('spotlightContainer');
  if (spotlightContainer) {
    // Announce reload to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    announcement.textContent = 'Reloading featured businesses...';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }
  
  loadSpotlights();
}

// Add enhanced CSS for accessibility and loading states
const spotlightStyles = `
<style>
.loading-state {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

.no-members-message,
.error-message {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border-left: 4px solid var(--secondary);
}

.error-message {
  border-left-color: #ff6b6b;
}

.retry-button {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.retry-button:hover,
.retry-button:focus {
  background: #004080;
  transform: translateY(-2px);
  outline: 2px solid var(--secondary);
  outline-offset: 2px;
}

.spotlight-card {
  focus-within: transform: translateY(-3px);
  transition: transform 0.3s ease;
}

.spotlight-card:focus-within {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.contact-info a {
  color: var(--primary);
  text-decoration: none;
  font-weight: bold;
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}

.contact-info a:hover,
.contact-info a:focus {
  border-bottom-color: var(--secondary);
  outline: 2px solid var(--secondary);
  outline-offset: 2px;
}

.website-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .spotlight-card {
    border: 2px solid currentColor;
  }
  
  .membership {
    border: 1px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .spotlight-card {
    transition: none;
  }
  
  .retry-button {
    transition: none;
  }
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', spotlightStyles);

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { loadSpotlights, reloadSpotlights };
}