document.addEventListener('DOMContentLoaded', () => {
    const predictionForm = document.getElementById('pimaPredictionForm');
    const predictionResult = document.getElementById('predictionResult');

    predictionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            pregnancies: parseInt(document.getElementById('pregnancies').value),
            glucose: parseInt(document.getElementById('glucose').value),
            bloodPressure: parseInt(document.getElementById('bloodPressure').value),
            skinThickness: parseInt(document.getElementById('skinThickness').value),
            insulin: parseInt(document.getElementById('insulin').value),
            bmi: parseFloat(document.getElementById('bmi').value),
            diabetesPedigree: parseFloat(document.getElementById('diabetesPedigree').value),
            age: parseInt(document.getElementById('age').value)
        };

        // Validate form data
        if (!validateFormData(formData)) {
            return;
        }

        // Show loading state
        const submitButton = predictionForm.querySelector('.predict-btn');
        submitButton.textContent = 'Predicting...';
        submitButton.disabled = true;

        try {
            // Simulate ML model prediction
            await new Promise(resolve => setTimeout(resolve, 1500));
            const prediction = simulatePrediction(formData);
            
            // Display result
            displayPredictionResult(prediction);
        } catch (error) {
            alert('Sorry, there was an error making the prediction. Please try again.');
        } finally {
            submitButton.textContent = 'Predict';
            submitButton.disabled = false;
        }
    });
});

function validateFormData(data) {
    // Validate glucose
    if (data.glucose < 0 || data.glucose > 500) {
        alert('Please enter a valid glucose level (0-500 mg/dL)');
        return false;
    }

    // Validate blood pressure
    if (data.bloodPressure < 0 || data.bloodPressure > 300) {
        alert('Please enter a valid blood pressure (0-300 mm Hg)');
        return false;
    }

    // Validate BMI
    if (data.bmi < 0 || data.bmi > 100) {
        alert('Please enter a valid BMI (0-100)');
        return false;
    }

    // Validate age
    if (data.age < 0 || data.age > 120) {
        alert('Please enter a valid age (0-120 years)');
        return false;
    }

    return true;
}

function simulatePrediction(data) {
    // Simple risk calculation based on known risk factors
    let riskScore = 0;

    // High glucose is a major risk factor
    if (data.glucose > 140) riskScore += 30;
    else if (data.glucose > 100) riskScore += 15;

    // High blood pressure increases risk
    if (data.bloodPressure > 140) riskScore += 20;
    else if (data.bloodPressure > 120) riskScore += 10;

    // BMI impact
    if (data.bmi > 30) riskScore += 20;
    else if (data.bmi > 25) riskScore += 10;

    // Age consideration
    if (data.age > 45) riskScore += 15;
    else if (data.age > 35) riskScore += 5;

    // Family history impact through diabetes pedigree
    if (data.diabetesPedigree > 0.8) riskScore += 15;
    else if (data.diabetesPedigree > 0.5) riskScore += 10;

    // Calculate probability
    const probability = Math.min(riskScore, 100);

    return {
        hasDiabetes: probability > 50,
        probability: probability
    };
}

function displayPredictionResult(prediction) {
    const resultDiv = document.getElementById('predictionResult');
    const resultIcon = resultDiv.querySelector('.result-icon');
    const resultText = resultDiv.querySelector('.result-text');
    const resultProbability = resultDiv.querySelector('.result-probability');

    // Update result elements
    resultIcon.className = 'result-icon ' + (prediction.hasDiabetes ? 'positive' : 'negative');
    resultText.textContent = prediction.hasDiabetes ? 
        'High Risk of Diabetes' : 
        'Low Risk of Diabetes';
    resultProbability.textContent = `Risk Score: ${prediction.probability}%`;

    // Show result section
    resultDiv.style.display = 'block';

    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}