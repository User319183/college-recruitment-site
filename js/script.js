document.addEventListener('DOMContentLoaded', function() {
    console.log('Rutgers University website initialized');
    
    initializeCounters();
    initializeScrollEffects();
    initializeNavigation();
    initializeInfoRequestForm();
    initializeRevealAnimations();
    
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
function initializeInfoRequestForm() {
    const form = document.getElementById('infoRequestForm');
    if (!form) return;
    ['riFirstName','riLastName','riEmail'].forEach(id => {
        const el = document.getElementById(id);
        el && el.addEventListener('input', () => validateBasic(el));
    });
}
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
function submitInfoRequest() {
    const form = document.getElementById('infoRequestForm');
    if (!form) return;
    const requiredIds = ['riFirstName','riLastName','riEmail'];
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
function filterPrograms(criteria) {
    const cards = document.querySelectorAll('#programs [data-category]');
    cards.forEach(card => {
        const matches = criteria === 'all' || card.getAttribute('data-category') === criteria;
        card.style.display = matches ? '' : 'none';
    });
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
