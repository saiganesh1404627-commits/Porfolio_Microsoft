/**
 * Malekar Sai Ganesh - Web Development Portfolio UI Scripts
 * 
 * Vanilla JS logic implementing accessible interactions:
 * 1. Dark/Light Theme Switching with persistent localStorage and screen reader alerts.
 * 2. Mobile Nav Drawer Toggle with focus trapping, Escape close, and active state management.
 * 3. Progressive HTML5 Form Validation highlighting and focusing invalid nodes.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ----------------------------------------------------
  // 1. DUAL THEME TOGGLE & PERSISTENCE
  // ----------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');

  // A11y Decision: Check system preferences (prefers-color-scheme) if no override is saved.
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultTheme = prefersDark ? 'dark' : 'light';

  // Apply target startup theme
  const activeTheme = savedTheme || defaultTheme;
  document.documentElement.setAttribute('data-theme', activeTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme');
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Update screen-readers of theme transition
      announceThemeChange(newTheme);
    });
  }

  // A11y Decision: Create a dynamic aria-live region to announce theme updates.
  function announceThemeChange(theme) {
    let announcer = document.getElementById('theme-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'theme-announcer';
      announcer.className = 'sr-only';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      document.body.appendChild(announcer);
    }
    announcer.textContent = `Theme changed to ${theme} mode.`;
  }


  // ----------------------------------------------------
  // 2. MOBILE NAVIGATION DRAWER & FOCUS MANAGEMENT
  // ----------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');
  
  if (menuToggle && navMenu && navOverlay) {
    // Collect all links inside the mobile drawer for focus trapping
    const focusableLinks = navMenu.querySelectorAll('a');
    const firstLink = focusableLinks[0];
    const lastLink = focusableLinks[focusableLinks.length - 1];

    function toggleMenu(forceClose) {
      const isOpen = forceClose !== undefined ? !forceClose : menuToggle.getAttribute('aria-expanded') === 'true';
      
      if (isOpen) {
        // Close the navigation drawer
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
        navOverlay.classList.remove('open');
        navOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // A11y Decision: Restore keyboard focus back to the toggle button
        menuToggle.focus();
      } else {
        // Open the navigation drawer
        menuToggle.setAttribute('aria-expanded', 'true');
        navMenu.classList.add('open');
        navOverlay.classList.add('open');
        navOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // A11y Decision: Focus first active menu link immediately
        setTimeout(() => firstLink.focus(), 100);
      }
    }

    menuToggle.addEventListener('click', () => toggleMenu());
    navOverlay.addEventListener('click', () => toggleMenu(true));

    // Close menu when links are activated (helps in single-page navigation fragments)
    focusableLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(true));
    });

    // Keyboard navigation focus trap inside mobile drawer
    document.addEventListener('keydown', (e) => {
      const isDrawerActive = menuToggle.getAttribute('aria-expanded') === 'true';
      if (!isDrawerActive) return;

      // Close drawer if user hits Escape key
      if (e.key === 'Escape') {
        toggleMenu(true);
        return;
      }

      // Trap Tab key navigation index limits
      if (e.key === 'Tab') {
        if (e.shiftKey) { // Shift + Tab (Backward navigation)
          if (document.activeElement === firstLink) {
            lastLink.focus();
            e.preventDefault();
          }
        } else { // Tab (Forward navigation)
          if (document.activeElement === lastLink) {
            firstLink.focus();
            e.preventDefault();
          }
        }
      }
    });
  }


  // ----------------------------------------------------
  // 3. ACCESSIBLE FORM VALIDATION (PROGRESSIVE ENHANCEMENT)
  // ----------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    const feedbackBanner = document.getElementById('form-feedback');
    
    // Constraints match HTML5 markup (required, minlength, type="email")
    const fields = [
      { id: 'name', group: 'group-name', error: 'name-error', validate: val => val.trim().length >= 2 },
      { id: 'email', group: 'group-email', error: 'email-error', validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) },
      { id: 'subject', group: 'group-subject', error: 'subject-error', validate: val => val.trim().length >= 3 },
      { id: 'message', group: 'group-message', error: 'message-error', validate: val => val.trim().length >= 10 }
    ];

    // Real-time input checking: Validate field as soon as it is corrected or blurred
    fields.forEach(field => {
      const input = document.getElementById(field.id);
      if (input) {
        input.addEventListener('input', () => {
          if (input.getAttribute('aria-invalid') === 'true') {
            validateField(field);
          }
        });
        
        input.addEventListener('blur', () => {
          validateField(field);
        });
      }
    });

    // Validate a single field's content and update its screen-reader status attributes
    function validateField(field) {
      const input = document.getElementById(field.id);
      const group = document.getElementById(field.group);
      const isValid = field.validate(input.value);

      if (isValid) {
        group.classList.remove('has-error');
        input.setAttribute('aria-invalid', 'false');
      } else {
        group.classList.add('has-error');
        input.setAttribute('aria-invalid', 'true');
      }
      return isValid;
    }

    contactForm.addEventListener('submit', (e) => {
      let firstInvalidElement = null;
      let errorCount = 0;
      
      // Validate all form fields on submission
      fields.forEach(field => {
        const isValid = validateField(field);
        if (!isValid) {
          errorCount++;
          if (!firstInvalidElement) {
            firstInvalidElement = document.getElementById(field.id);
          }
        }
      });

      // Clear previous banner states
      feedbackBanner.className = 'form-feedback';
      feedbackBanner.textContent = '';

      if (errorCount > 0) {
        // A11y Decision: Prevent default submit only when form contains errors.
        e.preventDefault();

        // Announce count using the role="alert" feedback banner
        feedbackBanner.classList.add('error');
        feedbackBanner.textContent = `The form contains ${errorCount} error${errorCount > 1 ? 's' : ''}. Please review the highlighted fields and try again.`;
        
        // A11y Decision: Focus the first invalid element to assist keyboard/screen-readers
        if (firstInvalidElement) {
          firstInvalidElement.focus();
        }
      } else {
        // Success case. If sending to a real server, we allow the request to submit naturally.
        // For static client-side demonstrative submissions:
        e.preventDefault();
        
        feedbackBanner.classList.add('success');
        const nameVal = document.getElementById('name').value.trim();
        feedbackBanner.textContent = `Thank you, ${nameVal}! Your message has been sent successfully.`;
        
        // Reset inputs and clear invalid states
        contactForm.reset();
        fields.forEach(field => {
          const input = document.getElementById(field.id);
          const group = document.getElementById(field.group);
          input.removeAttribute('aria-invalid');
          group.classList.remove('has-error');
        });

        // Focus feedback banner for instant screen-reader vocalization
        feedbackBanner.setAttribute('tabindex', '-1');
        feedbackBanner.focus();
      }
    });
  }
});
