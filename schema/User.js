const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
