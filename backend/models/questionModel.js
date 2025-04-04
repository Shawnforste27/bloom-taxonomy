const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        required: true
    },
    bloomLevel: {
        type: String,
        required: true,
        enum: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6']
    },
    co: {
        type: String,
        required: true
    },
    po: {
        type: String,
        default: 'PO1'
    }
});

module.exports = mongoose.model('Question', questionSchema);