import { useState } from 'react';
import { MovieSearch } from '@/components/MovieSearch';
import { MovieForm } from '@/components/MovieForm';
import { PredictionResult } from '@/components/PredictionResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Film, Sparkles, TrendingUp, Camera, Clapperboard, Award } from 'lucide-react';

// Frontend interface for form data
export interface MovieData {
  title: string;
  genre: string;
  director: string;
  budget: number;
  cast: string[];
  runtime: number;
  releaseMonth: string;
  sequel: boolean;
  rating?: string;
  productionCompanies: string;
  originalLanguage: string;
  releaseYear: number;
  avgRating: number;
  ratingsCount: number;
}

// Backend API interface - matches exactly what the Flask backend expects
export interface BackendMovieData {
  movie_title: string;
  director: string;
  actor1: string;
  actor2: string;
  actor3: string;
  budget: number;
  runtime: number;
  genres: string;
  production_companies: string;
  original_language: string;
  release_year: number;
  release_month: number;
  avg_rating: number;
  ratings_count: number;
}

// Backend API response interface
export interface BackendPredictionResponse {
  movie_title: string;
  prediction: "HIT" | "FLOP";
  probability: number;
  confidence: number;
  features_used: string[];
  timestamp: string;
}

export interface PredictionData {
  success: boolean;
  confidence: number;
  factors: string[];
  boxOfficeProjection: number;
}

const Index = () => {
  const [selectedMovie, setSelectedMovie] = useState<MovieData | null>(null);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [activeTab, setActiveTab] = useState('search');

  const handleMovieSelect = (movie: MovieData) => {
    setSelectedMovie(movie);
    
    // For existing movies from the dataset, we'll use the real data
    // Since these are historical movies, we can show their actual performance
    const existingMoviePrediction: PredictionData = {
      success: movie.avgRating > 6.5, // Consider it successful if rating > 6.5
      confidence: Math.min(Math.max(movie.avgRating * 10, 30), 95), // Convert rating to confidence
      factors: [
        `Rating: ${movie.avgRating}/10`,
        `Budget: $${(movie.budget / 1000000).toFixed(1)}M`,
        `Genre: ${movie.genre}`,
        `Director: ${movie.director}`,
        `Release Year: ${movie.releaseYear}`
      ],
      boxOfficeProjection: movie.budget * 2 // Simple projection based on budget
    };
    
    setPrediction(existingMoviePrediction);
  };

  const handleFormSubmit = async (movieData: MovieData) => {
    setSelectedMovie(movieData);
    
    try {
      // Convert frontend data to backend format
      const backendData: BackendMovieData = {
        movie_title: movieData.title,
        director: movieData.director,
        actor1: movieData.cast[0] || '',
        actor2: movieData.cast[1] || '',
        actor3: movieData.cast[2] || '',
        budget: movieData.budget,
        runtime: movieData.runtime,
        genres: movieData.genre,
        production_companies: movieData.productionCompanies,
        original_language: movieData.originalLanguage,
        release_year: movieData.releaseYear,
        release_month: getMonthNumber(movieData.releaseMonth),
        avg_rating: movieData.avgRating,
        ratings_count: movieData.ratingsCount
      };

      // Call backend API
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const backendResponse: BackendPredictionResponse = await response.json();
      
      // Convert backend response to frontend format
      const prediction: PredictionData = {
        success: backendResponse.prediction === 'HIT',
        confidence: backendResponse.confidence,
        factors: backendResponse.features_used.slice(0, 5), // Show first 5 features as factors
        boxOfficeProjection: Math.round(movieData.budget * (1.5 + backendResponse.probability * 2))
      };
      
      setPrediction(prediction);
    } catch (error) {
      console.error('Error calling prediction API:', error);
      // Fallback to mock prediction if API fails
      const mockPrediction = generateMockPrediction(movieData);
      setPrediction(mockPrediction);
    }
  };

  // Helper function to convert month name to number
  const getMonthNumber = (monthName: string): number => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months.indexOf(monthName) + 1;
  };

  const generateMockPrediction = (movie: MovieData): PredictionData => {
    const factors = [];
    let baseScore = 0.5;
    
    // Genre scoring
    if (['Action', 'Adventure', 'Comedy'].includes(movie.genre)) {
      baseScore += 0.2;
      factors.push('Popular genre');
    }
    
    // Budget scoring
    if (movie.budget > 100000000) {
      baseScore += 0.15;
      factors.push('High production budget');
    } else if (movie.budget < 10000000) {
      baseScore -= 0.1;
      factors.push('Low budget risk');
    }
    
    // Sequel bonus
    if (movie.sequel) {
      baseScore += 0.2;
      factors.push('Sequel advantage');
    }
    
    // Runtime scoring
    if (movie.runtime >= 90 && movie.runtime <= 150) {
      baseScore += 0.1;
      factors.push('Optimal runtime');
    }
    
    // Random factor for realism
    baseScore += (Math.random() - 0.5) * 0.3;
    
    const confidence = Math.min(Math.max(baseScore, 0.1), 0.95);
    const success = confidence > 0.6;
    
    return {
      success,
      confidence: Math.round(confidence * 100),
      factors: factors.length > 0 ? factors : ['Standard market conditions'],
      boxOfficeProjection: Math.round(movie.budget * (1.5 + confidence * 2))
    };
  };

  const resetPrediction = () => {
    setSelectedMovie(null);
    setPrediction(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Movie Background */}
      <div className="fixed inset-0 z-0">
        {/* Film Strip Animation */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 opacity-20">
          <div className="w-full h-full bg-repeat-x animate-pulse" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 10px, rgba(0,0,0,0.3) 10px, rgba(0,0,0,0.3) 20px)'
          }} />
        </div>
        
        {/* Floating Film Elements */}
        <div className="absolute inset-0">
          {/* Film Reel 1 */}
          <div className="absolute top-20 left-10 opacity-10 animate-spin" style={{ animationDuration: '20s' }}>
            <Film className="w-24 h-24 text-yellow-400" />
          </div>
          
          {/* Camera */}
          <div className="absolute top-40 right-20 opacity-15 animate-bounce" style={{ animationDuration: '4s' }}>
            <Camera className="w-16 h-16 text-blue-400" />
          </div>
          
          {/* Clapperboard */}
          <div className="absolute bottom-32 left-20 opacity-10 animate-pulse" style={{ animationDuration: '3s' }}>
            <Clapperboard className="w-20 h-20 text-red-400" />
          </div>
          
          {/* Award */}
          <div className="absolute bottom-20 right-32 opacity-15 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
            <Award className="w-14 h-14 text-golden-400" />
          </div>
          
          {/* Film Reel 2 */}
          <div className="absolute top-60 right-10 opacity-10 animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}>
            <Film className="w-18 h-18 text-purple-400" />
          </div>
          
          {/* Small floating dots representing film perforations */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full opacity-20 animate-ping" style={{ animationDelay: '2s' }} />
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-ping" style={{ animationDelay: '4s' }} />
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-red-400 rounded-full opacity-25 animate-ping" style={{ animationDelay: '6s' }} />
          
          {/* Spotlight effects */}
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-yellow-400 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-blue-400 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        </div>
        
        {/* Moving film strip at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 opacity-15">
          <div className="w-full h-full animate-pulse" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 15px, rgba(0,0,0,0.4) 15px, rgba(0,0,0,0.4) 30px)',
            animation: 'scroll 15s linear infinite'
          }} />
        </div>
      </div>
      
      {/* Dark Overlay for readability */}
      <div className="fixed inset-0 z-10 bg-black/60 backdrop-blur-[1px]" />
      
      {/* Subtle gradient overlay for depth */}
      <div className="fixed inset-0 z-20 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black/30" />
      
      {/* Content */}
      <div className="relative z-30 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
              <Film className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Movie Success Predictor
            </h1>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Predict the box office success of any movie using advanced analytics. 
            Search our database or enter new movie details for instant predictions.
          </p>
        </div>

        {!prediction ? (
          <Card className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-white/5 to-white/10 border-b border-white/10">
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                Get Your Prediction
              </CardTitle>
              <CardDescription className="text-white/80">
                Choose how you'd like to analyze your movie
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md border border-white/20 p-1">
                  <TabsTrigger 
                    value="search"
                    className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                  >
                    Search Existing Movies
                  </TabsTrigger>
                  <TabsTrigger 
                    value="new"
                    className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                  >
                    Enter New Movie
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="search" className="mt-8">
                  <MovieSearch onMovieSelect={handleMovieSelect} />
                </TabsContent>
                
                <TabsContent value="new" className="mt-8">
                  <MovieForm onSubmit={handleFormSubmit} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            <PredictionResult 
              movie={selectedMovie!} 
              prediction={prediction} 
            />
            <div className="text-center">
              <Button 
                onClick={resetPrediction}
                variant="outline"
                className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg"
              >
                Make Another Prediction
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
