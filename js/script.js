/**
 * Main bootstrapping block: waits for DOM readiness and then wires up
 * all interactive modules (counters, navigation enhancements, form logic
 * and scroll / reveal animations). Kept intentionally lean so each concern
 * lives in its own initializer for readability & potential lazy-loading.
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('Rutgers University website initialized');

    // Kick off individual feature initializers.
    initializeCounters();          // Animated statistic counters (lazy start via IntersectionObserver)
    initializeScrollEffects();     // Simple fade-in elements when scrolled into view
    initializeNavigation();        // Smooth scrolling + active link highlighting
    initializeInfoRequestForm();   // Basic validation wiring for info request form
    initializeRevealAnimations();  // More elaborate staggered reveal animations

    console.log('All interactive elements initialized');
});

/**
 * Sets up animated number counters that increment once the elements
 * become sufficiently visible in the viewport.
 * Uses IntersectionObserver to avoid doing work when off-screen.
 */
function initializeCounters() {
    const counters = [
        { element: document.getElementById('student-count'), target: 71000, suffix: '+' },
        { element: document.getElementById('program-count'), target: 150, suffix: '+' },
        { element: document.getElementById('faculty-count'), target: 9000, suffix: '+' },
        { element: document.getElementById('alumni-count'), target: 500000, suffix: '+' }
    ];

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = counters.find(c => c.element === entry.target);
                if (counter && !counter.element.classList.contains('counting')) {
                    animateCounter(counter.element, counter.target, counter.suffix);
                    counterObserver.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe each counter so animation only triggers once when visible.
    counters.forEach(counter => {
        if (counter.element) {
            counterObserver.observe(counter.element);
        }
    });
}
/**
 * Performs the counter animation for a single element.
 * @param {HTMLElement} element - DOM element whose textContent we mutate.
 * @param {number} target - Final number to reach.
 * @param {string} [suffix] - Optional suffix appended (e.g. '+').
 */
function animateCounter(element, target, suffix = '') {
    element.classList.add('counting');
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        const formattedNumber = Math.floor(current).toLocaleString();
        element.textContent = formattedNumber + suffix;
    }, stepTime);
}
/**
 * Wires up smooth scrolling for in-page anchor links and updates
 * active navigation state while scrolling. Also auto-hides the
 * offcanvas menu after a selection on small screens.
 */
function initializeNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // If inside offcanvas, close it on click
            const offcanvasEl = this.closest('.offcanvas');
            if (offcanvasEl) {
                const instance = bootstrap.Offcanvas.getInstance(offcanvasEl) || new bootstrap.Offcanvas(offcanvasEl);
                instance.hide();
            }
        });
    });

    // Update active nav highlighting as user scrolls.
    window.addEventListener('scroll', updateActiveNavigation);
}
/**
 * Determines which section is currently within the viewport bounds
 * and applies an 'active' class to the corresponding nav link.
 */
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}
/**
 * Adds viewport-based fade-in effect to elements marked with `.fade-in`.
 * Lightweight progressive enhancement (no work done for unsupported browsers).
 */
function initializeScrollEffects() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
}
/**
 * Sets up more configurable reveal animations for elements with `.reveal`.
 * Elements can optionally specify a custom delay via `data-delay` attribute.
 */
function initializeRevealAnimations() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const delay = target.getAttribute('data-delay');
                if (delay) target.style.setProperty('--reveal-delay', delay);
                target.classList.add('visible');
                obs.unobserve(target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
}
/**
 * Opens the application modal and focuses the first input once shown
 * for improved accessibility & keyboard workflow.
 */
function showApplicationForm() {
    const modal = new bootstrap.Modal(document.getElementById('applicationModal'));
    modal.show();

    document.getElementById('applicationModal').addEventListener('shown.bs.modal', function () {
        document.getElementById('firstName').focus();
    });
}

/**
 * Handles submission of the mock application form: basic client-side
 * validity check, optimistic UI loading state, simulated async delay,
 * and event tracking.
 * NOTE: This uses console logging only (no network persistence).
 */
function submitApplication() {
    const form = document.getElementById('applicationForm');
    const submitButton = event.target;

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<span class="loading"></span> Submitting...';
    submitButton.disabled = true;

    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        program: document.getElementById('program').value,
        startDate: document.getElementById('startDate').value,
        submittedAt: new Date().toISOString()
    };

    setTimeout(() => {
        console.log('Application submitted:', formData);

        showSuccessMessage('Application submitted successfully! We\'ll contact you within 2 business days.');

        form.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('applicationModal'));
        modal.hide();

        submitButton.innerHTML = originalText;
        submitButton.disabled = false;

        trackEvent('application_submitted', formData.program);

    }, 2000);
}
/**
 * Generic transient success toast/message creator. Reuses existing
 * container if already created.
 * @param {string} message - User-facing success copy.
 */
function showSuccessMessage(message) {
    let successDiv = document.querySelector('.success-message');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        document.body.appendChild(successDiv);
    }

    successDiv.textContent = message;
    successDiv.style.display = 'block';

    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}
/**
 * Lightweight analytics stub. In a production setup this would forward
 * data to an analytics endpoint instead of console logging.
 * @param {string} eventName
 * @param {*} eventData
 */
function trackEvent(eventName, eventData) {
    console.log(`Event tracked: ${eventName}`, eventData);
}
/**
 * Binds real-time validation for the Info Request form fields so the
 * user receives immediate feedback while typing.
 */
function initializeInfoRequestForm() {
    const form = document.getElementById('infoRequestForm');
    if (!form) return;
    ['riFirstName', 'riLastName', 'riEmail'].forEach(id => {
        const el = document.getElementById(id);
        el && el.addEventListener('input', () => validateBasic(el));
    });
}
/**
 * Minimal validity styling toggle for real-time form feedback.
 * @param {HTMLElement} field
 */
function validateBasic(field) {
    if (!field) return;
    if (field.checkValidity()) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    }
}
/**
 * Submission handler for the Info Request form. Validates required
 * fields, simulates async submission, displays success feedback, and
 * logs a tracking event.
 */
function submitInfoRequest() {
    const form = document.getElementById('infoRequestForm');
    if (!form) return;
    const requiredIds = ['riFirstName', 'riLastName', 'riEmail'];
    let valid = true;
    requiredIds.forEach(id => {
        const field = document.getElementById(id);
        if (!field.checkValidity()) {
            field.classList.add('is-invalid');
            valid = false;
        }
    });
    if (!valid) return;
    const btn = document.getElementById('infoSubmitBtn');
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="loading"></span> Sending...';
    const payload = {
        firstName: document.getElementById('riFirstName').value.trim(),
        lastName: document.getElementById('riLastName').value.trim(),
        email: document.getElementById('riEmail').value.trim(),
        interest: document.getElementById('riInterest').value,
        message: document.getElementById('riMessage').value.trim(),
        submittedAt: new Date().toISOString()
    };
    setTimeout(() => {
        console.log('Info request submitted', payload);
        const success = document.getElementById('infoSuccess');
        if (success) {
            success.classList.remove('d-none');
            success.textContent = 'Thank you! Your request has been received. We will respond shortly.';
        }
        form.reset();
        btn.disabled = false;
        btn.innerHTML = original;
        trackEvent('info_request_submitted', payload.interest);
    }, 1500);
}
/**
 * Simple client-side filter for program card elements based on
 * a data-category attribute. Pass 'all' to show everything.
 * @param {string} criteria
 */
function filterPrograms(criteria) {
    const cards = document.querySelectorAll('#programs [data-category]');
    cards.forEach(card => {
        const matches = criteria === 'all' || card.getAttribute('data-category') === criteria;
        card.style.display = matches ? '' : 'none';
    });
}
/**
 * Returns a debounced version of a function that delays execution until
 * after `wait` ms have elapsed since the last invocation.
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function}
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
/**
 * Placeholder for potential dynamic content loading hook.
 * Currently logs to console only.
 */
function loadDynamicContent(section) {
    console.log(`Loading content for section: ${section}`);
}
/**
 * Adds blur & input validation listeners to all bootstrap-styled inputs
 * to give real-time feedback as users correct errors.
 */
function enhanceFormInputs() {
    const inputs = document.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

/**
 * Generic validity indicator toggle used by multiple form handlers.
 * @param {HTMLElement} field
 * @returns {boolean} whether field is valid
 */
function validateField(field) {
    const isValid = field.checkValidity();
    field.classList.remove('is-valid', 'is-invalid');
    field.classList.add(isValid ? 'is-valid' : 'is-invalid');

    return isValid;
}
// Secondary DOMContentLoaded listener: sets up baseline real-time validation
// styling for generic form inputs (separate from main initializer for clarity).
document.addEventListener('DOMContentLoaded', enhanceFormInputs);

/**
 * Collapses the mobile navbar after selecting a link (improves UX so the
 * user immediately sees navigated content without needing to close menu manually).
 */
document.addEventListener('DOMContentLoaded', function () {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
});
