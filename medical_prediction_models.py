import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import tensorflow as tf
from tensorflow.keras import layers, models, Model
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Pima Indians Diabetes Prediction
def train_diabetes_model():
    print('\nTraining Pima Indians Diabetes Model...')
    # Load the Pima Indians Diabetes dataset
    diabetes_data = pd.read_csv('diabetes.csv')
    
    # Separate features and target
    X = diabetes_data.drop('Outcome', axis=1)
    y = diabetes_data['Outcome']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest model
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train_scaled, y_train)
    
    # Make predictions
    y_pred = rf_model.predict(X_test_scaled)
    
    # Calculate accuracy and print results
    accuracy = accuracy_score(y_test, y_pred)
    print(f'Diabetes Prediction Accuracy: {accuracy:.2f}')
    print('\nClassification Report:')
    print(classification_report(y_test, y_pred))
    
    # Plot confusion matrix
    plt.figure(figsize=(8, 6))
    sns.heatmap(confusion_matrix(y_test, y_pred), annot=True, fmt='d', cmap='Blues')
    plt.title('Confusion Matrix - Diabetes Prediction')
    plt.savefig('diabetes_confusion_matrix.png')
    plt.close()

# Diabetic Retinopathy Prediction (CNN Model)
def create_retinopathy_model():
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dense(5, activation='softmax')  # 5 classes of retinopathy
    ])
    return model

def train_retinopathy_model():
    print('\nTraining Diabetic Retinopathy Model...')
    # Note: This is a placeholder for the actual implementation
    # In reality, you would need to:
    # 1. Load and preprocess retinal images
    # 2. Split into train/test sets
    # 3. Train the model
    # 4. Evaluate performance
    
    print('Note: Retinopathy model training requires actual image dataset')
    print('Sample model architecture created for demonstration')

# Heart Disease Prediction
def train_heart_disease_model():
    print('\nTraining Heart Disease Model...')
    # Load the Heart Disease dataset
    heart_data = pd.read_csv('heart.csv')
    
    # Separate features and target
    X = heart_data.drop('target', axis=1)
    y = heart_data['target']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Logistic Regression model
    lr_model = LogisticRegression(random_state=42, max_iter=1000)
    
    # Perform cross-validation
    cv_scores = cross_val_score(lr_model, X_train_scaled, y_train, cv=5)
    print(f'Cross-validation scores: {cv_scores}')
    print(f'Average CV accuracy: {cv_scores.mean():.2f} (+/- {cv_scores.std() * 2:.2f})')
    
    # Train the model on the full training set
    lr_model.fit(X_train_scaled, y_train)
    
    # Make predictions
    y_pred = lr_model.predict(X_test_scaled)
    
    # Calculate accuracy and print results
    accuracy = accuracy_score(y_test, y_pred)
    print(f'\nHeart Disease Prediction Accuracy: {accuracy:.2f}')
    print('\nClassification Report:')
    print(classification_report(y_test, y_pred))
    
    # Plot confusion matrix
    plt.figure(figsize=(8, 6))
    sns.heatmap(confusion_matrix(y_test, y_pred), annot=True, fmt='d', cmap='Blues')
    plt.title('Confusion Matrix - Heart Disease Prediction')
    plt.savefig('heart_disease_confusion_matrix.png')
    plt.close()

def create_fusion_model(pima_shape, image_shape):
    # Pima data input branch
    pima_input = layers.Input(shape=pima_shape, name='pima_input')
    pima_dense = layers.Dense(64, activation='relu')(pima_input)
    pima_dense = layers.Dropout(0.3)(pima_dense)
    
    # Image input branch
    image_input = layers.Input(shape=image_shape, name='image_input')
    base_model = ResNet50(include_top=False, weights='imagenet', input_tensor=image_input)
    image_features = layers.GlobalAveragePooling2D()(base_model.output)
    image_dense = layers.Dense(64, activation='relu')(image_features)
    image_dense = layers.Dropout(0.3)(image_dense)
    
    # Fusion layer
    fusion = layers.Concatenate()([pima_dense, image_dense])
    fusion = layers.Dense(32, activation='relu')(fusion)
    fusion = layers.Dropout(0.3)(fusion)
    output = layers.Dense(1, activation='sigmoid')(fusion)
    
    model = Model(inputs=[pima_input, image_input], outputs=output)
    return model

def train_fusion_model():
    print('\nTraining Multimodal Fusion Model...')
    # Load Pima dataset
    diabetes_data = pd.read_csv('diabetes.csv')
    X_pima = diabetes_data.drop('Outcome', axis=1)
    y = diabetes_data['Outcome']
    
    # Prepare image data (placeholder - in real implementation, load actual retinal images)
    # Assuming retinal images are stored in a 'retinal_images' directory
    image_shape = (224, 224, 3)
    X_images = np.random.rand(len(X_pima), *image_shape)  # Placeholder for actual images
    
    # Split the data
    indices = np.arange(len(X_pima))
    train_idx, test_idx = train_test_split(indices, test_size=0.2, random_state=42)
    
    X_pima_train = X_pima.iloc[train_idx]
    X_pima_test = X_pima.iloc[test_idx]
    X_images_train = X_images[train_idx]
    X_images_test = X_images[test_idx]
    y_train = y.iloc[train_idx]
    y_test = y.iloc[test_idx]
    
    # Scale Pima features
    scaler = StandardScaler()
    X_pima_train_scaled = scaler.fit_transform(X_pima_train)
    X_pima_test_scaled = scaler.transform(X_pima_test)
    
    # Create and compile fusion model
    fusion_model = create_fusion_model(X_pima_train.shape[1], image_shape)
    fusion_model.compile(optimizer='adam',
                        loss='binary_crossentropy',
                        metrics=['accuracy'])
    
    # Train the model
    history = fusion_model.fit(
        [X_pima_train_scaled, X_images_train],
        y_train,
        validation_data=([X_pima_test_scaled, X_images_test], y_test),
        epochs=10,
        batch_size=32
    )
    
    # Evaluate the model
    y_pred = (fusion_model.predict([X_pima_test_scaled, X_images_test]) > 0.5).astype(int)
    
    # Print results
    print('\nFusion Model Results:')
    print('Classification Report:')
    print(classification_report(y_test, y_pred))
    
    # Plot confusion matrix
    plt.figure(figsize=(8, 6))
    sns.heatmap(confusion_matrix(y_test, y_pred), annot=True, fmt='d', cmap='Blues')
    plt.title('Confusion Matrix - Fusion Model')
    plt.savefig('fusion_model_confusion_matrix.png')
    plt.close()
    
    # Plot training history
    plt.figure(figsize=(10, 4))
    plt.subplot(1, 2, 1)
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Model Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    
    plt.subplot(1, 2, 2)
    plt.plot(history.history['accuracy'], label='Training Accuracy')
    plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
    plt.title('Model Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    
    plt.tight_layout()
    plt.savefig('fusion_model_training_history.png')
    plt.close()

def main():
    print('Medical Prediction Models - Training and Evaluation')
    print('=' * 50)
    
    # Train all models
    train_diabetes_model()
    train_retinopathy_model()
    train_heart_disease_model()
    train_fusion_model()

if __name__ == '__main__':
    main()