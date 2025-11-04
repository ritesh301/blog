const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Blog = require('../models/Blog');
const { generateToken, protect, adminOnly } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('mobile').optional().matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit mobile number')
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const { name, email, password, mobile, favoriteCategories } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            mobile,
            favoriteCategories: favoriteCategories || []
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                favoriteCategories: user.favoriteCategories
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                favoriteCategories: user.favoriteCategories
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// @route   POST /api/auth/admin-login
// @desc    Admin login
// @access  Public
router.post('/admin-login', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const { username, password } = req.body;

        // Check admin credentials from environment
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            // Check if admin user exists in database
            let adminUser = await User.findOne({ email: 'admin@blogzy.com' });
            
            if (!adminUser) {
                // Create admin user if doesn't exist
                adminUser = await User.create({
                    name: 'Admin',
                    email: 'admin@blogzy.com',
                    password: process.env.ADMIN_PASSWORD,
                    role: 'admin'
                });
            }

            const token = generateToken(adminUser._id);

            return res.status(200).json({
                success: true,
                message: 'Admin login successful!',
                token,
                user: {
                    id: adminUser._id,
                    name: adminUser.name,
                    email: adminUser.email,
                    role: adminUser.role
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during admin login'
        });
    }
});

// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        
        // Get blog counts for each user
        const usersWithBlogCount = await Promise.all(
            users.map(async (user) => {
                const blogCount = await Blog.countDocuments({ author: user._id });
                return {
                    ...user.toObject(),
                    blogCount
                };
            })
        );
        
        res.status(200).json({
            success: true,
            count: usersWithBlogCount.length,
            data: usersWithBlogCount
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
});

// @route   DELETE /api/auth/users/:id
// @desc    Delete a user (Admin only)
// @access  Private/Admin
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Prevent deleting admin users
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin users'
            });
        }
        
        await user.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user'
        });
    }
});

module.exports = router;
