import requests
import json

# Test data for the prediction endpoint
test_movie_data = {
    "movie_title": "Test Movie",
    "director": "Christopher Nolan",
    "actor1": "Leonardo DiCaprio",
    "actor2": "Tom Hardy",
    "actor3": "Ellen Page",
    "budget": 160000000,
    "runtime": 148,
    "genres": "Action,Adventure,Sci-Fi",
    "production_companies": "Warner Bros.,Legendary Pictures",
    "original_language": "en",
    "release_year": 2010,
    "release_month": 7,
    "avg_rating": 8.8,
    "ratings_count": 2500000
}

def test_health_endpoint():
    """Test the health check endpoint"""
    try:
        response = requests.get('http://localhost:5000/health')
        print("Health Check Response:")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to server. Make sure the Flask app is running.")
        return False

def test_model_info():
    """Test the model info endpoint"""
    try:
        response = requests.get('http://localhost:5000/model-info')
        print("\nModel Info Response:")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to server.")
        return False

def test_prediction():
    """Test the prediction endpoint"""
    try:
        response = requests.post(
            'http://localhost:5000/predict',
            json=test_movie_data,
            headers={'Content-Type': 'application/json'}
        )
        print("\nPrediction Response:")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to server.")
        return False

def test_invalid_data():
    """Test with invalid data"""
    try:
        invalid_data = {"movie_title": "Test"}  # Missing required fields
        response = requests.post(
            'http://localhost:5000/predict',
            json=invalid_data,
            headers={'Content-Type': 'application/json'}
        )
        print("\nInvalid Data Response:")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 400
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to server.")
        return False

if __name__ == "__main__":
    print("Testing Flask Backend...")
    print("=" * 50)
    
    # Test all endpoints
    health_ok = test_health_endpoint()
    model_info_ok = test_model_info()
    prediction_ok = test_prediction()
    invalid_data_ok = test_invalid_data()
    
    print("\n" + "=" * 50)
    print("Test Results:")
    print(f"Health Check: {'✓' if health_ok else '✗'}")
    print(f"Model Info: {'✓' if model_info_ok else '✗'}")
    print(f"Prediction: {'✓' if prediction_ok else '✗'}")
    print(f"Invalid Data Handling: {'✓' if invalid_data_ok else '✗'}")
    
    if all([health_ok, model_info_ok, prediction_ok, invalid_data_ok]):
        print("\nAll tests passed! Backend is working correctly.")
    else:
        print("\nSome tests failed. Check the server logs for details.") 