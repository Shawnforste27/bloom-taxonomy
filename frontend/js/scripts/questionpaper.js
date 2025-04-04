document.getElementById('questionForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const loadingIndicator = document.getElementById('loadingIndicator');
    const questionPaper = document.getElementById('questionPaper');
    
    // Show loading indicator
    loadingIndicator.classList.remove('hidden');
    questionPaper.classList.add('hidden');

    // Gather form data
    const formData = {
        subject: document.getElementById('subject').value,
        totalQuestions: parseInt(document.getElementById('totalQuestions').value),
        examType: document.getElementById('examType').value,
        totalMarks: parseInt(document.getElementById('totalMarks').value),
        passingMarks: parseInt(document.getElementById('passingMarks').value),
        duration: document.getElementById('duration').value,
        bloomsDistribution: {
            L1: parseInt(document.getElementById('L1').value),
            L2: parseInt(document.getElementById('L2').value),
            L3: parseInt(document.getElementById('L3').value),
            L4: parseInt(document.getElementById('L4').value),
            L5: parseInt(document.getElementById('L5').value),
            L6: parseInt(document.getElementById('L6').value)
        },
        courseOutcomes: document.getElementById('courseOutcomes').value.split('\n')
    };

    try {
        const response = await fetch('http://localhost:5000/api/questions/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to generate question paper');
        }

        const data = await response.json();
        
        // Update question paper content
        document.getElementById('paperTitle').textContent = `${formData.subject} - ${formData.examType}`;
        
        const paperDetails = document.getElementById('paperDetails');
        paperDetails.innerHTML = `
            <div class="paper-metadata">
                <div class="metadata-row">
                    <span><strong>Duration:</strong> ${formData.duration} Hours</span>
                    <span><strong>Maximum Marks:</strong> ${formData.totalMarks}</span>
                </div>
                <div class="metadata-row">
                    <span><strong>Course:</strong> ${formData.subject}</span>
                    <span><strong>Minimum Passing Marks:</strong> ${formData.passingMarks}</span>
                </div>
            </div>
            <div class="course-outcomes">
                <strong>Course Outcomes:</strong>
                <ol>
                    ${formData.courseOutcomes.map((co, index) => 
                        `<li>CO${index + 1}: ${co}</li>`).join('')}
                </ol>
            </div>
        `;

        const questionTable = document.getElementById('questionTable');
        let totalAssignedMarks = 0;
        
        questionTable.innerHTML = `
            <table class="question-table">
                <thead>
                    <tr>
                        <th class="q-num">Q.No</th>
                        <th class="q-text">Question</th>
                        <th class="q-marks">Marks</th>
                        <th class="q-co">CO</th>
                        <th class="q-bl">BL</th>
                        <th class="q-po">PO</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.questions.map((q, index) => {
                        totalAssignedMarks += q.marks;
                        return `
                            <tr>
                                <td class="q-num">${index + 1}</td>
                                <td class="q-text">${q.text}</td>
                                <td class="q-marks">${q.marks}</td>
                                <td class="q-co">${q.co}</td>
                                <td class="q-bl">${q.bloomLevel}</td>
                                <td class="q-po">${q.po}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" class="total-text">Total Marks</td>
                        <td class="total-marks">${totalAssignedMarks}</td>
                        <td colspan="3"></td>
                    </tr>
                </tfoot>
            </table>
            <div class="print-section">
                <button id="printButton" class="print-button">Print Question Paper</button>
            </div>
        `;

        // Verify total marks
        if (totalAssignedMarks !== formData.totalMarks) {
            alert(`Warning: Total assigned marks (${totalAssignedMarks}) differ from specified total marks (${formData.totalMarks})`);
        }

        // Add print functionality
        document.getElementById('printButton').addEventListener('click', (e) => {
            e.preventDefault();
            window.print();
        });

        // Show the question paper
        loadingIndicator.classList.add('hidden');
        questionPaper.classList.remove('hidden');

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate question paper. Please try again.');
        loadingIndicator.classList.add('hidden');
    }
});

// Validate Bloom's taxonomy distribution total
const bloomsInputs = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];
bloomsInputs.forEach(id => {
    document.getElementById(id).addEventListener('input', validateBloomsTotal);
});

function validateBloomsTotal() {
    const total = bloomsInputs.reduce((sum, id) => {
        return sum + (parseInt(document.getElementById(id).value) || 0);
    }, 0);

    if (total !== 100) {
        bloomsInputs.forEach(id => {
            document.getElementById(id).setCustomValidity('Total must equal 100%');
        });
    } else {
        bloomsInputs.forEach(id => {
            document.getElementById(id).setCustomValidity('');
        });
    }
}