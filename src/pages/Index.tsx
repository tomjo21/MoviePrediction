
import { useState } from 'react';
import { MovieSearch } from '@/components/MovieSearch';
import { MovieForm } from '@/components/MovieForm';
import { PredictionResult } from '@/components/PredictionResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Film, Sparkles, TrendingUp } from 'lucide-react';

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
    // Simulate prediction
    const mockPrediction = generateMockPrediction(movie);
    setPrediction(mockPrediction);
  };

  const handleFormSubmit = (movieData: MovieData) => {
    setSelectedMovie(movieData);
    const mockPrediction = generateMockPrediction(movieData);
    setPrediction(mockPrediction);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-600 rounded-full">
              <Film className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Movie Success Predictor</h1>
            <div className="p-3 bg-purple-600 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Predict the box office success of any movie using advanced analytics. 
            Search our database or enter new movie details for instant predictions.
          </p>
        </div>

        {!prediction ? (
          <Card className="max-w-4xl mx-auto bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                Get Your Prediction
              </CardTitle>
              <CardDescription className="text-gray-400">
                Choose how you'd like to analyze your movie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                  <TabsTrigger value="search" className="data-[state=active]:bg-purple-600">
                    Search Existing Movies
                  </TabsTrigger>
                  <TabsTrigger value="new" className="data-[state=active]:bg-purple-600">
                    Enter New Movie
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="search" className="mt-6">
                  <MovieSearch onMovieSelect={handleMovieSelect} />
                </TabsContent>
                
                <TabsContent value="new" className="mt-6">
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
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
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
