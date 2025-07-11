import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

def create_sample_model():
    """Create a sample model structure for demonstration"""
    
    # Create sample success rate dictionaries
    director_success_rates = {
        "Christopher Nolan": 0.85,
        "Steven Spielberg": 0.82,
        "James Cameron": 0.88,
        "Peter Jackson": 0.79,
        "Quentin Tarantino": 0.76,
        "Martin Scorsese": 0.78,
        "Ridley Scott": 0.72,
        "Tim Burton": 0.68,
        "Wes Anderson": 0.74,
        "David Fincher": 0.75
    }
    
    actor_success_rates = {
        "Leonardo DiCaprio": 0.82,
        "Tom Hanks": 0.85,
        "Brad Pitt": 0.78,
        "Johnny Depp": 0.72,
        "Robert Downey Jr.": 0.79,
        "Will Smith": 0.76,
        "Tom Cruise": 0.81,
        "Matt Damon": 0.77,
        "George Clooney": 0.75,
        "Denzel Washington": 0.80,
        "Tom Hardy": 0.73,
        "Ellen Page": 0.68,
        "Emma Stone": 0.76,
        "Jennifer Lawrence": 0.74,
        "Scarlett Johansson": 0.77
    }
    
    # Create a simple pipeline with Random Forest
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    
    # Create sample training data to fit the pipeline
    # This is just for demonstration - in reality, you'd use your actual training data
    np.random.seed(42)
    n_samples = 1000
    
    # Generate sample features
    X = np.random.randn(n_samples, 25)  # 25 features
    y = np.random.choice([0, 1], size=n_samples, p=[0.6, 0.4])  # 60% flops, 40% hits
    
    # Fit the pipeline
    pipeline.fit(X, y)
    
    # Create the model data structure
    model_data = {
        'pipeline': pipeline,
        'director_success_rates': director_success_rates,
        'actor_success_rates': actor_success_rates
    }
    
    # Save the model
    with open('saved_model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print("Sample model created successfully!")
    print(f"Directors in model: {len(director_success_rates)}")
    print(f"Actors in model: {len(actor_success_rates)}")
    print("Model saved as 'saved_model.pkl'")
    
    # Test the model
    test_features = np.random.randn(1, 25)
    prediction = pipeline.predict(test_features)[0]
    probability = pipeline.predict_proba(test_features)[0]
    
    print(f"\nTest prediction: {'HIT' if prediction == 1 else 'FLOP'}")
    print(f"Probability: {probability}")

if __name__ == "__main__":
    create_sample_model() 