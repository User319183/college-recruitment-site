document.addEventListener('DOMContentLoaded', function() {
    console.log('Rutgers University website initialized');
    
    initializeCounters();
    initializeScrollEffects();
    initializeNavigation();
    
    console.log('All interactive elements initialized');
});

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
    
    counters.forEach(counter => {
        if (counter.element) {
            counterObserver.observe(counter.element);
        }
    });
}
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
        });
    });
    
    window.addEventListener('scroll', updateActiveNavigation);
}
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
function showApplicationForm() {
    const modal = new bootstrap.Modal(document.getElementById('applicationModal'));
    modal.show();
    
    document.getElementById('applicationModal').addEventListener('shown.bs.modal', function () {
        document.getElementById('firstName').focus();
    });
}

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
function trackEvent(eventName, eventData) {
    console.log(`Event tracked: ${eventName}`, eventData);
}
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
function loadDynamicContent(section) {
    console.log(`Loading content for section: ${section}`);
}
function enhanceFormInputs() {
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
document.addEventListener('DOMContentLoaded', enhanceFormInputs);

document.addEventListener('DOMContentLoaded', function() {
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
