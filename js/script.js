// TechForward College - Interactive JavaScript
// Project: College Recruitment Website - WDPP Y3 Warm-up

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('TechForward College website initialized');
    
    // Initialize all interactive elements
    initializeCounters();
    initializeScrollEffects();
    initializeNavigation();
    
    console.log('All interactive elements initialized');
});

// Statistics Counter Animation
function initializeCounters() {
    const counters = [
        { element: document.getElementById('student-count'), target: 2847, suffix: '' },
        { element: document.getElementById('program-count'), target: 15, suffix: '' },
        { element: document.getElementById('placement-rate'), target: 94, suffix: '%' },
        { element: document.getElementById('alumni-count'), target: 12500, suffix: '+' }
    ];
    
    // Intersection Observer for counter animation
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
    
    // Observe all counter elements
    counters.forEach(counter => {
        if (counter.element) {
            counterObserver.observe(counter.element);
        }
    });
}

// Counter Animation Function
function animateCounter(element, target, suffix = '') {
    element.classList.add('counting');
    let current = 0;
    const increment = target / 50; // Animation duration control
    const duration = 2000; // 2 seconds
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number with commas for large numbers
        const formattedNumber = Math.floor(current).toLocaleString();
        element.textContent = formattedNumber + suffix;
    }, stepTime);
}

// Smooth Scrolling and Navigation Effects
function initializeNavigation() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', updateActiveNavigation);
}

// Update Active Navigation Item
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

// Scroll Effects for Fade-in Animations
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

// Application Form Functions
function showApplicationForm() {
    const modal = new bootstrap.Modal(document.getElementById('applicationModal'));
    modal.show();
    
    // Focus on first input when modal opens
    document.getElementById('applicationModal').addEventListener('shown.bs.modal', function () {
        document.getElementById('firstName').focus();
    });
}

function submitApplication() {
    const form = document.getElementById('applicationForm');
    const submitButton = event.target;
    
    // Basic form validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<span class="loading"></span> Submitting...';
    submitButton.disabled = true;
    
    // Collect form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        program: document.getElementById('program').value,
        startDate: document.getElementById('startDate').value,
        submittedAt: new Date().toISOString()
    };
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        console.log('Application submitted:', formData);
        
        // Show success message
        showSuccessMessage('Application submitted successfully! We\'ll contact you within 2 business days.');
        
        // Reset form and close modal
        form.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('applicationModal'));
        modal.hide();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Track submission (for analytics)
        trackEvent('application_submitted', formData.program);
        
    }, 2000); // Simulate network delay
}

// Success Message Display
function showSuccessMessage(message) {
    // Create or update success message element
    let successDiv = document.querySelector('.success-message');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        document.body.appendChild(successDiv);
    }
    
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

// Event Tracking (placeholder for analytics)
function trackEvent(eventName, eventData) {
    console.log(`Event tracked: ${eventName}`, eventData);
    // In a real application, you would send this to your analytics service
    // Example: gtag('event', eventName, { custom_parameter: eventData });
}

// Utility Functions
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

// Dynamic Content Loading (placeholder for future features)
function loadDynamicContent(section) {
    console.log(`Loading content for section: ${section}`);
    // This function can be expanded to load content dynamically
    // Example: fetch API calls to load program details, faculty info, etc.
}

// Form Enhancement Functions
function enhanceFormInputs() {
    // Add real-time validation feedback
    const inputs = document.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const isValid = field.checkValidity();
    field.classList.remove('is-valid', 'is-invalid');
    field.classList.add(isValid ? 'is-valid' : 'is-invalid');
    
    return isValid;
}

// Initialize enhanced form features when DOM is ready
document.addEventListener('DOMContentLoaded', enhanceFormInputs);

// Responsive Navigation Toggle Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
});
