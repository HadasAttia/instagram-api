const mongoose = require("mongoose");

const Comment = mongoose.model('Comment', {
    user: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'User'
    },
    description: String,
    image: {
        type: String,
        required: true
    }
});

module.exports = Comment;