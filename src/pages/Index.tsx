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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
        }}
      />
      
      {/* Dark Overlay */}
      <div className="fixed inset-0 z-10 bg-black/70 backdrop-blur-sm" />
      
      {/* Gradient Overlay for depth */}
      <div className="fixed inset-0 z-20 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-black/40" />
      
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
      
      {/* Floating elements for extra visual appeal */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="fixed top-1/2 left-1/4 w-20 h-20 bg-pink-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default Index;
