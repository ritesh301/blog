const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./backend/config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://blogzzyy.netlify.app', 'https://www.blogzzyy.netlify.app'] // Netlify frontend URL
        : '*',
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (frontend)
app.use(express.static(__dirname));

// Serve uploaded images
app.use('/uploads', express.static(__dirname + '/uploads'));

// API Routes
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/blogs', require('./backend/routes/blogs'));
app.use('/api/contact', require('./backend/routes/contact'));

// Root route - serve index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Blogzy API is running!',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
    🚀 ============================================
    🎉 Blogzy Server is running!
    📡 Server: http://localhost:${PORT}
    🗄️  Database: MongoDB Connected
    🔐 Auth: JWT Enabled
    ============================================
    `);
});

module.exports = app;
