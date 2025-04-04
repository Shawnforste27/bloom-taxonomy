const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const aiHelper = {
    async analyzeQuestion(question) {
        const prompt = `
        Analyze the following question and classify it under Bloom's Taxonomy:

        Question: "${question}"

        FORMAT RESPONSE STRICTLY AS:

        BLOOM'S TAXONOMY LEVEL: [One of: Remember, Understand, Apply, Analyze, Evaluate, Create]

        Explanation: [Short reasoning about the classification]`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error('Failed to analyze question');
        }
    },

     async generateQuestion(subject, difficulty) {
        const prompt = `
        Generate a thought-provoking question about ${subject} with ${difficulty} difficulty level.
        The question should encourage critical thinking and be suitable for an educational context.
        Include only the question without mentioning Bloom's Taxonomy level in the output.
        
        FORMAT RESPONSE AS:
        Question: [Your generated question]`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const questionText = response.text();
            
            // Extract just the question part, removing any format markers
            const cleanQuestion = questionText
                .replace('Question:', '')
                .trim();
            
            return cleanQuestion;
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error('Failed to generate question');
        }
    },

    // ... existing evaluateAnswer function ...


    async evaluateAnswer(question, userAnswer, selectedBloomLevel) {
        const prompt = `
        Evaluate this student's answer based on Bloom's Taxonomy.

        Question: "${question}"
        Student's Selected Bloom's Level: ${selectedBloomLevel}
        Student's Answer: "${userAnswer}"

        FORMAT RESPONSE STRICTLY AS:
        Score: [0-100]
        Actual Bloom's Level: [Taxonomy level]
        Feedback: [Constructive feedback about the answer and bloom's level selection]`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error('Failed to evaluate answer');
        }
    }
};

module.exports = aiHelper;