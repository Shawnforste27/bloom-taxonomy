document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const questionInput = document.getElementById('questionInput');
    const analysisResult = document.getElementById('analysisResult');

    if (!analyzeBtn || !questionInput || !analysisResult) {
        console.error('Required elements not found');
        return;
    }

    analyzeBtn.addEventListener('click', async () => {
        const question = questionInput.value.trim();
        
        if (!question) {
            analysisResult.innerHTML = '<p class="error">Please enter a question to analyze.</p>';
            analysisResult.classList.remove('hidden');
            return;
        }

        try {
            analyzeBtn.disabled = true;
            analyzeBtn.textContent = 'Analyzing...';
            analysisResult.classList.remove('hidden');
            analysisResult.innerHTML = '<div class="spinner"></div><p class="analyzing-text">Analyzing your question...</p>';

            const response = await fetch('http://localhost:5000/api/search/question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                const bloomLevelClass = getBloomLevelClass(data.bloomLevel);
                analysisResult.innerHTML = `
                    <div class="analysis-result ${bloomLevelClass}">
                        <h3>Analysis Result</h3>
                        <p><strong>Bloom's Level:</strong> <span class="bloom-level">${data.bloomLevel}</span></p>
                        <p><strong>Source:</strong> <span class="source-tag">${data.source}</span></p>
                        <p><strong>Analysis:</strong></p>
                        <div class="analysis-explanation">${data.analysis}</div>
                    </div>
                `;
            } else {
                analysisResult.innerHTML = `<p class="error">${data.error || 'Analysis failed. Please try again.'}</p>`;
            }
        } catch (error) {
            analysisResult.innerHTML = `<p class="error">Error: ${error.message || 'Failed to analyze question. Please try again.'}</p>`;
            console.error('Error:', error);
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = 'Analyze Question';
        }
    });

    function getBloomLevelClass(level) {
        const levelMap = {
            'Remember': 'level-remember',
            'Understand': 'level-understand',
            'Apply': 'level-apply',
            'Analyze': 'level-analyze',
            'Evaluate': 'level-evaluate',
            'Create': 'level-create'
        };
        return levelMap[level] || 'level-default';
    }
});