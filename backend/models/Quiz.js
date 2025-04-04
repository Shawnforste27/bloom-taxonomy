const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  
    subject: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    question: {
        type: String,
        required: true
    },
    userAnswer: {
        type: String,
        required: true
    },
    selectedBloomLevel: {
        type: String,
        enum: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'],
        required: true
    },
    actualBloomLevel: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', quizSchema);