// ========================================
// CONFIG.JS - Environment Configuration
// ========================================

// Export configuration
const config = {
    apiBaseUrl: window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/api'
        : 'https://blogzy-01kf.onrender.com/api', // Render backend URL
    environment: window.location.hostname === 'localhost' ? 'development' : 'production'
};

console.log('Environment:', config.environment);
console.log('API Base URL:', config.apiBaseUrl);
