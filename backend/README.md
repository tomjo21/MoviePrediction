# Movie Success Prediction Backend

A Flask-based REST API for predicting movie success using machine learning models.

## Features

- Loads pre-trained machine learning model from `saved_model.pkl`
- Provides prediction endpoint for movie success analysis
- Includes director and actor success rate analysis
- Comprehensive input validation and error handling
- CORS enabled for frontend integration

## Setup

### Prerequisites

- Python 3.8 or higher
- `saved_model.pkl` file containing:
  - `pipeline`: Trained scikit-learn pipeline
  - `director_success_rates`: Dictionary of director success rates
  - `actor_success_rates`: Dictionary of actor success rates

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Place your `saved_model.pkl` file in the backend directory

4. Run the Flask application:
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/health`
- Returns server status and model loading status

### Model Information
- **GET** `/model-info`
- Returns information about the loaded model

### Prediction
- **POST** `/predict`
- Accepts movie data and returns success prediction

#### Request Body (JSON)
```json
{
  "movie_title": "Inception",
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
```

#### Response
```json
{
  "movie_title": "Inception",
  "prediction": "HIT",
  "probability": 0.85,
  "confidence": 85.0,
  "features_used": ["budget", "runtime", "release_year", ...],
  "timestamp": "2024-01-15T10:30:00"
}
```

## Testing

Run the test script to verify the backend functionality:

```bash
python test_backend.py
```

This will test all endpoints and provide detailed output.

## Error Handling

The API includes comprehensive error handling for:
- Missing model file
- Invalid JSON data
- Missing required fields
- Model prediction errors

All errors return appropriate HTTP status codes and descriptive error messages.

## Production Deployment

For production deployment, consider using:
- Gunicorn as the WSGI server
- Environment variables for configuration
- Proper logging and monitoring
- Load balancing for high traffic

Example with Gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## CORS Configuration

CORS is enabled for all origins to allow frontend integration. In production, you may want to restrict this to specific domains. 