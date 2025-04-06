// Initialize charts when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializePimaDiabetesChart();
    initializeRetinopathyChart();
    initializeHeartDiseaseChart();
    initializeFusionModelChart();
});

function initializePimaDiabetesChart() {
    const ctx = document.getElementById('pimaDiabetesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Glucose', 'Blood Pressure', 'BMI', 'Age', 'Insulin'],
            datasets: [{
                label: 'Average Values by Diabetes Status',
                data: [120, 70, 32, 45, 150],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.6)',
                    'rgba(46, 204, 113, 0.6)',
                    'rgba(155, 89, 182, 0.6)',
                    'rgba(52, 73, 94, 0.6)',
                    'rgba(241, 196, 15, 0.6)'
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(155, 89, 182, 1)',
                    'rgba(52, 73, 94, 1)',
                    'rgba(241, 196, 15, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function initializeRetinopathyChart() {
    const ctx = document.getElementById('retinopathyChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['No DR', 'Mild', 'Moderate', 'Severe', 'Proliferative'],
            datasets: [{
                data: [45, 25, 15, 10, 5],
                backgroundColor: [
                    'rgba(46, 204, 113, 0.6)',
                    'rgba(52, 152, 219, 0.6)',
                    'rgba(155, 89, 182, 0.6)',
                    'rgba(241, 196, 15, 0.6)',
                    'rgba(231, 76, 60, 0.6)'
                ],
                borderColor: [
                    'rgba(46, 204, 113, 1)',
                    'rgba(52, 152, 219, 1)',
                    'rgba(155, 89, 182, 1)',
                    'rgba(241, 196, 15, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function initializeHeartDiseaseChart() {
    const ctx = document.getElementById('heartDiseaseChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Age 30-40', 'Age 40-50', 'Age 50-60', 'Age 60-70', 'Age 70+'],
            datasets: [{
                label: 'Risk Score by Age Group',
                data: [20, 35, 55, 70, 85],
                fill: true,
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                borderColor: 'rgba(231, 76, 60, 1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}
function initializeFusionModelChart() {
    const ctx = document.getElementById('fusionModelChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Non-Diabetic', 'Diabetic'],
            datasets: [{
                label: 'Prediction Probability',
                data: [0.2, 0.8], // replace with dynamic values if needed
                backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
}

