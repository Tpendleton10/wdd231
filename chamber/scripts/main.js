// Enhanced main JavaScript functionality for Las Vegas Chamber website
document.addEventListener('DOMContentLoaded', function() {
  // Set footer information
  updateFooter();
  
  // Initialize mobile navigation
  initMobileNav();
  
  // Set active navigation link
  setActiveNavLink();
  
  // Initialize accessibility features
  initAccessibilityFeatures();
});

function updateFooter() {
  const yearElement = document.getElementById('year');
  const lastModifiedElement = document.getElementById('lastModified');
  
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  if (lastModifiedElement) {
    lastModifiedElement.textContent = document.lastModified;
  }
}

function initMobileNav() {
  const menuToggle = document.getElementById('menuToggle');
  const navList = document.getElementById('navList');
  
  if (menuToggle && navList) {
    // Set initial ARIA attributes
    menuToggle.setAttribute('aria-expanded', 'false');
    navList.setAttribute('aria-hidden', 'true');
    
    menuToggle.addEventListener('click', function() {
      const isOpen = navList.classList.contains('show');
      const willBeOpen = !isOpen;
      
      // Toggle classes
      navList.classList.toggle('show');
      
      // Update button text/icon
      menuToggle.textContent = willBeOpen ? '✕ Close' : '☰ Menu';
      
      // Update ARIA attributes for accessibility
      menuToggle.setAttribute('aria-expanded', willBeOpen.toString());
      navList.setAttribute('aria-hidden', (!willBeOpen).toString());
      
      // Focus management
      if (willBeOpen) {
        // Focus first nav link when menu opens
        const firstLink = navList.querySelector('a');
        if (firstLink) {
          setTimeout(() => firstLink.focus(), 100);
        }
      }
    });
    
    // Close mobile menu when clicking on a nav link
    const navLinks = navList.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        closeMobileMenu();
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideNav = navList.contains(event.target) || menuToggle.contains(event.target);
      
      if (!isClickInsideNav && navList.classList.contains('show')) {
        closeMobileMenu();
      }
    });
    
    // Close mobile menu on Escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && navList.classList.contains('show')) {
        closeMobileMenu();
        menuToggle.focus(); // Return focus to menu button
      }
    });
    
    // Handle keyboard navigation in mobile menu
    navList.addEventListener('keydown', function(event) {
      if (!navList.classList.contains('show')) return;
      
      const focusableElements = navList.querySelectorAll('a');
      const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
      
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex].focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
        focusableElements[prevIndex].focus();
      }
    });
  }
  
  function closeMobileMenu() {
    if (navList && menuToggle) {
      navList.classList.remove('show');
      menuToggle.textContent = '☰ Menu';
      menuToggle.setAttribute('aria-expanded', 'false');
      navList.setAttribute('aria-hidden', 'true');
    }
  }
}

function setActiveNavLink() {
  // Get current page name
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  
  // Remove active class and aria-current from all nav links
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
    
    // Add active class and aria-current to current page link
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || 
        (currentPage === '' && linkHref === 'index.html') ||
        (currentPage === 'index.html' && linkHref === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function initAccessibilityFeatures() {
  // Add skip link functionality
  addSkipLink();
  
  // Enhance focus management
  enhanceFocusManagement();
  
  // Add keyboard support for interactive elements
  addKeyboardSupport();
}

function addSkipLink() {
  // Create skip link for keyboard navigation
  const skipLink = document.createElement('a');
  skipLink.href = '#main';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--primary);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1000;
    transition: top 0.3s;
  `;
  
  // Show skip link on focus
  skipLink.addEventListener('focus', function() {
    this.style.top = '6px';
  });
  
  skipLink.addEventListener('blur', function() {
    this.style.top = '-40px';
  });
  
  // Add ID to main content if it doesn't exist
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main';
  }
  
  // Insert skip link as first element in body
  document.body.insertBefore(skipLink, document.body.firstChild);
}

function enhanceFocusManagement() {
  // Add focus styles for better visibility
  const focusStyle = document.createElement('style');
  focusStyle.textContent = `
    .focus-visible,
    *:focus-visible {
      outline: 3px solid var(--secondary) !important;
      outline-offset: 2px !important;
    }
    
    /* Hide outline for mouse users */
    *:focus:not(.focus-visible) {
      outline: none;
    }
  `;
  document.head.appendChild(focusStyle);
}

function addKeyboardSupport() {
  // Add keyboard support for CTA buttons
  const ctaButtons = document.querySelectorAll('.cta-button');
  ctaButtons.forEach(button => {
    button.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.click();
      }
    });
  });
  
  // Add keyboard support for event links
  const eventLinks = document.querySelectorAll('.event-link');
  eventLinks.forEach(link => {
    link.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.click();
      }
    });
  });
}

// Utility function for smooth scrolling to sections
function smoothScrollTo(targetId) {
  const target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    
    // Focus the target for screen readers
    target.focus();
  }
}

// Utility function for lazy loading images
function setupLazyLoading() {
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px' // Start loading 50px before image comes into view
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      img.classList.add('loaded');
    });
  }
}

// Error handling for missing resources
function handleResourceErrors() {
  // Handle image loading errors
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', function() {
      if (!this.dataset.errorHandled) {
        this.dataset.errorHandled = 'true';
        this.alt = 'Image not available';
        this.src = 'images/placeholder-logo.jpg';
      }
    });
  });
}

// Call functions that should run after DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setupLazyLoading();
    handleResourceErrors();
  });
} else {
  setupLazyLoading();
  handleResourceErrors();
}

// Export functions for use in other scripts
window.ChamberApp = {
  smoothScrollTo,
  setupLazyLoading,
  setActiveNavLink,
  handleResourceErrors
};