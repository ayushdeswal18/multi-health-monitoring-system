document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const uploadedImage = document.getElementById('uploadedImage');
    const analyzeButton = document.getElementById('analyzeButton');
    const predictionResult = document.getElementById('predictionResult');

    // Handle drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropZone.classList.add('highlight');
    }

    function unhighlight() {
        dropZone.classList.remove('highlight');
    }

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // Handle file input change
    dropZone.addEventListener('click', () => {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', function() {
        handleFiles(this.files);
    });

    async function handleFiles(files) {
        if (files.length === 0) return;

        const file = files[0];
        const isValid = await validateFile(file);
        if (!isValid) return;

        // Display image preview
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImage.src = e.target.result;
            dropZone.style.display = 'none';
            imagePreview.style.display = 'block';
            predictionResult.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }

    function validateFile(file) {
        // Check file type
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPG or PNG)');
            return false;
        }

        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('Please upload an image smaller than 5MB');
            return false;
        }

        return true;
    }

    // Handle analysis button click
    analyzeButton.addEventListener('click', async () => {
        analyzeButton.textContent = 'Analyzing...';
        analyzeButton.disabled = true;

        try {
            // Simulate ML model analysis
            await new Promise(resolve => setTimeout(resolve, 2000));
            const prediction = simulateRetinopathyPrediction();
            displayPredictionResult(prediction);
        } catch (error) {
            alert('Sorry, there was an error analyzing the image. Please try again.');
        } finally {
            analyzeButton.textContent = 'Analyze Image';
            analyzeButton.disabled = false;
        }
    });
});

function simulateRetinopathyPrediction() {
    const severityLevels = [
        { level: 'No DR', probability: 0.1 },
        { level: 'Mild', probability: 0.2 },
        { level: 'Moderate', probability: 0.4 },
        { level: 'Severe', probability: 0.2 },
        { level: 'Proliferative DR', probability: 0.1 }
    ];

    // Randomly select a severity level based on probabilities
    const random = Math.random();
    let cumulativeProbability = 0;
    let selectedLevel;

    for (const level of severityLevels) {
        cumulativeProbability += level.probability;
        if (random <= cumulativeProbability) {
            selectedLevel = level.level;
            break;
        }
    }

    return {
        severity: selectedLevel,
        confidence: (Math.random() * 20 + 80).toFixed(1) // Random confidence between 80-100%
    };
}

function displayPredictionResult(prediction) {
    const resultDiv = document.getElementById('predictionResult');
    const severityDiv = resultDiv.querySelector('.result-severity');
    const resultText = resultDiv.querySelector('.result-text');
    const severityProgress = resultDiv.querySelector('.severity-progress');
    const severityDescription = resultDiv.querySelector('.severity-description');

    // Set severity color and progress
    const severityColors = {
        'No DR': '#2ecc71',
        'Mild': '#3498db',
        'Moderate': '#f1c40f',
        'Severe': '#e67e22',
        'Proliferative DR': '#e74c3c'
    };

    const severityDescriptions = {
        'No DR': 'No signs of diabetic retinopathy detected.',
        'Mild': 'Early signs of diabetic retinopathy. Regular monitoring recommended.',
        'Moderate': 'Noticeable retinopathy progression. Medical attention advised.',
        'Severe': 'Advanced retinopathy. Immediate medical attention required.',
        'Proliferative DR': 'Critical stage. Urgent medical intervention needed.'
    };

    const severityLevels = Object.keys(severityColors);
    const progressPercentage = ((severityLevels.indexOf(prediction.severity) + 1) / severityLevels.length) * 100;

    severityDiv.style.backgroundColor = severityColors[prediction.severity];
    severityProgress.style.width = `${progressPercentage}%`;
    severityProgress.style.backgroundColor = severityColors[prediction.severity];

    resultText.textContent = `${prediction.severity} (${prediction.confidence}% confidence)`;
    severityDescription.textContent = severityDescriptions[prediction.severity];

    // Show result section
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}