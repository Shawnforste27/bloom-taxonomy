const API_URL = 'http://localhost:5000/api/quiz';

document.addEventListener('DOMContentLoaded', () => {
    let currentQuestion = '';
    let currentSubject = '';
    let currentDifficulty = '';

    document.getElementById('generateBtn').addEventListener('click', async () => {
        const subject = document.getElementById('subjectInput').value.trim();
        const difficulty = document.getElementById('difficultySelect').value;

        if (!subject) {
            alert('Please enter a subject');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ subject, difficulty })
            });

            const data = await response.json();
            if (response.ok) {
                currentQuestion = data.question;
                currentSubject = subject;
                currentDifficulty = difficulty;
                
                document.getElementById('questionDisplay').innerHTML = data.question;
                document.getElementById('answerSection').style.display = 'block';
                document.getElementById('feedback').innerHTML = '';
                document.getElementById('bloomsSelect').value = '';
                document.getElementById('answerInput').value = '';
            } else {
                alert(data.message || 'Failed to generate question');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate question');
        }
    });

    document.getElementById('submitAnswer').addEventListener('click', async () => {
        const answer = document.getElementById('answerInput').value.trim();
        const bloomsLevel = document.getElementById('bloomsSelect').value;

        if (!answer || !bloomsLevel) {
            alert('Please provide both answer and Bloom\'s taxonomy level');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: currentQuestion,
                    userAnswer: answer,
                    selectedBloomLevel: bloomsLevel,
                    subject: currentSubject,
                    difficulty: currentDifficulty
                })
            });

            const data = await response.json();
            if (response.ok) {
                document.getElementById('feedback').innerHTML = `
                    <h3>Feedback</h3>
                    <p><strong>Score:</strong> ${data.score}%</p>
                    <p><strong>Actual Bloom's Level:</strong> ${data.actualBloomLevel}</p>
                    <p><strong>Feedback:</strong> ${data.feedback}</p>
                `;
            } else {
                alert(data.message || 'Failed to submit answer');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit answer');
        }
    });
});