const mongoose = require("mongoose");

const dbSchema = mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
    },
    data: { 
        type: Array, 
        required: true 
    },
    permissions: {
        type: String,
        enum: ['read-only', 'read-write', 'private'],
        default: 'private',
    },
    usersWithSpecialAccess: {
        type: Array,
        default: []
    }
})

const Document = mongoose.model('Document', dbSchema);
module.exports = Document;