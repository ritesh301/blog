const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const { protect, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// @route   POST /api/blogs/upload-image
// @desc    Upload image for blog
// @access  Private (User must be logged in)
router.post('/upload-image', protect, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file uploaded'
            });
        }

        // Generate the URL for the uploaded image
        const imageUrl = `/uploads/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading image'
        });
    }
});

// @route   GET /api/blogs
// @desc    Get all blogs (with search and filter)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { search, category, author, limit = 100 } = req.query;
        
        let query = { status: 'published' };

        // Search by title, content, or author name
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { authorName: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by category (case-insensitive)
        if (category && category !== 'all') {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        // Filter by author
        if (author) {
            query.author = author;
        }

        const blogs = await Blog.find(query)
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs
        });
    } catch (error) {
        console.error('Get blogs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blogs'
        });
    }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'name email');
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Increment views
        blog.views += 1;
        await blog.save();

        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error('Get blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blog'
        });
    }
});

// @route   POST /api/blogs
// @desc    Create a new blog
// @access  Private (User must be logged in)
router.post('/', protect, [
    body('title').trim().isLength({ min: 10 }).withMessage('Title must be at least 10 characters'),
    body('content').trim().isLength({ min: 100 }).withMessage('Content must be at least 100 characters'),
    body('category').notEmpty().withMessage('Category is required'),
    body('image').custom((value) => {
        // Allow either valid URLs, local paths starting with /uploads/, or base64 encoded images
        if (!value) {
            throw new Error('Image is required');
        }
        if (value.startsWith('/uploads/') || 
            /^https?:\/\/.+/.test(value) || 
            value.startsWith('data:image/')) {
            return true;
        }
        throw new Error('Please provide a valid image URL, upload an image, or paste an image');
    })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const { title, content, category, image } = req.body;

        console.log('Creating blog:', { 
            title, 
            category, 
            imageType: image?.substring(0, 30),
            userId: req.user._id,
            userName: req.user.name
        });

        const blog = await Blog.create({
            title,
            content,
            category,
            image,
            author: req.user._id,
            authorName: req.user.name
        });

        const populatedBlog = await Blog.findById(blog._id).populate('author', 'name email');

        console.log('Blog created successfully:', blog._id);

        res.status(201).json({
            success: true,
            message: 'Blog created successfully!',
            data: populatedBlog
        });
    } catch (error) {
        console.error('Create blog error:', error);
        console.error('Error details:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error creating blog: ' + error.message
        });
    }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private (Author or Admin)
router.put('/:id', protect, [
    body('title').optional().trim().isLength({ min: 10 }).withMessage('Title must be at least 10 characters'),
    body('content').optional().trim().isLength({ min: 100 }).withMessage('Content must be at least 100 characters'),
    body('image').optional().isURL().withMessage('Please provide a valid image URL')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Check if user is author or admin
        if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this blog'
            });
        }

        const { title, content, category, image } = req.body;

        blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, content, category, image },
            { new: true, runValidators: true }
        ).populate('author', 'name email');

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully!',
            data: blog
        });
    } catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating blog'
        });
    }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private (Author or Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Check if user is author or admin
        if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this blog'
            });
        }

        await blog.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully!'
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting blog'
        });
    }
});

// @route   POST /api/blogs/:id/like
// @desc    Like/Unlike a blog
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Check if user already liked
        const alreadyLiked = blog.likedBy.includes(req.user._id);

        if (alreadyLiked) {
            // Unlike
            blog.likedBy = blog.likedBy.filter(id => id.toString() !== req.user._id.toString());
            blog.likes -= 1;
        } else {
            // Like
            blog.likedBy.push(req.user._id);
            blog.likes += 1;
        }

        await blog.save();

        res.status(200).json({
            success: true,
            data: {
                likes: blog.likes,
                liked: !alreadyLiked
            }
        });
    } catch (error) {
        console.error('Like blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Error liking blog'
        });
    }
});

// @route   GET /api/blogs/user/my-blogs
// @desc    Get current user's blogs
// @access  Private
router.get('/user/my-blogs', protect, async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs
        });
    } catch (error) {
        console.error('Get user blogs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching your blogs'
        });
    }
});

module.exports = router;
