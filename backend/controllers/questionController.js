const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');
const Question = require('../models/questionModel');

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

exports.generateQuestionPaper = async (req, res) => {
    try {
        const {
            subject,
            totalQuestions,
            examType,
            totalMarks,
            passingMarks,
            duration,
            bloomsDistribution,
            courseOutcomes,
            instituteDetails = {
                name: "Your Institute Name",
                department: "Department Name",
                logo: "" // Base64 or URL of the institute logo
            }
        } = req.body;

        // Calculate questions and marks per level
        const questionsPerLevel = {};
        let remainingMarks = totalMarks;
        let remainingQuestions = totalQuestions;
        
        Object.entries(bloomsDistribution).forEach(([level, percentage], index, array) => {
            const isLast = index === array.length - 1;
            if (isLast) {
                questionsPerLevel[level] = remainingQuestions;
            } else {
                questionsPerLevel[level] = Math.round((percentage / 100) * totalQuestions);
                remainingQuestions -= questionsPerLevel[level];
            }
        });

        const questions = [];
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Enhanced prompt for better question generation
        for (const [level, count] of Object.entries(questionsPerLevel)) {
            if (count > 0) {
                const marksForLevel = Math.round((bloomsDistribution[level] / 100) * totalMarks);
                const marksPerQuestion = Math.floor(marksForLevel / count);

                const prompt = `Generate ${count} ${subject} questions for ${examType} exam following these criteria:
                1. Questions should be at ${getBloomLevel(level)} level (${level})
                2. Each question should be worth ${marksPerQuestion} marks
                3. Questions should be clear, specific, and academically appropriate
                4. Use appropriate action verbs for ${getBloomLevel(level)} level
                5. Questions should be relevant to ${subject} curriculum
                Format: One question per line without numbering`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();
                
                const generatedQuestions = text.split('\n')
                    .filter(q => q.trim().length > 0)
                    .map((q, index) => ({
                        text: q.replace(/^\d+[\.)]\s*/, '').trim(),
                        marks: marksPerQuestion,
                        bloomLevel: level,
                        co: `CO${(index % courseOutcomes.length) + 1}`,
                        po: `PO${Math.floor(Math.random() * 3) + 1}`
                    }));

                questions.push(...generatedQuestions);
            }
        }

        // Adjust marks if necessary
        const totalAssignedMarks = questions.reduce((sum, q) => sum + q.marks, 0);
        if (totalAssignedMarks !== totalMarks && questions.length > 0) {
            const difference = totalMarks - totalAssignedMarks;
            questions[questions.length - 1].marks += difference;
        }

        res.json({
            success: true,
            metadata: {
                subject,
                examType,
                duration,
                totalMarks,
                passingMarks,
                courseOutcomes,
                instituteDetails,
                date: new Date().toLocaleDateString()
            },
            questions: questions,
            distribution: {
                blooms: bloomsDistribution,
                totalQuestions: questions.length,
                marksDistribution: questions.reduce((acc, q) => {
                    acc[q.bloomLevel] = (acc[q.bloomLevel] || 0) + q.marks;
                    return acc;
                }, {})
            }
        });

    } catch (error) {
        console.error('Error generating questions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate questions'
        });
    }
};

function getBloomLevel(level) {
    const levels = {
        L1: 'Remember',
        L2: 'Understand',
        L3: 'Apply',
        L4: 'Analyze',
        L5: 'Evaluate',
        L6: 'Create'
    };
    return levels[level];
}