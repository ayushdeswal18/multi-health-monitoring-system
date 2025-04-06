document.addEventListener('DOMContentLoaded', () => {
    const predictionForm = document.getElementById('heartPredictionForm');
    const predictionResult = document.getElementById('predictionResult');

    predictionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            chestPain: document.getElementById('chestPain').value,
            restingBP: parseInt(document.getElementById('restingBP').value),
            cholesterol: parseInt(document.getElementById('cholesterol').value),
            fastingBS: document.getElementById('fastingBS').value === 'true',
            restingECG: document.getElementById('restingECG').value,
            maxHR: parseInt(document.getElementById('maxHR').value),
            exerciseAngina: document.getElementById('exerciseAngina').value === 'yes'
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
            const prediction = simulateHeartPrediction(formData);
            
            // Display result
            displayPredictionResult(prediction, formData);
        } catch (error) {
            alert('Sorry, there was an error making the prediction. Please try again.');
        } finally {
            submitButton.textContent = 'Predict';
            submitButton.disabled = false;
        }
    });
});

function validateFormData(data) {
    // Validate age
    if (data.age < 0 || data.age > 120) {
        alert('Please enter a valid age (0-120 years)');
        return false;
    }

    // Validate blood pressure
    if (data.restingBP < 0 || data.restingBP > 300) {
        alert('Please enter a valid blood pressure (0-300 mm Hg)');
        return false;
    }

    // Validate cholesterol
    if (data.cholesterol < 0 || data.cholesterol > 600) {
        alert('Please enter a valid cholesterol level (0-600 mg/dl)');
        return false;
    }

    // Validate heart rate
    if (data.maxHR < 0 || data.maxHR > 250) {
        alert('Please enter a valid heart rate (0-250 bpm)');
        return false;
    }

    return true;
}

function simulateHeartPrediction(data) {
    let riskScore = 0;
    const riskFactors = [];

    // Age risk
    if (data.age > 65) {
        riskScore += 20;
        riskFactors.push('Advanced age (>65 years)');
    } else if (data.age > 45) {
        riskScore += 10;
        riskFactors.push('Middle age (>45 years)');
    }

    // Blood pressure risk
    if (data.restingBP >= 140) {
        riskScore += 20;
        riskFactors.push('High blood pressure (≥140 mm Hg)');
    } else if (data.restingBP >= 120) {
        riskScore += 10;
        riskFactors.push('Elevated blood pressure (≥120 mm Hg)');
    }

    // Cholesterol risk
    if (data.cholesterol >= 240) {
        riskScore += 20;
        riskFactors.push('High cholesterol (≥240 mg/dl)');
    } else if (data.cholesterol >= 200) {
        riskScore += 10;
        riskFactors.push('Borderline high cholesterol (≥200 mg/dl)');
    }

    // Chest pain risk
    if (data.chestPain === 'typical' || data.chestPain === 'atypical') {
        riskScore += 15;
        riskFactors.push('Presence of angina');
    }

    // Exercise angina
    if (data.exerciseAngina) {
        riskScore += 15;
        riskFactors.push('Exercise-induced angina');
    }

    // Fasting blood sugar
    if (data.fastingBS) {
        riskScore += 10;
        riskFactors.push('High fasting blood sugar');
    }

    // ECG abnormalities
    if (data.restingECG !== 'normal') {
        riskScore += 10;
        riskFactors.push('ECG abnormalities');
    }

    // Calculate probability
    const probability = Math.min(riskScore, 100);

    return {
        hasHeartDisease: probability > 50,
        probability: probability,
        riskFactors: riskFactors
    };
}

function displayPredictionResult(prediction, formData) {
    const resultDiv = document.getElementById('predictionResult');
    const resultIcon = resultDiv.querySelector('.result-icon');
    const resultText = resultDiv.querySelector('.result-text');
    const resultProbability = resultDiv.querySelector('.result-probability');
    const riskFactorsList = document.getElementById('riskFactorsList');

    // Update result elements
    resultIcon.className = 'result-icon ' + (prediction.hasHeartDisease ? 'positive' : 'negative');
    resultText.textContent = prediction.hasHeartDisease ? 
        'High Risk of Heart Disease' : 
        'Low Risk of Heart Disease';
    resultProbability.textContent = `Risk Score: ${prediction.probability}%`;

    // Update risk factors list
    riskFactorsList.innerHTML = '';
    prediction.riskFactors.forEach(factor => {
        const li = document.createElement('li');
        li.textContent = factor;
        riskFactorsList.appendChild(li);
    });

    // Show result section
    resultDiv.style.display = 'block';

    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}