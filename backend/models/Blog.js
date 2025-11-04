const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        minlength: [10, 'Title must be at least 10 characters'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Please provide content'],
        minlength: [100, 'Content must be at least 100 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Geography', 'History', 'Economics', 'Culture', 'Lifestyle', 'Technology', 'Science', 'Comedy']
    },
    image: {
        type: String,
        required: [true, 'Please provide an image URL']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    views: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
blogSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create description from content if not provided
blogSchema.pre('save', function(next) {
    if (!this.description && this.content) {
        this.description = this.content.substring(0, 150) + '...';
    }
    next();
});

module.exports = mongoose.model('Blog', blogSchema);
