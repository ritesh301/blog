// ========================================
// CONFIG.JS - Environment Configuration
// ========================================

// Export configuration
const config = {
    apiBaseUrl: window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/api'
        : 'https://your-backend-url.onrender.com/api', // Replace with your actual backend URL
    environment: window.location.hostname === 'localhost' ? 'development' : 'production'
};

console.log('Environment:', config.environment);
console.log('API Base URL:', config.apiBaseUrl);
