const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    title:{
        type: String,
    },
    description: {
        type: String,
    }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
