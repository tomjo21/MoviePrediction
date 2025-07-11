from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
from datetime import datetime
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variables to store loaded model and data
pipeline = None
director_success_rates = None
actor_success_rates = None

def load_model_and_data():
    """Load the saved model and success rate dictionaries"""
    global pipeline, director_success_rates, actor_success_rates
    
    try:
        model_path = os.path.join(os.path.dirname(__file__), 'saved_model.pkl')
        
        if not os.path.exists(model_path):
            logger.error(f"Model file not found at: {model_path}")
            return False
            
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
            
        # Extract components from the saved model
        pipeline = model_data['pipeline']
        director_success_rates = model_data['director_success_rates']
        actor_success_rates = model_data['actor_success_rates']
        
        logger.info("Model and success rate data loaded successfully")
        return True
        
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        return False

def prepare_features(movie_data):
    """Prepare features for prediction using the loaded success rates"""
    try:
        # Extract basic features
        features = {
            'budget': movie_data['budget'],
            'runtime': movie_data['runtime'],
            'release_year': movie_data['release_year'],
            'release_month': movie_data['release_month'],
            'avg_rating': movie_data['avg_rating'],
            'ratings_count': movie_data['ratings_count']
        }
        
        # Handle genres (convert to binary features)
        genres = movie_data['genres']
        if isinstance(genres, str):
            genres = [g.strip() for g in genres.split(',')]
        
        # Common genres to check
        common_genres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 
                        'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror',
                        'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War']
        
        for genre in common_genres:
            features[f'genre_{genre.lower().replace("-", "_")}'] = 1 if genre in genres else 0
        
        # Handle production companies
        production_companies = movie_data['production_companies']
        if isinstance(production_companies, str):
            production_companies = [c.strip() for c in production_companies.split(',')]
        
        # Check for major studios
        major_studios = ['Warner Bros.', 'Universal Pictures', 'Paramount Pictures', 
                        '20th Century Fox', 'Sony Pictures', 'Walt Disney Pictures',
                        'Columbia Pictures', 'New Line Cinema', 'DreamWorks']
        
        features['major_studio'] = 1 if any(studio in production_companies for studio in major_studios) else 0
        
        # Handle language
        features['english_language'] = 1 if movie_data['original_language'] == 'en' else 0
        
        # Get director success rate
        director = movie_data['director']
        features['director_success_rate'] = director_success_rates.get(director, 0.5)
        
        # Get actor success rates
        actors = [movie_data['actor1'], movie_data['actor2'], movie_data['actor3']]
        actor_success_rates_list = []
        
        for actor in actors:
            if actor and actor.strip():
                rate = actor_success_rates.get(actor.strip(), 0.5)
                actor_success_rates_list.append(rate)
            else:
                actor_success_rates_list.append(0.5)
        
        # Add actor features
        features['actor1_success_rate'] = actor_success_rates_list[0]
        features['actor2_success_rate'] = actor_success_rates_list[1]
        features['actor3_success_rate'] = actor_success_rates_list[2]
        features['avg_actor_success_rate'] = np.mean(actor_success_rates_list)
        features['max_actor_success_rate'] = np.max(actor_success_rates_list)
        
        return features
        
    except Exception as e:
        logger.error(f"Error preparing features: {str(e)}")
        raise

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': pipeline is not None,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Predict movie success endpoint"""
    try:
        # Check if model is loaded
        if pipeline is None:
            return jsonify({
                'error': 'Model not loaded. Please ensure saved_model.pkl is available.'
            }), 500
        
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        # Validate required fields
        required_fields = [
            'movie_title', 'director', 'actor1', 'actor2', 'actor3', 
            'budget', 'runtime', 'genres', 'production_companies', 
            'original_language', 'release_year', 'release_month', 
            'avg_rating', 'ratings_count'
        ]
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {missing_fields}'
            }), 400
        
        # Prepare features
        features = prepare_features(data)
        
        # Convert to DataFrame for prediction
        feature_df = pd.DataFrame([features])
        
        # Make prediction
        prediction = pipeline.predict(feature_df)[0]
        probability = pipeline.predict_proba(feature_df)[0]
        
        # Convert prediction to HIT/FLOP
        result = "HIT" if prediction == 1 else "FLOP"
        
        # Get probability for the predicted class
        hit_probability = probability[1] if prediction == 1 else probability[0]
        
        logger.info(f"Prediction for '{data['movie_title']}': {result} (probability: {hit_probability:.3f})")
        
        return jsonify({
            'movie_title': data['movie_title'],
            'prediction': result,
            'probability': round(hit_probability, 3),
            'confidence': round(hit_probability * 100, 1),
            'features_used': list(features.keys()),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        return jsonify({
            'error': f'Prediction failed: {str(e)}'
        }), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    if pipeline is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    return jsonify({
        'model_type': type(pipeline).__name__,
        'director_count': len(director_success_rates) if director_success_rates else 0,
        'actor_count': len(actor_success_rates) if actor_success_rates else 0,
        'model_loaded_at': datetime.now().isoformat()
    })

# Serve React static files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    build_dir = os.path.join(os.path.dirname(__file__), 'build')
    if path != "" and os.path.exists(os.path.join(build_dir, path)):
        return send_from_directory(build_dir, path)
    else:
        return send_from_directory(build_dir, 'index.html')

if __name__ == '__main__':
    # Load model on startup
    if load_model_and_data():
        logger.info("Starting Flask server...")
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        logger.error("Failed to load model. Server not started.")
        exit(1) 