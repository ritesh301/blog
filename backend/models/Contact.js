const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    subject: {
        type: String,
        required: [true, 'Please provide a subject'],
        trim: true,
        minlength: [5, 'Subject must be at least 5 characters']
    },
    message: {
        type: String,
        required: [true, 'Please provide a message'],
        minlength: [10, 'Message must be at least 10 characters']
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied'],
        default: 'new'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contact', contactSchema);
