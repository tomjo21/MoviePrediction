import pickle
import sys

try:
    print("Loading model...")
    with open('saved_model.pkl', 'rb') as f:
        data = pickle.load(f)
    
    print("Model loaded successfully!")
    print("Keys in model:", list(data.keys()))
    
    if 'pipeline' in data:
        print("Pipeline type:", type(data['pipeline']).__name__)
    if 'director_success_rates' in data:
        print("Director success rates count:", len(data['director_success_rates']))
    if 'actor_success_rates' in data:
        print("Actor success rates count:", len(data['actor_success_rates']))
        
except Exception as e:
    print(f"Error loading model: {e}")
    print(f"Error type: {type(e).__name__}")
    sys.exit(1) 