const Quiz = require('../models/Quiz');
const aiHelper = require('../utils/aiHelper');

const quizController = {
    generateQuestion: async (req, res) => {
        try {
            const { subject, difficulty } = req.body;
            const result = await aiHelper.generateQuestion(subject, difficulty);
            res.json({ question: result });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    submitAnswer: async (req, res) => {
        try {
            const { question, userAnswer, selectedBloomLevel } = req.body;
            const evaluation = await aiHelper.evaluateAnswer(question, userAnswer, selectedBloomLevel);
            
            // Parse the evaluation response
            const lines = evaluation.split('\n');
            const score = parseInt(lines.find(l => l.startsWith('Score:'))?.split(':')[1]) || 0;
            const actualBloomLevel = lines.find(l => l.startsWith('Actual Bloom\'s Level:'))?.split(':')[1].trim() || '';
            const feedback = lines.find(l => l.startsWith('Feedback:'))?.split(':')[1].trim() || '';

            // Save to database
            const quiz = new Quiz({
                subject: req.body.subject,
                difficulty: req.body.difficulty,
                question,
                userAnswer,
                selectedBloomLevel,
                actualBloomLevel,
                score,
                feedback
            });
            await quiz.save();

            res.json({ score, actualBloomLevel, feedback });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

};

module.exports = quizController;