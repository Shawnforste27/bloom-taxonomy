const mongoose = require('mongoose');

const keywordSchema = new mongoose.Schema({
    word: { type: String, required: true, unique: true },
    bloomLevel: { type: String, required: true, enum: ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"] }
}, { timestamps: true });

module.exports = mongoose.model('Keyword', keywordSchema);