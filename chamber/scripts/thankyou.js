// Thank you page functionality to display submitted form data
document.addEventListener('DOMContentLoaded', function() {
  displayFormData();
  addAccessibilityFeatures();
});

function displayFormData() {
  // Get URL parameters from the form submission
  const urlParams = new URLSearchParams(window.location.search);
  
  // Define the required fields that should be displayed
  const requiredFields = {
    "firstName": {
      label: "First Name",
      icon: "👤"
    },
    "lastName": {
      label: "Last Name", 
      icon: "👤"
    },
    "email": {
      label: "Email Address",
      icon: "📧"
    },
    "phone": {
      label: "Mobile Phone",
      icon: "📱"
    },
    "organization": {
      label: "Business/Organization",
      icon: "🏢"
    },
    "timestamp": {
      label: "Application Submitted",
      icon: "📅"
    }
  };

  // Optional fields that may be displayed
  const optionalFields = {
    "title": {
      label: "Organizational Title",
      icon: "💼"
    },
    "membershipLevel": {
      label: "Membership Level",
      icon: "⭐"
    },
    "description": {
      label: "Organization Description",
      icon: "📝"
    }
  };

  const formDataContainer = document.getElementById('formData');
  
  if (!formDataContainer) {
    console.error('Form data container not found');
    return;
  }

  // Check if we have any form data
  const hasData = Array.from(urlParams.keys()).length > 0;
  
  if (!hasData) {
    displayNoDataMessage(formDataContainer);
    return;
  }

  // Create the form data display
  let formDataHTML = '<div class="submitted-data">';
  
  // Display required fields first
  Object.keys(requiredFields).forEach(fieldName => {
    const value = urlParams.get(fieldName);
    if (value) {
      const field = requiredFields[fieldName];
      const formattedValue = formatFieldValue(fieldName, value);
      
      formDataHTML += createFieldHTML(field, formattedValue, true);
    }
  });

  // Display optional fields if they have values
  Object.keys(optionalFields).forEach(fieldName => {
    const value = urlParams.get(fieldName);
    if (value && value.trim()) {
      const field = optionalFields[fieldName];
      const formattedValue = formatFieldValue(fieldName, value);
      
      formDataHTML += createFieldHTML(field, formattedValue, false);
    }
  });

  formDataHTML += '</div>';
  
  formDataContainer.innerHTML = formDataHTML;
  
  // Announce completion to screen readers
  announceDataLoaded();
}

function createFieldHTML(field, value, isRequired) {
  const requiredIndicator = isRequired ? '<span class="required-indicator" aria-label="Required field">*</span>' : '';
  
  return `
    <div class="data-item ${isRequired ? 'required-field' : 'optional-field'}">
      <dt class="field-label">
        <span class="field-icon" aria-hidden="true">${field.icon}</span>
        ${field.label}${requiredIndicator}
      </dt>
      <dd class="field-value">${escapeHtml(value)}</dd>
    </div>
  `;
}

function formatFieldValue(fieldName, value) {
  switch(fieldName) {
    case 'timestamp':
      return formatTimestamp(value);
    
    case 'membershipLevel':
      return formatMembershipLevel(value);
    
    case 'phone':
      return formatPhoneDisplay(value);
    
    case 'email':
      return value.toLowerCase();
    
    case 'firstName':
    case 'lastName':
      return capitalizeFirstLetter(value);
    
    case 'organization':
      return capitalizeWords(value);
    
    case 'title':
      return capitalizeWords(value);
    
    case 'description':
      return value.length > 100 ? value.substring(0, 100) + '...' : value;
    
    default:
      return value;
  }
}

function formatTimestamp(timestamp) {
  try {
    const date = new Date(timestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    };
    
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return timestamp;
  }
}

function formatMembershipLevel(level) {
  const levels = {
    'NP': 'NP Membership (Non-Profit)',
    'Bronze': 'Bronze Membership',
    'Silver': 'Silver Membership', 
    'Gold': 'Gold Membership'
  };
  
  return levels[level] || level;
}

function formatPhoneDisplay(phone) {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX if it's a 10-digit number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Return original if not a standard format
  return phone;
}

function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function capitalizeWords(str) {
  if (!str) return str;
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function displayNoDataMessage(container) {
  container.innerHTML = `
    <div class="no-data-message" role="alert">
      <div class="warning-icon" aria-hidden="true">⚠️</div>
      <h4>No Application Data Found</h4>
      <p>It appears you've reached this page without submitting an application. To apply for chamber membership, please use our application form.</p>
      <a href="join.html" class="cta-button" aria-label="Go to membership application form">
        Apply for Membership
      </a>
    </div>
  `;
}

function announceDataLoaded() {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
  announcement.textContent = 'Application summary loaded successfully.';
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
}

function addAccessibilityFeatures() {
  // Convert the form data into a description list for better accessibility
  const formDataContainer = document.getElementById('formData');
  
  if (formDataContainer && formDataContainer.querySelector('.submitted-data')) {
    const dataItems = formDataContainer.querySelectorAll('.data-item');
    
    if (dataItems.length > 0) {
      // Wrap in a description list
      const dl = document.createElement('dl');
      dl.className = 'application-details';
      dl.setAttribute('role', 'list');
      dl.setAttribute('aria-label', 'Application details');
      
      dataItems.forEach(item => {
        const dt = item.querySelector('.field-label');
        const dd = item.querySelector('.field-value');
        
        if (dt && dd) {
          const newDt = document.createElement('dt');
          const newDd = document.createElement('dd');
          
          newDt.innerHTML = dt.innerHTML;
          newDt.className = 'field-label';
          
          newDd.innerHTML = dd.innerHTML;
          newDd.className = 'field-value';
          
          dl.appendChild(newDt);
          dl.appendChild(newDd);
        }
      });
      
      // Replace the existing content
      const submittedData = formDataContainer.querySelector('.submitted-data');
      submittedData.innerHTML = '';
      submittedData.appendChild(dl);
    }
  }

  // Add keyboard navigation for action buttons
  const actionButtons = document.querySelectorAll('.action-buttons .cta-button');
  actionButtons.forEach(button => {
    button.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.click();
      }
    });
  });
}

// Add some helpful debugging for development
function debugFormData() {
  const urlParams = new URLSearchParams(window.location.search);
  console.log('Form submission data:');
  
  for (const [key, value] of urlParams) {
    console.log(`${key}: ${value}`);
  }
}

// Call debug function if in development mode (you can remove this in production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  debugFormData();
}

// Export for potential testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatTimestamp,
    formatMembershipLevel,
    formatPhoneDisplay,
    capitalizeWords
  };
}