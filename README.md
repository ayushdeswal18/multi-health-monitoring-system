# Medical Prediction Models

This project implements three different medical prediction models:
1. Pima Indians Diabetes Prediction (Random Forest)
2. Diabetic Retinopathy Detection (CNN)
3. Heart Disease Risk Assessment (Logistic Regression)

## Dataset Requirements

Before running the models, ensure you have the following datasets in the project directory:

1. `diabetes.csv` - Pima Indians Diabetes Dataset
   - 768 patient records
   - 8 medical predictor variables
   - Binary classification target

2. Retinal Images Dataset (for Diabetic Retinopathy)
   - Organized retinal image dataset
   - Images should be preprocessed to 224x224 pixels
   - 5 severity classes

3. `heart.csv` - Heart Disease Dataset
   - Contains patient heart health indicators
   - Multiple features including age, sex, chest pain type, etc.
   - Binary classification target

## Setup Instructions

1. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Models

Execute the main script:
```bash
python medical_prediction_models.py
```

This will:
- Train the Pima Diabetes model using Random Forest
- Demonstrate the Retinopathy CNN model architecture
- Train the Heart Disease model using Logistic Regression
- Generate confusion matrices and classification reports

## Model Performance

The script will output:
- Accuracy scores for each model
- Classification reports with precision, recall, and F1-score
- Confusion matrices saved as PNG files

## Notes

- The Retinopathy model implementation is a demonstration of the architecture. Actual training requires a proper image dataset.
- All models use standard preprocessing techniques including feature scaling.
- Cross-validation is implemented for the Heart Disease model to ensure robust performance evaluation.