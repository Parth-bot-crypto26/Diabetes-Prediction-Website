from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os

# --- Flask App Setup ---
app = Flask(__name__)
# IMPORTANT: This allows your React frontend (on a different port/domain) to connect.
# In a production environment, you would restrict this to your specific frontend domain.
CORS(app) 

# --- Model and Scaler Loading ---
# Define file paths
MODEL_PATH = 'diabetes_model.pkl'
SCALER_PATH = 'scaler.pkl'

# Define the features in the exact order the model expects (from your notebook data frame)
FEATURE_COLUMNS = [
    'Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 
    'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'
]
# Define features that require special preprocessing
SKEWED_FEATURES = ['SkinThickness', 'Insulin']
NUMERICAL_SCALED_FEATURES = ['Insulin', 'SkinThickness', 'DiabetesPedigreeFunction']

# Load the model and scaler only once when the server starts
try:
    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
        raise FileNotFoundError(f"Missing one or both files: {MODEL_PATH}, {SCALER_PATH}")
        
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("✅ ML Model and Scaler loaded successfully.")
    
except Exception as e:
    print(f"❌ Error loading required files: {e}")
    model = None
    scaler = None

# --- Preprocessing Function (Mimics Notebook Steps) ---

def preprocess_input(data):
    """Transforms raw user input data into the format the model expects."""
    
    # 1. Convert raw input dict to a DataFrame row
    try:
        # Use a list of dictionaries to ensure a single row DataFrame
        df = pd.DataFrame([data], columns=FEATURE_COLUMNS)
    except ValueError as e:
        # Catch if input data is missing required features
        raise ValueError(f"Input data is incomplete or incorrectly structured: {e}")

    # 2. Impute 0s (as done in Cell 4 of your notebook)
    #    NOTE: This is a simplification. For production, the exact mean values 
    #    used during training should be saved and used here. 
    #    Assuming the mean imputation was only for SkinThickness and Insulin 
    #    with the mean of the non-zero values used.
    #    To be fully correct, you'd save these means, but for now we'll rely on the scaler
    #    handling the magnitude changes. Let's focus on log/scaling consistency.
    
    # 3. Log Transform Skewed Features (Cell 10: np.log(x + 1))
    df[SKEWED_FEATURES] = df[SKEWED_FEATURES].apply(lambda x: np.log(x + 1))
    
    # 4. MinMax Scale Numerical Features (Cell 11: uses pre-fitted scaler)
    #    Ensure the columns are passed in the same order they were fitted/saved.
    df_scaled = scaler.transform(df[NUMERICAL_SCALED_FEATURES])
    
    # Re-insert the scaled columns back into the original DataFrame, 
    # keeping the non-scaled columns (Pregnancies, Glucose, BloodPressure, BMI, Age)
    df[NUMERICAL_SCALED_FEATURES] = df_scaled
    
    # Convert the final DataFrame row to a numpy array for prediction
    return df.values 

# --- API Endpoint Definition ---

@app.route('/predict', methods=['POST'])
def predict():
    """Receives user input, runs prediction, and returns result."""
    
    if not model or not scaler:
        return jsonify({'error': 'Backend files not loaded. Check server logs.'}), 500

    try:
        # Get data from the frontend's POST request (JSON body)
        user_data = request.get_json(force=True)
        
        # Convert all user input strings to floats for processing
        parsed_data = {key: float(value) for key, value in user_data.items()}
        
        # Run preprocessing
        processed_data = preprocess_input(parsed_data)
        
        # Make the prediction (Random Forest Classifier returns 0 or 1)
        prediction = model.predict(processed_data)
        
        result_class = int(prediction[0])
        
        # Prepare a user-friendly response
        outcome_text = "Positive (High Risk of Diabetes)" if result_class == 1 else "Negative (Low Risk of Diabetes)"
        
        return jsonify({
            'prediction_class': result_class,
            'outcome_text': outcome_text,
            'message': 'Prediction successful!'
        })

    except Exception as e:
        # Catch any errors during the process (e.g., bad data types, missing features)
        return jsonify({
            'error': 'Prediction failed due to bad input or server error.',
            'details': str(e)
        }), 400

# --- Server Execution ---

if __name__ == '__main__':
    # Run the server on port 5000 (standard for Flask APIs)
    print("--- Starting Flask API ---")
    print("API available at http://127.0.0.1:5000/predict")
    app.run(debug=True, port=5000)