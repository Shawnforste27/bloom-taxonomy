const Keyword = require('../models/Keyword');
const aiHelper = require('../utils/aiHelper');

exports.searchQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ 
                success: false,
                error: "Question is required" 
            });
        }

        const words = question.toLowerCase().split(" ");
        const matchedKeyword = await Keyword.findOne({ word: { $in: words } });

        if (matchedKeyword) {
            return res.json({ 
                success: true,
                bloomLevel: matchedKeyword.bloomLevel, 
                source: "Database",
                analysis: `This question is classified as ${matchedKeyword.bloomLevel} level.`
            });
        }

        const aiResponse = await aiHelper.analyzeQuestion(question);
        const bloomLevelMatch = aiResponse.match(/BLOOM'S TAXONOMY LEVEL:\s*(\w+)/i);
        const bloomLevel = bloomLevelMatch ? bloomLevelMatch[1] : "Unknown";

        if (bloomLevel === "Unknown") {
            return res.status(500).json({ 
                success: false,
                error: "AI could not classify the question" 
            });
        }

        const newKeyword = new Keyword({ word: words[0], bloomLevel });
        await newKeyword.save();

        res.json({ 
            success: true,
            bloomLevel, 
            source: "AI",
            analysis: aiResponse
        });

    } catch (error) {
        console.error("Error searching question:", error);
        res.status(500).json({ 
            success: false,
            error: "Internal Server Error",
            message: error.message 
        });
    }
};