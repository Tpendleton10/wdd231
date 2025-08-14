// Join page functionality with form validation and animations
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality
  initializeTimestamp();
  initializeFormValidation();
  initializeModalHandlers();
  initializeCardAnimations();
  initializeAccessibility();
});

// Set the current timestamp in the hidden field
function initializeTimestamp() {
  const timestampField = document.getElementById('timestamp');
  if (timestampField) {
    timestampField.value = new Date().toISOString();
  }
}

// Initialize form validation
function initializeFormValidation() {
  const form = document.querySelector('form');
  if (!form) return;

  // Add input event listeners for real-time validation
  const inputs = form.querySelectorAll('input[required], input[pattern]');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearError(input));
  });

  // Add form submission validation
  form.addEventListener('submit', function(event) {
    if (!validateForm()) {
      event.preventDefault();
      
      // Focus on first error field
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Announce validation errors to screen readers
      announceValidationErrors();
    }
  });

  // Special handling for radio buttons
  const radioButtons = form.querySelectorAll('input[type="radio"]');
  radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
      validateMembershipSelection();
    });
  });
}

// Validate individual field
function validateField(input) {
  const errorElement = document.getElementById(input.id + '-error');
  if (!errorElement) return;

  let isValid = true;
  let errorMessage = '';

  // Clear previous error state
  input.classList.remove('error');
  errorElement.textContent = '';

  // Check if required field is empty
  if (input.hasAttribute('required') && !input.value.trim()) {
    isValid = false;
    errorMessage = `${getFieldLabel(input)} is required.`;
  }
  // Check pattern validation
  else if (input.hasAttribute('pattern') && input.value.trim()) {
    const pattern = new RegExp(input.getAttribute('pattern'));
    if (!pattern.test(input.value)) {
      isValid = false;
      if (input.id === 'title') {
        errorMessage = 'Title must be at least 7 characters and contain only letters, spaces, and hyphens.';
      } else {
        errorMessage = `${getFieldLabel(input)} format is invalid.`;
      }
    }
  }
  // Check email validation
  else if (input.type === 'email' && input.value.trim()) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(input.value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address.';
    }
  }
  // Check phone validation
  else if (input.type === 'tel' && input.value.trim()) {
    const phonePattern = /^[\+]?[\d\s\-\(\)]{10,}$/;
    if (!phonePattern.test(input.value)) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number.';
    }
  }

  if (!isValid) {
    input.classList.add('error');
    errorElement.textContent = errorMessage;
  }

  return isValid;
}

// Validate membership level selection
function validateMembershipSelection() {
  const radioButtons = document.querySelectorAll('input[name="membershipLevel"]');
  const errorElement = document.getElementById('membership-error');
  const fieldset = document.querySelector('fieldset');
  
  const isSelected = Array.from(radioButtons).some(radio => radio.checked);
  
  if (!isSelected) {
    fieldset.classList.add('error');
    errorElement.textContent = 'Please select a membership level.';
    return false;
  } else {
    fieldset.classList.remove('error');
    errorElement.textContent = '';
    return true;
  }
}

// Clear error state when user starts typing
function clearError(input) {
  const errorElement = document.getElementById(input.id + '-error');
  if (errorElement && input.classList.contains('error')) {
    input.classList.remove('error');
    errorElement.textContent = '';
  }
}

// Validate entire form
function validateForm() {
  let isValid = true;
  
  // Validate all required and pattern fields
  const inputs = document.querySelectorAll('input[required], input[pattern]');
  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  // Validate membership selection
  if (!validateMembershipSelection()) {
    isValid = false;
  }

  return isValid;
}

// Get field label for error messages
function getFieldLabel(input) {
  const label = document.querySelector(`label[for="${input.id}"]`);
  if (label) {
    return label.textContent.replace('*', '').trim();
  }
  return input.name || input.id;
}

// Announce validation errors to screen readers
function announceValidationErrors() {
  const errors = document.querySelectorAll('.error-message');
  const errorMessages = Array.from(errors)
    .filter(error => error.textContent.trim())
    .map(error => error.textContent)
    .join('. ');

  if (errorMessages) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    announcement.textContent = `Form validation errors: ${errorMessages}`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 2000);
  }
}

// Initialize modal handlers
function initializeModalHandlers() {
  const triggers = document.querySelectorAll('.modal-trigger');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close');

  // Open modal when trigger is clicked
  triggers.forEach(trigger => {
    trigger.addEventListener('click', function(event) {
      event.preventDefault();
      const modalId = this.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      
      if (modal) {
        openModal(modal);
      }
    });
  });

  // Close modal when close button is clicked
  closeButtons.forEach(closeButton => {
    closeButton.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        closeModal(modal);
      }
    });
  });

  // Close modal when clicking outside content
  modals.forEach(modal => {
    modal.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close modal on Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const openModal = document.querySelector('.modal[style*="block"]');
      if (openModal) {
        closeModal(openModal);
      }
    }
  });
}

// Open modal with accessibility features
function openModal(modal) {
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  
  // Focus on the close button
  const closeButton = modal.querySelector('.close');
  if (closeButton) {
    setTimeout(() => closeButton.focus(), 100);
  }
  
  // Trap focus within modal
  trapFocus(modal);
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal(modal) {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  
  // Return focus to trigger button
  const modalId = modal.id;
  const trigger = document.querySelector(`[data-modal="${modalId}"]`);
  if (trigger) {
    trigger.focus();
  }
  
  // Restore body scroll
  document.body.style.overflow = '';
}

// Trap focus within modal
function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  modal.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
}

// Initialize card animations
function initializeCardAnimations() {
  const cards = document.querySelectorAll('.membership-card');
  
  // Apply initial hidden state for animation
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
  });
  
  // Animate cards in sequence
  setTimeout(() => {
    cards.forEach((card, index) => {
      const delay = parseFloat(card.getAttribute('data-delay')) || 0;
      
      setTimeout(() => {
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, delay * 1000);
    });
  }, 100);
}

// Initialize accessibility features
function initializeAccessibility() {
  // Add focus indicators for form elements
  const formElements = document.querySelectorAll('input, select, textarea, button');
  formElements.forEach(element => {
    element.addEventListener('focus', function() {
      this.setAttribute('data-focused', 'true');
    });
    
    element.addEventListener('blur', function() {
      this.removeAttribute('data-focused');
    });
  });

  // Enhance keyboard navigation for radio buttons
  const radioGroups = document.querySelectorAll('[role="radiogroup"]');
  radioGroups.forEach(group => {
    const radios = group.querySelectorAll('input[type="radio"]');
    
    radios.forEach((radio, index) => {
      radio.addEventListener('keydown', function(event) {
        let targetIndex = index;
        
        switch(event.key) {
          case 'ArrowDown':
          case 'ArrowRight':
            event.preventDefault();
            targetIndex = (index + 1) % radios.length;
            break;
          case 'ArrowUp':
          case 'ArrowLeft':
            event.preventDefault();
            targetIndex = index > 0 ? index - 1 : radios.length - 1;
            break;
          default:
            return;
        }
        
        radios[targetIndex].focus();
        radios[targetIndex].checked = true;
        validateMembershipSelection();
      });
    });
  });
}

// Utility function to format phone numbers on input
function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length >= 6) {
    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
  } else if (value.length >= 3) {
    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
  }
  
  input.value = value;
}

// Add phone formatting to phone input
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', function() {
    formatPhoneNumber(this);
  });
}

// Export functions for potential testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateField,
    validateForm,
    validateMembershipSelection
  };
}