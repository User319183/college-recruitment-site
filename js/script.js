/**
 * Main bootstrapping block: waits for DOM readiness and then wires up
 * all interactive modules (counters, navigation enhancements, form logic
 * and scroll / reveal animations). Kept intentionally lean so each concern
 * lives in its own initializer for readability & potential lazy-loading.
 */
document.addEventListener('DOMContentLoaded', function () { // Listen for full HTML parse before running setup
    console.log('Rutgers University website initialized'); // Debug log confirming script start

    // Kick off individual feature initializers.
    initializeCounters();          // Start statistic counters (lazy triggered by IntersectionObserver)
    initializeScrollEffects();     // Attach fade-in scroll observer
    initializeNavigation();        // Enable smooth scroll + active nav highlighting
    initializeInfoRequestForm();   // Hook realtime validation for info request form
    initializeRevealAnimations();  // Prepare staggered reveal animations

    console.log('All interactive elements initialized'); // Debug log after initializers run
}); // End DOMContentLoaded handler

/**
 * Sets up animated number counters that increment once the elements
 * become sufficiently visible in the viewport.
 * Uses IntersectionObserver to avoid doing work when off-screen.
 */
function initializeCounters() { // Initialize number counters with lazy start
    const counters = [ // Array of counter configuration objects
        { element: document.getElementById('student-count'), target: 71000, suffix: '+' }, // Students count element
        { element: document.getElementById('program-count'), target: 150, suffix: '+' },   // Programs count element
        { element: document.getElementById('faculty-count'), target: 9000, suffix: '+' },  // Faculty count element
        { element: document.getElementById('alumni-count'), target: 500000, suffix: '+' }  // Alumni count element
    ]; // End counters config array

    const observerOptions = { // IntersectionObserver tuning for counters
        threshold: 0.5, // At least 50% visible before triggering
        rootMargin: '0px 0px -100px 0px' // Slight bottom margin to start a bit earlier
    }; // End observer options

    const counterObserver = new IntersectionObserver((entries) => { // Observer callback for counters
        entries.forEach(entry => { // Iterate each observed entry
            if (entry.isIntersecting) { // Only act if element enters viewport
                const counter = counters.find(c => c.element === entry.target); // Find matching counter config
                if (counter && !counter.element.classList.contains('counting')) { // Ensure not already animating
                    animateCounter(counter.element, counter.target, counter.suffix); // Start animation
                    counterObserver.unobserve(entry.target); // Stop observing after first trigger
                } // End if found & not counting
            } // End if isIntersecting
        }); // End forEach entry
    }, observerOptions); // Provide observer options

    // Observe each counter so animation only triggers once when visible.
    counters.forEach(counter => { // Loop counters
        if (counter.element) { // Skip if element missing in DOM
            counterObserver.observe(counter.element); // Start observing this element
        } // End if element exists
    }); // End counters forEach
} // End initializeCounters
/**
 * Performs the counter animation for a single element.
 * @param {HTMLElement} element - DOM element whose textContent we mutate.
 * @param {number} target - Final number to reach.
 * @param {string} [suffix] - Optional suffix appended (e.g. '+').
 */
function animateCounter(element, target, suffix = '') { // Animate numbers from 0 to target
    element.classList.add('counting'); // Mark element to avoid duplicate runs
    let current = 0; // Starting value
    const increment = target / 50; // Amount to add each frame
    const duration = 2000; // Total animation duration ms
    const stepTime = duration / 50; // Interval time for 50 steps

    const timer = setInterval(() => { // Repeatedly update value
        current += increment; // Increment current value
        if (current >= target) { // Clamp when reaching target
            current = target; // Set to final value
            clearInterval(timer); // Stop interval
        } // End clamp condition

        const formattedNumber = Math.floor(current).toLocaleString(); // Format with locale separators
        element.textContent = formattedNumber + suffix; // Update DOM text with suffix
    }, stepTime); // Interval timing
} // End animateCounter
/**
 * Wires up smooth scrolling for in-page anchor links and updates
 * active navigation state while scrolling. Also auto-hides the
 * offcanvas menu after a selection on small screens.
 */
function initializeNavigation() { // Setup smooth scrolling & active nav state
    document.querySelectorAll('a[href^="#"]').forEach(anchor => { // Select all internal anchor links
        anchor.addEventListener('click', function (e) { // Attach click handler
            e.preventDefault(); // Prevent default jump behaviour
            const target = document.querySelector(this.getAttribute('href')); // Resolve target element
            if (target) { // If target exists
                const offsetTop = target.offsetTop - 80; // Adjust for fixed nav height
                window.scrollTo({ // Smooth scroll to position
                    top: offsetTop, // Destination scroll top
                    behavior: 'smooth' // Enable smooth behavior
                }); // End scrollTo
            } // End if target exists

            // If inside offcanvas, close it on click
            const offcanvasEl = this.closest('.offcanvas'); // Find parent offcanvas if any
            if (offcanvasEl) { // If inside offcanvas
                const instance = bootstrap.Offcanvas.getInstance(offcanvasEl) || new bootstrap.Offcanvas(offcanvasEl); // Get or create instance
                instance.hide(); // Hide offcanvas after navigation
            } // End if offcanvas
        }); // End click handler
    }); // End forEach anchor

    // Update active nav highlighting as user scrolls.
    window.addEventListener('scroll', updateActiveNavigation); // Bind scroll event for active section tracking
} // End initializeNavigation
/**
 * Determines which section is currently within the viewport bounds
 * and applies an 'active' class to the corresponding nav link.
 */
function updateActiveNavigation() { // Determine active section & update nav links
    const sections = document.querySelectorAll('section[id]'); // All identifiable sections
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link'); // All navbar links

    let current = ''; // Currently active section id placeholder
    sections.forEach(section => { // Loop sections
        const sectionTop = section.offsetTop - 100; // Adjusted top boundary
        const sectionHeight = section.clientHeight; // Height of section
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) { // Check if scroll inside bounds
            current = section.getAttribute('id'); // Record current visible section id
        } // End visibility check
    }); // End sections loop

    navLinks.forEach(link => { // Iterate nav links
        link.classList.remove('active'); // Remove previous active class
        if (link.getAttribute('href') === `#${current}`) { // Match link to active section
            link.classList.add('active'); // Highlight active link
        } // End match condition
    }); // End nav links loop
} // End updateActiveNavigation
/**
 * Adds viewport-based fade-in effect to elements marked with `.fade-in`.
 * Lightweight progressive enhancement (no work done for unsupported browsers).
 */
function initializeScrollEffects() { // Prepare fade-in on scroll for .fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in'); // NodeList of fade targets

    const fadeObserver = new IntersectionObserver((entries) => { // Observer for fade elements
        entries.forEach(entry => { // Loop entries
            if (entry.isIntersecting) { // If element visible
                entry.target.classList.add('show'); // Add class to trigger CSS animation
            } // End isIntersecting
        }); // End forEach entry
    }, { // Observer options
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px' // Slight bottom margin to pre-trigger
    }); // End IntersectionObserver

    fadeElements.forEach(element => { // Observe each fade element
        fadeObserver.observe(element); // Start observing element
    }); // End forEach
} // End initializeScrollEffects
/**
 * Sets up more configurable reveal animations for elements with `.reveal`.
 * Elements can optionally specify a custom delay via `data-delay` attribute.
 */
function initializeRevealAnimations() { // Initialize staggered reveal animations
    const revealEls = document.querySelectorAll('.reveal'); // Elements needing reveal animation
    if (!revealEls.length) return; // Bail early if none
    const observer = new IntersectionObserver((entries, obs) => { // Observer with custom callback
        entries.forEach(entry => { // Iterate observed entries
            if (entry.isIntersecting) { // Only when element appears
                const target = entry.target; // Reference to target element
                const delay = target.getAttribute('data-delay'); // Optional custom delay attribute
                if (delay) target.style.setProperty('--reveal-delay', delay); // Apply CSS var if provided
                target.classList.add('visible'); // Set visible class to trigger animation
                obs.unobserve(target); // Stop observing once revealed
            } // End if intersecting
        }); // End entries forEach
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }); // Tuning for reveal start
    revealEls.forEach(el => observer.observe(el)); // Observe each reveal element
} // End initializeRevealAnimations
/**
 * Opens the application modal and focuses the first input once shown
 * for improved accessibility & keyboard workflow.
 */
function showApplicationForm() { // Display application form modal & focus first input
    const modal = new bootstrap.Modal(document.getElementById('applicationModal')); // Create bootstrap modal instance
    modal.show(); // Show modal window

    document.getElementById('applicationModal').addEventListener('shown.bs.modal', function () { // After modal fully shown
        document.getElementById('firstName').focus(); // Focus first name input for accessibility
    }); // End shown listener
} // End showApplicationForm

/**
 * Handles submission of the mock application form: basic client-side
 * validity check, optimistic UI loading state, simulated async delay,
 * and event tracking.
 * NOTE: This uses console logging only (no network persistence).
 */
function submitApplication() { // Handle mock application submission
    const form = document.getElementById('applicationForm'); // Form element reference
    const submitButton = event.target; // Button triggering submission (uses implicit global event)

    if (!form.checkValidity()) { // Validate form fields
        form.reportValidity(); // Show native validation UI
        return; // Abort submit if invalid
    } // End validity check

    const originalText = submitButton.textContent; // Store original button label
    submitButton.innerHTML = '<span class="loading"></span> Submitting...'; // Show loading spinner state
    submitButton.disabled = true; // Prevent duplicate submissions

    const formData = { // Collect form input values
        firstName: document.getElementById('firstName').value, // First name value
        lastName: document.getElementById('lastName').value, // Last name value
        email: document.getElementById('email').value, // Email value
        program: document.getElementById('program').value, // Selected program value
        startDate: document.getElementById('startDate').value, // Intended start date
        submittedAt: new Date().toISOString() // Timestamp of submission
    }; // End formData object

    setTimeout(() => { // Simulate async network request delay
        console.log('Application submitted:', formData); // Log simulated submission payload

        showSuccessMessage('Application submitted successfully! We\'ll contact you within 2 business days.'); // Show success feedback

        form.reset(); // Clear form fields
        const modal = bootstrap.Modal.getInstance(document.getElementById('applicationModal')); // Get existing modal instance
        modal.hide(); // Hide modal after submission

        submitButton.innerHTML = originalText; // Restore original button text
        submitButton.disabled = false; // Re-enable button

        trackEvent('application_submitted', formData.program); // Track analytics event

    }, 2000); // Delay duration
} // End submitApplication
/**
 * Generic transient success toast/message creator. Reuses existing
 * container if already created.
 * @param {string} message - User-facing success copy.
 */
function showSuccessMessage(message) { // Display transient success toast
    let successDiv = document.querySelector('.success-message'); // Lookup existing success container
    if (!successDiv) { // If missing create it
        successDiv = document.createElement('div'); // Create div element
        successDiv.className = 'success-message'; // Assign CSS class
        document.body.appendChild(successDiv); // Append to body
    } // End creation block

    successDiv.textContent = message; // Set message text
    successDiv.style.display = 'block'; // Make toast visible

    setTimeout(() => { // Schedule hide
        successDiv.style.display = 'none'; // Hide after timeout
    }, 5000); // Display duration ms
} // End showSuccessMessage
/**
 * Lightweight analytics stub. In a production setup this would forward
 * data to an analytics endpoint instead of console logging.
 * @param {string} eventName
 * @param {*} eventData
 */
function trackEvent(eventName, eventData) { // Stub analytics tracker
    console.log(`Event tracked: ${eventName}`, eventData); // Log event name + data to console
} // End trackEvent
/**
 * Binds real-time validation for the Info Request form fields so the
 * user receives immediate feedback while typing.
 */
function initializeInfoRequestForm() { // Setup realtime validation for info request form
    const form = document.getElementById('infoRequestForm'); // Form reference
    if (!form) return; // Exit if not present on page
    ['riFirstName', 'riLastName', 'riEmail'].forEach(id => { // Required field ids
        const el = document.getElementById(id); // Field element
        el && el.addEventListener('input', () => validateBasic(el)); // Attach input listener if exists
    }); // End forEach ids
} // End initializeInfoRequestForm
/**
 * Minimal validity styling toggle for real-time form feedback.
 * @param {HTMLElement} field
 */
function validateBasic(field) { // Simple validity feedback toggle
    if (!field) return; // Guard against null
    if (field.checkValidity()) { // If field valid
        field.classList.remove('is-invalid'); // Remove invalid class
        field.classList.add('is-valid'); // Add valid class
    } else { // If invalid
        field.classList.remove('is-valid'); // Remove valid class
        field.classList.add('is-invalid'); // Add invalid indicator
    } // End validity branch
} // End validateBasic
/**
 * Submission handler for the Info Request form. Validates required
 * fields, simulates async submission, displays success feedback, and
 * logs a tracking event.
 */
function submitInfoRequest() { // Handle info request form submission
    const form = document.getElementById('infoRequestForm'); // Form reference
    if (!form) return; // Exit if not present
    const requiredIds = ['riFirstName', 'riLastName', 'riEmail']; // Required fields list
    let valid = true; // Assume valid until proven otherwise
    requiredIds.forEach(id => { // Loop required fields
        const field = document.getElementById(id); // Field element
        if (!field.checkValidity()) { // If invalid
            field.classList.add('is-invalid'); // Mark invalid visually
            valid = false; // Flip validity flag
        } // End validity condition
    }); // End loop
    if (!valid) return; // Abort if any invalid
    const btn = document.getElementById('infoSubmitBtn'); // Submit button reference
    const original = btn.innerHTML; // Store original button content
    btn.disabled = true; // Disable button while processing
    btn.innerHTML = '<span class="loading"></span> Sending...'; // Show loading indicator
    const payload = { // Construct submission payload
        firstName: document.getElementById('riFirstName').value.trim(), // First name trimmed
        lastName: document.getElementById('riLastName').value.trim(), // Last name trimmed
        email: document.getElementById('riEmail').value.trim(), // Email trimmed
        interest: document.getElementById('riInterest').value, // Interest selection
        message: document.getElementById('riMessage').value.trim(), // Message trimmed
        submittedAt: new Date().toISOString() // Timestamp for tracking
    }; // End payload object
    setTimeout(() => { // Simulate asynchronous processing
        console.log('Info request submitted', payload); // Log payload for debugging
        const success = document.getElementById('infoSuccess'); // Success message container
        if (success) { // If container present
            success.classList.remove('d-none'); // Unhide success message
            success.textContent = 'Thank you! Your request has been received. We will respond shortly.'; // Set message text
        } // End success existence check
        form.reset(); // Clear form inputs
        btn.disabled = false; // Re-enable submit button
        btn.innerHTML = original; // Restore original button label
        trackEvent('info_request_submitted', payload.interest); // Track analytics event
    }, 1500); // Artificial delay length
} // End submitInfoRequest
/**
 * Simple client-side filter for program card elements based on
 * a data-category attribute. Pass 'all' to show everything.
 * @param {string} criteria
 */
function filterPrograms(criteria) { // Filter program cards by category
    const cards = document.querySelectorAll('#programs [data-category]'); // All program card elements
    cards.forEach(card => { // Loop each card
        const matches = criteria === 'all' || card.getAttribute('data-category') === criteria; // Determine if card matches filter
        card.style.display = matches ? '' : 'none'; // Show or hide based on match
    }); // End forEach
} // End filterPrograms
/**
 * Returns a debounced version of a function that delays execution until
 * after `wait` ms have elapsed since the last invocation.
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function}
 */
function debounce(func, wait) { // Create debounced function
    let timeout; // Timer id storage
    return function executedFunction(...args) { // Wrapper function returned
        const later = () => { // Function to run after delay
            clearTimeout(timeout); // Clear stored timer id
            func(...args); // Invoke original function with arguments
        }; // End later function
        clearTimeout(timeout); // Clear any pending invocation
        timeout = setTimeout(later, wait); // Schedule new invocation
    }; // End returned function
} // End debounce
/**
 * Placeholder for potential dynamic content loading hook.
 * Currently logs to console only.
 */
function loadDynamicContent(section) { // Placeholder dynamic loader
    console.log(`Loading content for section: ${section}`); // Log which section would load
} // End loadDynamicContent
/**
 * Adds blur & input validation listeners to all bootstrap-styled inputs
 * to give real-time feedback as users correct errors.
 */
function enhanceFormInputs() { // Attach validation behaviors to form inputs
    const inputs = document.querySelectorAll('.form-control, .form-select'); // Collect all input/select controls
    inputs.forEach(input => { // Loop each field
        input.addEventListener('blur', function () { // On blur validate
            validateField(this); // Validate current field
        }); // End blur listener

        input.addEventListener('input', function () { // On input while invalid revalidate
            if (this.classList.contains('is-invalid')) { // Only if previously invalid
                validateField(this); // Re-validate field to update state
            } // End invalid check
        }); // End input listener
    }); // End inputs forEach
} // End enhanceFormInputs

/**
 * Generic validity indicator toggle used by multiple form handlers.
 * @param {HTMLElement} field
 * @returns {boolean} whether field is valid
 */
function validateField(field) { // Generic field validity toggle
    const isValid = field.checkValidity(); // Native validity check
    field.classList.remove('is-valid', 'is-invalid'); // Remove previous state classes
    field.classList.add(isValid ? 'is-valid' : 'is-invalid'); // Apply appropriate class

    return isValid; // Return boolean result
} // End validateField
// Secondary DOMContentLoaded listener: sets up baseline real-time validation
// styling for generic form inputs (separate from main initializer for clarity).
document.addEventListener('DOMContentLoaded', enhanceFormInputs); // Add second load handler for form input enhancement

/**
 * Collapses the mobile navbar after selecting a link (improves UX so the
 * user immediately sees navigated content without needing to close menu manually).
 */
document.addEventListener('DOMContentLoaded', function () { // Collapse mobile navbar after selection
    const navbarToggler = document.querySelector('.navbar-toggler'); // Toggler button element
    const navbarCollapse = document.querySelector('.navbar-collapse'); // Collapse container element

    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => { // Iterate navigation links
        link.addEventListener('click', () => { // On nav link click
            if (navbarCollapse.classList.contains('show')) { // If navbar currently expanded
                navbarToggler.click(); // Programmatically trigger collapse
            } // End if expanded
        }); // End click handler
    }); // End links forEach
}); // End DOMContentLoaded for navbar collapse
