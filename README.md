# Movie Success Prediction System

A full-stack web application that predicts movie box office success using machine learning.

## Features

- **Advanced ML Predictions**: Uses trained machine learning models to predict movie success
- **Comprehensive Input**: Collects detailed movie information including cast, crew, budget, and more
- **Real-time Analysis**: Provides instant predictions with confidence scores
- **Beautiful UI**: Modern, responsive interface built with React and Tailwind CSS
- **Backend API**: Flask-based REST API with CORS support

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Flask, Python, scikit-learn
- **ML**: Pre-trained models with director/actor success rate analysis

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+ and pip
- Your trained ML model (`saved_model.pkl`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd movie-success-predictor
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Add your ML model**
   - Place your `saved_model.pkl` file in the `backend/` directory
   - The model should contain: `pipeline`, `director_success_rates`, `actor_success_rates`

### Running the Application

1. **Start the Flask backend**
   ```bash
   cd backend
   python app.py
   ```
   The backend will run on `http://localhost:5000`

2. **Start the React frontend**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:8080`

3. **Open your browser** and navigate to `http://localhost:8080`

## API Endpoints

- `GET /health` - Health check
- `GET /model-info` - Model information
- `POST /predict` - Movie success prediction

## Usage

1. **Enter Movie Details**: Fill out the comprehensive form with movie information
2. **Get Prediction**: Submit to receive instant HIT/FLOP prediction with confidence score
3. **View Analysis**: See detailed breakdown of factors influencing the prediction

## Deployment

### Frontend Deployment
```bash
npm run build
```

### Backend Deployment
The Flask app can be deployed using:
- Heroku
- Railway
- Render
- AWS/GCP/Azure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
