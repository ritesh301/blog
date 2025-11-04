// ========================================
// ADMIN.JS - Admin Dashboard & CRUD Operations
// ========================================

// ========================================
// CHECK AUTHENTICATION
// ========================================

function checkAdminAuth() {
    const userStr = localStorage.getItem('user');
    const user = (userStr && userStr !== 'undefined' && userStr !== 'null') ? JSON.parse(userStr) : null;
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    
    if (user && user.role === 'admin') {
        if (loginSection) loginSection.style.display = 'none';
        if (dashboardSection) {
            dashboardSection.style.display = 'block';
            // Only load dashboard if we're on the admin dashboard page
            loadDashboard();
        }
    } else {
        if (loginSection) loginSection.style.display = 'block';
        if (dashboardSection) dashboardSection.style.display = 'none';
    }
}

// ========================================
// LOGOUT
// ========================================

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// ========================================
// LOAD DASHBOARD
// ========================================

async function loadDashboard() {
    await updateStats();
    await loadBlogsTable();
    await loadContactsTable();
}

// ========================================
// UPDATE STATISTICS
// ========================================

async function updateStats() {
    try {
        // Check if stats elements exist before trying to update them
        const totalBlogsEl = document.getElementById('totalBlogs');
        const totalContactsEl = document.getElementById('totalContacts');
        const totalLikesEl = document.getElementById('totalLikes');
        const totalCommentsEl = document.getElementById('totalComments');
        
        if (!totalBlogsEl || !totalContactsEl || !totalLikesEl || !totalCommentsEl) {
            // Not on dashboard page, skip stats update
            return;
        }
        
        const blogs = await api.getAllBlogs();
        const contacts = await api.getAllContacts();
        
        // Total blogs
        totalBlogsEl.textContent = blogs.length;
        
        // Total contacts
        totalContactsEl.textContent = contacts.length;
        
        // Calculate total likes
        const totalLikes = blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);
        totalLikesEl.textContent = totalLikes;
        
        // Calculate total comments
        const totalComments = blogs.reduce((sum, blog) => sum + (blog.comments?.length || 0), 0);
        totalCommentsEl.textContent = totalComments;
        
    } catch (error) {
        console.error('Error loading stats:', error);
        showAlert('Error loading dashboard statistics', 'danger');
    }
}

// ========================================
// LOAD BLOGS TABLE
// ========================================

async function loadBlogsTable() {
    try {
        const blogs = await api.getAllBlogs();
        const tbody = document.getElementById('blogsTableBody');
        
        if (!tbody) return;
        
        if (blogs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <i class="fas fa-folder-open fa-3x mb-3" style="color: var(--border-color);"></i>
                        <p>No blogs found. Create your first blog!</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = '';
        
        blogs.forEach((blog, index) => {
            const row = document.createElement('tr');
            const categoryColor = getCategoryColor(blog.category);
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <strong>${truncateText(blog.title, 50)}</strong>
                </td>
                <td>${blog.author?.name || 'Unknown'}</td>
                <td>
                    <span class="badge" style="background-color: ${categoryColor}">
                        ${blog.category}
                    </span>
                </td>
                <td>${formatDate(blog.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="editBlog('${blog._id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="confirmDeleteBlog('${blog._id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading blogs:', error);
        showAlert('Error loading blogs', 'danger');
    }
}

// ========================================
// EDIT BLOG
// ========================================

function editBlog(blogId) {
    // Redirect to write-blog page with blog ID
    window.location.href = 'write-blog.html?edit=' + blogId;
}

// Load blog for editing
async function loadBlogForEdit() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('edit');
    
    if (!blogId) return;
    
    try {
        const blog = await api.getBlogById(blogId);
        
        if (!blog) {
            showErrorMessage('Blog not found!');
            return;
        }
        
        // Update page title
        const pageTitle = document.querySelector('h2');
        if (pageTitle) {
            pageTitle.textContent = 'Edit Blog';
        }
        
        // Update submit button text
        const submitBtn = document.querySelector('#blogForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-save me-2"></i>Update Blog';
        }
        
        // Populate form fields
        document.getElementById('blogTitle').value = blog.title;
        document.getElementById('blogCategory').value = blog.category;
        document.getElementById('blogImage').value = blog.imageUrl;
        document.getElementById('blogContent').value = blog.content;
        
        // Store blog ID in form
        document.getElementById('blogForm').dataset.editId = blogId;
        
    } catch (error) {
        console.error('Error loading blog:', error);
        showErrorMessage('Error loading blog for editing');
    }
}

// ========================================
// DELETE BLOG
// ========================================

function confirmDeleteBlog(blogId) {
    // Create confirmation modal
    const modalHtml = `
        <div class="modal fade" id="deleteConfirmModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Delete</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to delete this blog?</p>
                        <p class="text-danger">This action cannot be undone.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" onclick="deleteBlog('${blogId}')">
                            <i class="fas fa-trash me-2"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('deleteConfirmModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    modal.show();
}

async function deleteBlog(blogId) {
    try {
        await api.deleteBlog(blogId);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
        if (modal) {
            modal.hide();
        }
        
        // Remove modal from DOM
        setTimeout(() => {
            const modalEl = document.getElementById('deleteConfirmModal');
            if (modalEl) {
                modalEl.remove();
            }
        }, 300);
        
        // Show success message
        showSuccessMessage('Blog deleted successfully!');
        
        // Reload dashboard
        loadDashboard();
        
    } catch (error) {
        console.error('Error deleting blog:', error);
        showAlert('Error deleting blog: ' + error.message, 'danger');
    }
}

// ========================================
// VIEW CONTACTS
// ========================================

async function loadContactsTable() {
    try {
        const contacts = await api.getAllContacts();
        const tbody = document.getElementById('contactsTableBody');
        
        if (!tbody) return;
        
        if (contacts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4">
                        <i class="fas fa-envelope-open fa-3x mb-3" style="color: var(--border-color);"></i>
                        <p>No contact messages yet.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = '';
        
        contacts.reverse().forEach((contact, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contacts.length - index}</td>
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.subject}</td>
                <td>${formatDate(contact.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewContactMessage('${contact._id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading contacts:', error);
        showAlert('Error loading contact messages', 'danger');
    }
}

async function viewContactMessage(contactId) {
    try {
        const contacts = await api.getAllContacts();
        const contact = contacts.find(c => c._id === contactId);
        
        if (!contact) return;
        
        const modalHtml = `
            <div class="modal fade" id="contactModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Contact Message</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Name:</strong> ${contact.name}</p>
                            <p><strong>Email:</strong> ${contact.email}</p>
                            <p><strong>Subject:</strong> ${contact.subject}</p>
                            <p><strong>Date:</strong> ${formatDate(contact.createdAt)}</p>
                            <hr>
                            <p><strong>Message:</strong></p>
                            <p>${contact.message}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal
        const existingModal = document.getElementById('contactModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('contactModal'));
        modal.show();
        
    } catch (error) {
        console.error('Error viewing contact:', error);
        showAlert('Error viewing contact message', 'danger');
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function getCategoryColor(category) {
    const colors = {
        'Technology': '#007bff',
        'Lifestyle': '#28a745',
        'Travel': '#17a2b8',
        'Food': '#ffc107',
        'Health': '#dc3545',
        'Business': '#6c757d'
    };
    return colors[category] || '#6c757d';
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function showSuccessMessage(message) {
    showAlert(message, 'success');
}

function showErrorMessage(message) {
    showAlert(message, 'danger');
}

function showAlert(message, type) {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3" role="alert" style="z-index: 9999;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', alertHtml);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 150);
        });
    }, 3000);
}

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    
    // Check if on write-blog page for editing
    if (window.location.pathname.includes('write-blog.html')) {
        loadBlogForEdit();
    }
});
