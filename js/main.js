// ========================================
// MAIN.JS - General Functionality
// ========================================

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initNavigation();
    initScrollToTop();
    initSmoothScroll();
    initAnimations();
    updateAuthUI(); // Check authentication status
});

// ========================================
// AUTHENTICATION UI MANAGEMENT
// ========================================

function updateAuthUI() {
    const userStr = localStorage.getItem('user');
    const user = (userStr && userStr !== 'undefined' && userStr !== 'null') ? JSON.parse(userStr) : null;
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const adminLink = document.getElementById('adminLink');
    const adminDivider = document.getElementById('adminDivider');
    
    if (user) {
        // User is logged in
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (userName) userName.textContent = user.name;
        
        // Show admin link if user is admin
        if (user.role === 'admin') {
            if (adminLink) {
                adminLink.style.display = 'block';
                adminLink.href = 'admin-dashboard.html';  // Update to new dashboard
            }
            if (adminDivider) adminDivider.style.display = 'block';
        }
    } else {
        // User is not logged in
        if (loginLink) loginLink.style.display = 'block';
        if (registerLink) registerLink.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
    }
}

function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// ========================================
// THEME MANAGEMENT (Dark/Light Mode)
// ========================================

function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Theme toggle event
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// ========================================
// NAVIGATION ACTIVE STATE
// ========================================

function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ========================================
// SCROLL TO TOP BUTTON
// ========================================

function initScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    
    if (scrollBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });
        
        // Scroll to top on click
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ========================================
// SMOOTH SCROLLING
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.blog-card, .mission-card, .stat-card').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Show loading spinner
function showLoading(container) {
    if (container) {
        container.innerHTML = `
            <div class="loading-spinner show">
                <div class="spinner"></div>
                <p class="mt-3">Loading...</p>
            </div>
        `;
    }
}

// Show success message
function showSuccessMessage(message, duration = 3000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, duration);
}

// Show error message
function showErrorMessage(message, duration = 3000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, duration);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'geography': 'fa-globe',
        'history': 'fa-landmark',
        'economics': 'fa-chart-line',
        'culture': 'fa-theater-masks',
        'lifestyle': 'fa-heart',
        'technology': 'fa-laptop-code',
        'science': 'fa-flask',
        'comedy': 'fa-laugh'
    };
    return icons[category.toLowerCase()] || 'fa-book';
}

// Get category color
function getCategoryColor(category) {
    const colors = {
        'geography': '#10b981',
        'history': '#f59e0b',
        'economics': '#3b82f6',
        'culture': '#8b5cf6',
        'lifestyle': '#ec4899',
        'technology': '#6366f1',
        'science': '#14b8a6',
        'comedy': '#f97316'
    };
    return colors[category.toLowerCase()] || '#6366f1';
}
