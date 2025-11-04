// ========================================
// VALIDATION.JS - Form Validation
// ========================================

// ========================================
// EMAIL VALIDATION
// ========================================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========================================
// CONTACT FORM VALIDATION
// ========================================

function initContactFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearErrors();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            
            // Validate name
            if (name === '') {
                showError('name', 'Name is required');
                isValid = false;
            } else if (name.length < 2) {
                showError('name', 'Name must be at least 2 characters');
                isValid = false;
            }
            
            // Validate email
            if (email === '') {
                showError('email', 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate subject
            if (subject === '') {
                showError('subject', 'Subject is required');
                isValid = false;
            } else if (subject.length < 5) {
                showError('subject', 'Subject must be at least 5 characters');
                isValid = false;
            }
            
            // Validate message
            if (message === '') {
                showError('message', 'Message is required');
                isValid = false;
            } else if (message.length < 10) {
                showError('message', 'Message must be at least 10 characters');
                isValid = false;
            }
            
            // If valid, submit form
            if (isValid) {
                handleContactFormSubmit(name, email, subject, message);
            }
        });
    }
}

function handleContactFormSubmit(name, email, subject, message) {
    // Save via API
    submitContactAPI({ name, email, subject, message }).then(data => {
        if (data && data.success) {
            showSuccessMessage(data.message);
            document.getElementById('contactForm').reset();
        } else {
            showErrorMessage(data?.message || 'Error submitting form');
        }
    });
}

// ========================================
// BLOG FORM VALIDATION
// ========================================

function initBlogFormValidation() {
    const blogForm = document.getElementById('blogForm');
    
    if (blogForm) {
        blogForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearErrors();
            
            // Get form values
            const title = document.getElementById('blogTitle').value.trim();
            const category = document.getElementById('blogCategory').value;
            const image = document.getElementById('finalImageUrl').value.trim();
            const content = document.getElementById('blogContent').value.trim();
            
            let isValid = true;
            
            // Validate title
            if (title === '') {
                showError('blogTitle', 'Title is required');
                isValid = false;
            } else if (title.length < 10) {
                showError('blogTitle', 'Title must be at least 10 characters');
                isValid = false;
            }
            
            // Validate category
            if (category === '') {
                showError('blogCategory', 'Please select a category');
                isValid = false;
            }
            
            // Validate image (URL or uploaded file)
            const finalImageUrl = document.getElementById('finalImageUrl').value.trim();
            if (!finalImageUrl) {
                showError('blogImage', 'Please provide an image URL or upload an image');
                isValid = false;
            }
            
            // Validate content
            if (content === '') {
                showError('blogContent', 'Content is required');
                isValid = false;
            } else if (content.length < 100) {
                showError('blogContent', 'Content must be at least 100 characters');
                isValid = false;
            }
            
            // If valid, submit form
            if (isValid) {
                const blogId = blogForm.dataset.editId;
                if (blogId) {
                    handleBlogUpdate(blogId, title, '', category, image, content);
                } else {
                    handleBlogFormSubmit(title, '', category, image, content);
                }
            }
        });
    }
}

// Handle blog form submission
async function handleBlogFormSubmit(title, author, category, imageUrl, content) {
    console.log('handleBlogFormSubmit called');
    
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    const user = (userStr && userStr !== 'undefined' && userStr !== 'null') ? JSON.parse(userStr) : null;
    if (!user) {
        alert('Please login to create a blog');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return;
    }
    
    console.log('User is logged in:', user.name);
    console.log('Creating blog with data:', { title, category, imageUrl, content });
    
    // Show loading state
    const submitBtn = document.querySelector('#blogForm button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Publishing...';
    
    try {
        // Create blog via direct fetch
        const token = localStorage.getItem('token');
        const response = await fetch('/api/blogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                category,
                image: imageUrl,  // Backend expects 'image'
                content
            })
        });
        
        const data = await response.json();
        console.log('API response:', data);
        
        if (response.ok && data.success) {
            showSuccess('Blog published successfully!');
            document.getElementById('blogForm').reset();
            
            setTimeout(() => {
                window.location.href = 'blog-list.html';
            }, 1500);
        } else {
            const errorMsg = data?.message || 'Failed to publish blog';
            alert('Error: ' + errorMsg);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    } catch (error) {
        console.error('Error creating blog:', error);
        alert('Error creating blog: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}
// Handle blog update
async function handleBlogUpdate(blogId, title, author, category, imageUrl, content) {
    try {
        const response = await api.updateBlog(blogId, {
            title,
            category,
            imageUrl,
            content
        });
        
        showSuccess('Blog updated successfully!');
        setTimeout(() => {
            window.location.href = 'blog-list.html';
        }, 1500);
    } catch (error) {
        alert('Error updating blog: ' + error.message);
    }
}

// ========================================
// CONTACT FORM API SUBMISSION
// ========================================

async function handleContactFormSubmit(name, email, subject, message) {
    try {
        const response = await api.submitContact({ name, email, subject, message });
        showSuccess('Message sent successfully!');
        document.getElementById('contactForm').reset();
    } catch (error) {
        alert('Error submitting form: ' + error.message);
    }
}

// ========================================
// ADMIN LOGIN VALIDATION
// ========================================

function initLoginFormValidation() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearErrors();
            
            // Get form values
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            let isValid = true;
            
            // Validate username
            if (username === '') {
                showError('username', 'Username is required');
                isValid = false;
            }
            
            // Validate password
            if (password === '') {
                showError('password', 'Password is required');
                isValid = false;
            }
            
            // Check credentials (hardcoded for demo)
            if (isValid) {
                if (username === 'admin' && password === 'admin123') {
                    // Set login session
                    sessionStorage.setItem('adminLoggedIn', 'true');
                    showSuccessMessage('Login successful! Redirecting...');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    showError('password', 'Invalid username or password');
                }
            }
        });
    }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('error');
        
        // Create or update error message
        let errorDiv = field.parentElement.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            field.parentElement.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
    }
}

function clearErrors() {
    // Remove error classes
    document.querySelectorAll('.form-control.error, .form-select.error').forEach(field => {
        field.classList.remove('error');
    });
    
    // Hide error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('show');
    });
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function showSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 150);
    }, 3000);
}

// Initialize validation when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initContactFormValidation();
    initBlogFormValidation();
    initLoginFormValidation();
});
