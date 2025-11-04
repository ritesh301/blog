// ========================================
// API.JS - API Helper Functions
// ========================================

// API Base URL - will be set from config.js or use environment variable
const API_BASE_URL = typeof config !== 'undefined' && config.apiBaseUrl 
    ? config.apiBaseUrl 
    : (window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/api' 
        : '/api'); // Use relative path for production (Netlify redirects)

// Get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
        return null;
    }
    try {
        return JSON.parse(userStr);
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
}

// Check if user is logged in
function isLoggedIn() {
    return !!getAuthToken();
}

// Check if user is admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// Logout user
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Fetch with auth
async function fetchWithAuth(url, options = {}) {
    const token = getAuthToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('Making request to:', url);
    console.log('With token:', token ? 'Present' : 'Missing');
    
    try {
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        // Handle unauthorized
        if (response.status === 401) {
            console.error('401 Unauthorized - Token might be invalid');
            logout();
            alert('Session expired. Please login again.');
            return null;
        }
        
        // Handle forbidden
        if (response.status === 403) {
            console.error('403 Forbidden - User might not have admin rights');
            alert('Access denied. Admin privileges required.');
            return null;
        }
        
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// ========================================
// BLOG API FUNCTIONS
// ========================================

// Get all blogs
async function getAllBlogsAPI(params = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/blogs${queryString ? '?' + queryString : ''}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return [];
    }
}

// Get single blog
async function getBlogByIdAPI(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching blog:', error);
        return null;
    }
}

// Create blog (requires auth)
async function createBlogAPI(blogData) {
    try {
        console.log('createBlogAPI called with:', blogData);
        
        const response = await fetchWithAuth(`${API_BASE_URL}/blogs`, {
            method: 'POST',
            body: JSON.stringify(blogData)
        });
        
        if (!response) {
            console.error('No response from fetchWithAuth');
            return { success: false, message: 'Failed to connect to server' };
        }
        
        const data = await response.json();
        console.log('createBlogAPI response data:', data);
        
        if (response.ok) {
            return { success: true, ...data };
        } else {
            return { success: false, message: data.message || 'Failed to create blog' };
        }
    } catch (error) {
        console.error('Error in createBlogAPI:', error);
        return { success: false, message: error.message };
    }
}

// Update blog (requires auth)
async function updateBlogAPI(id, blogData) {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/blogs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(blogData)
        });
        
        if (!response) return null;
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating blog:', error);
        return null;
    }
}

// Delete blog (requires auth)
async function deleteBlogAPI(id) {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/blogs/${id}`, {
            method: 'DELETE'
        });
        
        if (!response) return null;
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting blog:', error);
        return null;
    }
}

// Like blog (requires auth)
async function likeBlogAPI(id) {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/blogs/${id}/like`, {
            method: 'POST'
        });
        
        if (!response) return null;
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error liking blog:', error);
        return null;
    }
}

// Add comment to blog (requires auth)
async function addCommentAPI(id, commentData) {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/blogs/${id}/comment`, {
            method: 'POST',
            body: JSON.stringify(commentData)
        });
        
        if (!response) return null;
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding comment:', error);
        return null;
    }
}

// Get user's blogs (requires auth)
async function getMyBlogsAPI() {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/blogs/user/my-blogs`);
        
        if (!response) return [];
        
        const data = await response.json();
        return data.success ? data.data : [];
    } catch (error) {
        console.error('Error fetching user blogs:', error);
        return [];
    }
}

// ========================================
// USER API FUNCTIONS (Admin Only)
// ========================================

// Get all users (admin only)
async function getAllUsersAPI() {
    try {
        console.log('getAllUsersAPI called');
        console.log('API_BASE_URL:', API_BASE_URL);
        console.log('Token:', getAuthToken());
        
        const response = await fetchWithAuth(`${API_BASE_URL}/auth/users`);
        
        console.log('getAllUsersAPI response:', response);
        console.log('Response status:', response?.status);
        
        if (!response) {
            console.error('No response from fetchWithAuth');
            return [];
        }
        
        const data = await response.json();
        console.log('getAllUsersAPI data:', data);
        console.log('Data success:', data.success);
        console.log('Data array:', data.data);
        
        if (data.success && data.data) {
            console.log('Returning users:', data.data.length, 'users');
            return data.data;
        } else {
            console.error('API returned success=false or no data:', data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

// Delete user (admin only)
async function deleteUserAPI(userId) {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/auth/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (!response) return { success: false };
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, message: 'Error deleting user' };
    }
}

// ========================================
// CONTACT API FUNCTIONS
// ========================================

// Submit contact form
async function submitContactAPI(contactData) {
    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error submitting contact form:', error);
        return null;
    }
}

// Get all contacts (admin only)
async function getAllContactsAPI() {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/contact`);
        
        if (!response) return [];
        
        const data = await response.json();
        return data.success ? data.data : [];
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return [];
    }
}

// Delete contact message (admin only)
async function deleteContactAPI(contactId) {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/contact/${contactId}`, {
            method: 'DELETE'
        });
        
        if (!response) return { success: false };
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting contact:', error);
        return { success: false, message: 'Error deleting contact' };
    }
}

// ========================================
// UI UPDATE FUNCTIONS
// ========================================

// Update navigation based on login status
function updateNavigation() {
    const user = getCurrentUser();
    const navItems = document.querySelector('.navbar-nav');
    
    if (!navItems) return;
    
    // Find Write Blog button
    const writeBlogBtn = navItems.querySelector('a[href="write-blog.html"]');
    
    if (user) {
        // User is logged in
        if (writeBlogBtn) {
            writeBlogBtn.parentElement.style.display = 'block';
        }
        
        // Add user menu
        let userMenu = navItems.querySelector('#userMenu');
        if (!userMenu) {
            const userMenuItem = document.createElement('li');
            userMenuItem.className = 'nav-item dropdown';
            userMenuItem.id = 'userMenu';
            userMenuItem.innerHTML = `
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user-circle me-2"></i>${user.name}
                </a>
                <ul class="dropdown-menu dropdown-menu-end" style="background: var(--bg-card);">
                    <li><a class="dropdown-item" href="#" onclick="viewMyBlogs()">
                        <i class="fas fa-blog me-2"></i>My Blogs
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="logout()">
                        <i class="fas fa-sign-out-alt me-2"></i>Logout
                    </a></li>
                </ul>
            `;
            navItems.appendChild(userMenuItem);
        }
        
        // Hide login link
        const loginLink = navItems.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.parentElement.style.display = 'none';
        }
    } else {
        // User is not logged in
        if (writeBlogBtn) {
            // Change Write Blog to require login
            writeBlogBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showErrorMessage('Please login to write a blog');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            });
        }
        
        // Remove user menu if exists
        const userMenu = navItems.querySelector('#userMenu');
        if (userMenu) {
            userMenu.remove();
        }
        
        // Show login link
        let loginLink = navItems.querySelector('a[href="login.html"]');
        if (!loginLink) {
            const loginItem = document.createElement('li');
            loginItem.className = 'nav-item';
            loginItem.innerHTML = `
                <a class="nav-link" href="login.html">
                    <i class="fas fa-sign-in-alt me-2"></i>Login
                </a>
            `;
            navItems.appendChild(loginItem);
        } else {
            loginLink.parentElement.style.display = 'block';
        }
    }
}

// View my blogs
function viewMyBlogs() {
    window.location.href = 'blog-list.html?myblogs=true';
}

// Upload blog image
async function uploadBlogImageAPI(formData) {
    try {
        console.log('uploadBlogImageAPI called');
        
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication required');
        }
        
        const response = await fetch(`${API_BASE_URL}/blogs/upload-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData // Don't set Content-Type for FormData
        });
        
        const data = await response.json();
        console.log('uploadBlogImageAPI response data:', data);
        
        if (!response.ok) {
            throw new Error(data.message || 'Upload failed');
        }
        
        return data;
    } catch (error) {
        console.error('Error in uploadBlogImageAPI:', error);
        throw error;
    }
}

// ========================================
// AUTH API FUNCTIONS
// ========================================

// Login user
async function loginAPI(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        if (response.ok && data.success) {
            // store token and user
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, data };
        }

        return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
        console.error('Error in loginAPI:', error);
        return { success: false, message: error.message };
    }
}

// Register user
async function registerAPI(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (response.ok && data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, data };
        }

        return { success: false, message: data.message || 'Registration failed' };
    } catch (error) {
        console.error('Error in registerAPI:', error);
        return { success: false, message: error.message };
    }
}

// Get current user (API wrapper)
function getCurrentUserAPI() {
    return getCurrentUser();
}

// Admin login
async function adminLoginAPI(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        if (response.ok && data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data; // Return the data directly
        }

        return { success: false, message: data.message || 'Admin login failed' };
    } catch (error) {
        console.error('Error in adminLoginAPI:', error);
        return { success: false, message: error.message };
    }
}

// ========================================
// API OBJECT - Export all API functions
// ========================================

const api = {
    // Auth
    login: loginAPI,
    register: registerAPI,
    getCurrentUser: getCurrentUserAPI,
    adminLogin: adminLoginAPI,
    
    // Blogs
    getAllBlogs: getAllBlogsAPI,
    getBlogById: getBlogByIdAPI,
    getMyBlogs: getMyBlogsAPI,
    createBlog: createBlogAPI,
    updateBlog: updateBlogAPI,
    deleteBlog: deleteBlogAPI,
    likeBlog: likeBlogAPI,
    addComment: addCommentAPI,
    uploadBlogImage: uploadBlogImageAPI,
    
    // Users (Admin Only)
    getAllUsers: getAllUsersAPI,
    deleteUser: deleteUserAPI,
    
    // Contact
    submitContact: submitContactAPI,
    getAllContacts: getAllContactsAPI,
    deleteContact: deleteContactAPI,
    
    // Utility
    isLoggedIn: isLoggedIn,
    isAdmin: isAdmin,
    logout: logout
};

// Make api globally accessible
window.api = api;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    console.log('API object loaded:', api);
});
