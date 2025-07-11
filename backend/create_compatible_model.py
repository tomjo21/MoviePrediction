import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import os

def create_compatible_model():
    """Create a new model compatible with current scikit-learn version"""
    
    # Create sample success rate dictionaries
    director_success_rates = {
        'Christopher Nolan': 0.85,
        'Steven Spielberg': 0.80,
        'James Cameron': 0.75,
        'Peter Jackson': 0.70,
        'Quentin Tarantino': 0.65,
        'Unknown Director': 0.50
    }
    
    actor_success_rates = {
        'Leonardo DiCaprio': 0.80,
        'Tom Hanks': 0.85,
        'Morgan Freeman': 0.75,
        'Brad Pitt': 0.70,
        'Johnny Depp': 0.65,
        'Unknown Actor': 0.50
    }
    
    # Create a simple pipeline
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    
    # Create sample training data
    np.random.seed(42)
    n_samples = 1000
    
    # Generate synthetic features
    budget = np.random.uniform(1000000, 200000000, n_samples)
    runtime = np.random.uniform(90, 180, n_samples)
    release_year = np.random.randint(1990, 2024, n_samples)
    release_month = np.random.randint(1, 13, n_samples)
    avg_rating = np.random.uniform(5.0, 9.5, n_samples)
    ratings_count = np.random.uniform(1000, 1000000, n_samples)
    
    # Generate genre features (binary)
    genres = np.random.randint(0, 2, (n_samples, 15))  # 15 common genres
    
    # Generate other features
    major_studio = np.random.randint(0, 2, n_samples)
    english_language = np.random.randint(0, 2, n_samples)
    director_success_rate = np.random.uniform(0.3, 0.9, n_samples)
    actor1_success_rate = np.random.uniform(0.3, 0.9, n_samples)
    actor2_success_rate = np.random.uniform(0.3, 0.9, n_samples)
    actor3_success_rate = np.random.uniform(0.3, 0.9, n_samples)
    avg_actor_success_rate = (actor1_success_rate + actor2_success_rate + actor3_success_rate) / 3
    max_actor_success_rate = np.maximum.reduce([actor1_success_rate, actor2_success_rate, actor3_success_rate])
    
    # Combine features
    X = np.column_stack([
        budget, runtime, release_year, release_month, avg_rating, ratings_count,
        genres, major_studio, english_language, director_success_rate,
        actor1_success_rate, actor2_success_rate, actor3_success_rate,
        avg_actor_success_rate, max_actor_success_rate
    ])
    
    # Create target variable (success based on rating and budget)
    y = ((avg_rating > 7.0) & (budget > 50000000)).astype(int)
    
    # Fit the pipeline
    pipeline.fit(X, y)
    
    # Save the model
    model_data = {
        'pipeline': pipeline,
        'director_success_rates': director_success_rates,
        'actor_success_rates': actor_success_rates
    }
    
    with open('saved_model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print("Compatible model created and saved successfully!")
    print(f"Director success rates: {len(director_success_rates)}")
    print(f"Actor success rates: {len(actor_success_rates)}")
    print(f"Model accuracy: {pipeline.score(X, y):.3f}")

if __name__ == '__main__':
    create_compatible_model() 