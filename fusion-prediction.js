document.addEventListener('DOMContentLoaded', () => {
    const clinicalDataForm = document.getElementById('clinicalDataForm');
    const dropZone = document.getElementById('dropZone');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const uploadedImage = document.getElementById('uploadedImage');
    const fusionPredictBtn = document.getElementById('fusionPredictBtn');
    const predictionResult = document.getElementById('predictionResult');

    // Handle drag and drop functionality
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleImageUpload(e.dataTransfer.files[0]);
    });

    dropZone.addEventListener('click', () => {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', (e) => {
        handleImageUpload(e.target.files[0]);
    });

    fusionPredictBtn.addEventListener('click', async () => {
        if (!validateFormData() || !validateImage()) {
            return;
        }

        // Show loading state
        fusionPredictBtn.textContent = 'Analyzing...';
        fusionPredictBtn.disabled = true;

        try {
            // Simulate ML model prediction
            await new Promise(resolve => setTimeout(resolve, 2000));
            const prediction = await generateFusionPrediction();
            displayPredictionResult(prediction);
        } catch (error) {
            alert('Sorry, there was an error generating the prediction. Please try again.');
        } finally {
            fusionPredictBtn.textContent = 'Generate Prediction';
            fusionPredictBtn.disabled = false;
        }
    });

    function handleImageUpload(file) {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should not exceed 5MB');
            return;
        }

        const validImageTypes = ['image/jpeg', 'image/png'];
        if (!validImageTypes.includes(file.type)) {
            alert('Please upload a JPG or PNG image');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImage.src = e.target.result;
            dropZone.style.display = 'none';
            imagePreview.style.display = 'block';
            // Enable prediction button once image is loaded
            fusionPredictBtn.disabled = false;
        };
        reader.onerror = () => {
            alert('Error reading the image file. Please try again.');
        };
        reader.readAsDataURL(file);
    }

    function validateFormData() {
        const formData = getFormData();
        
        if (!formData) {
            alert('Please fill in all required fields');
            return false;
        }

        // Validate glucose
        if (formData.glucose < 0 || formData.glucose > 500) {
            alert('Please enter a valid glucose level (0-500 mg/dL)');
            return false;
        }

        // Validate blood pressure
        if (formData.bloodPressure < 0 || formData.bloodPressure > 300) {
            alert('Please enter a valid blood pressure (0-300 mm Hg)');
            return false;
        }

        // Validate BMI
        if (formData.bmi < 0 || formData.bmi > 100) {
            alert('Please enter a valid BMI (0-100)');
            return false;
        }

        // Validate age
        if (formData.age < 0 || formData.age > 120) {
            alert('Please enter a valid age (0-120 years)');
            return false;
        }

        return true;
    }

    function validateImage() {
        if (!uploadedImage.src) {
            alert('Please upload a retinal image');
            return false;
        }
        return true;
    }

    function getFormData() {
        return {
            pregnancies: parseInt(document.getElementById('pregnancies').value),
            glucose: parseInt(document.getElementById('glucose').value),
            bloodPressure: parseInt(document.getElementById('bloodPressure').value),
            skinThickness: parseInt(document.getElementById('skinThickness').value),
            insulin: parseInt(document.getElementById('insulin').value),
            bmi: parseFloat(document.getElementById('bmi').value),
            diabetesPedigree: parseFloat(document.getElementById('diabetesPedigree').value),
            age: parseInt(document.getElementById('age').value)
        };
    }

    async function generateFusionPrediction() {
        const formData = getFormData();
        
        try {
            // Calculate clinical score
            const clinicalScore = calculateClinicalScore(formData);
            
            // Analyze retinal image
            const imageScore = await analyzeRetinalImage();
            
            // Combine scores with weighted average
            const fusionScore = 0.6 * clinicalScore + 0.4 * imageScore;
            
            // Calculate confidence based on data quality
            const confidence = calculateConfidence(formData, imageScore);
            
            return {
                probability: fusionScore,
                confidence: confidence,
                featureImportance: {
                    clinicalData: 60,
                    retinalImage: 40,
                    topFeatures: [
                        { name: 'Glucose', importance: formData.glucose > 140 ? 30 : 25 },
                        { name: 'Retinal Features', importance: imageScore > 70 ? 25 : 20 },
                        { name: 'BMI', importance: formData.bmi > 30 ? 20 : 15 },
                        { name: 'Age', importance: formData.age > 45 ? 15 : 10 },
                        { name: 'Blood Pressure', importance: formData.bloodPressure > 140 ? 15 : 10 }
                    ]
                }
            };
        } catch (error) {
            console.error('Error generating prediction:', error);
            throw new Error('Failed to generate prediction. Please try again.');
        }
    }

    function calculateClinicalScore(data) {
        let score = 0;

        // Weight different factors
        if (data.glucose > 140) score += 30;
        else if (data.glucose > 100) score += 15;

        if (data.bloodPressure > 140) score += 20;
        else if (data.bloodPressure > 120) score += 10;

        if (data.bmi > 30) score += 20;
        else if (data.bmi > 25) score += 10;

        if (data.age > 45) score += 15;
        else if (data.age > 35) score += 5;

        if (data.diabetesPedigree > 0.8) score += 15;
        else if (data.diabetesPedigree > 0.5) score += 10;

        return Math.min(score, 100);
    }

    async function analyzeRetinalImage() {
        if (!uploadedImage.src) {
            throw new Error('No retinal image uploaded');
        }

        try {
            // Create a canvas to process the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = uploadedImage.naturalWidth;
            canvas.height = uploadedImage.naturalHeight;
            ctx.drawImage(uploadedImage, 0, 0);

            // Get image data for analysis
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Analyze image features (simplified version)
            let brightness = 0;
            let contrast = 0;
            let previousValue = data[0];

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                // Calculate average brightness
                brightness += (r + g + b) / 3;
                
                // Calculate contrast
                contrast += Math.abs(previousValue - r);
                previousValue = r;
            }

            brightness = brightness / (data.length / 4);
            contrast = contrast / (data.length / 4);

            // Generate score based on image quality
            const qualityScore = (brightness > 127 ? 40 : 30) + (contrast > 20 ? 30 : 20);
            return Math.min(100, qualityScore + Math.random() * 20); // Add some randomness
        } catch (error) {
            console.error('Error analyzing retinal image:', error);
            throw new Error('Failed to analyze retinal image');
        }
    }

    function calculateConfidence(formData, imageScore) {
        let confidence = 70; // Base confidence

        // Adjust confidence based on data completeness and quality
        if (formData.glucose > 0 && formData.bloodPressure > 0) confidence += 5;
        if (formData.bmi > 0 && formData.age > 0) confidence += 5;
        if (imageScore > 70) confidence += 10;
        if (imageScore > 85) confidence += 5;

        return Math.min(95, confidence);
    }

    function displayPredictionResult(prediction) {
        const resultContent = predictionResult.querySelector('.result-content');
        const resultText = resultContent.querySelector('.result-text');
        const confidenceProgress = resultContent.querySelector('.confidence-progress');
        const confidenceValue = resultContent.querySelector('.confidence-value');
        const importanceChart = resultContent.querySelector('.importance-chart');

        // Set risk level and text
        const riskLevel = prediction.probability > 70 ? 'High' :
                         prediction.probability > 40 ? 'Moderate' : 'Low';
        
        resultText.innerHTML = `<strong>${riskLevel} Risk</strong><br>Based on the combined analysis of your clinical data and retinal image, you show a ${riskLevel.toLowerCase()} risk of diabetes.<br><br>Probability: ${prediction.probability.toFixed(1)}%`;
        predictionResult.style.display = 'block';

        // Update confidence score
        confidenceProgress.style.width = `${prediction.confidence}%`;
        confidenceValue.textContent = `${prediction.confidence.toFixed(1)}% Confidence`;

        // Create feature importance chart
        importanceChart.innerHTML = prediction.featureImportance.topFeatures
            .map(feature => `
                <div class="importance-bar">
                    <div class="importance-label">${feature.name}</div>
                    <div class="importance-value" style="width: ${feature.importance}%">
                        ${feature.importance}%
                    </div>
                </div>
            `).join('');

        // Show the result section
        predictionResult.style.display = 'block';
        predictionResult.scrollIntoView({ behavior: 'smooth' });
    }
});