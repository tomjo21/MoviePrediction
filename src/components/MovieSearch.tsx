import { useState, useEffect } from 'react';
import { Search, Film, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MovieData } from '@/pages/Index';
import { searchMovies, loadMovieData } from '@/data/movieDataService';

interface MovieSearchProps {
  onMovieSelect: (movie: MovieData) => void;
}

export const MovieSearch = ({ onMovieSelect }: MovieSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState<MovieData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial movies on component mount
  useEffect(() => {
    loadInitialMovies();
  }, []);

  const loadInitialMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const movies = await loadMovieData();
      setFilteredMovies(movies.slice(0, 20)); // Show first 20 movies initially
    } catch (err) {
      setError('Failed to load movies. Please try again.');
      console.error('Error loading movies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setIsLoading(true);
    setError(null);
    
    try {
      const movies = await searchMovies(term);
      setFilteredMovies(movies);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Error searching movies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBudget = (budget: number) => {
    if (budget >= 1000000) {
      return `$${(budget / 1000000).toFixed(1)}M`;
    }
    return `$${(budget / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
        <Input
          placeholder="Search by movie title, genre, or director..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:bg-white/15"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4 animate-spin" />
        )}
      </div>

      {error && (
        <div className="text-center py-4 text-red-400 bg-red-900/20 rounded-lg border border-red-500/20">
          <p>{error}</p>
          <button 
            onClick={loadInitialMovies}
            className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid gap-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {filteredMovies.map((movie, index) => (
          <Card 
            key={index} 
            className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
            onClick={() => onMovieSelect(movie)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Film className="w-5 h-5 text-white/80" />
                    {movie.title}
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Directed by {movie.director}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-white/10 text-white/90 border-white/20">
                  {movie.genre}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2 text-sm text-white/70">
                <span>Budget: {formatBudget(movie.budget)}</span>
                <span>•</span>
                <span>{movie.runtime} min</span>
                <span>•</span>
                <span>{movie.releaseMonth}</span>
                {movie.sequel && (
                  <>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs border-white/20 text-white/80">
                      Sequel
                    </Badge>
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {movie.cast.slice(0, 3).map((actor, i) => (
                  <Badge key={i} variant="outline" className="text-xs border-white/20 text-white/70">
                    {actor}
                  </Badge>
                ))}
                {movie.cast.length > 3 && (
                  <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                    +{movie.cast.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {isLoading && filteredMovies.length === 0 && (
          <div className="text-center py-12 text-white/70">
            <Loader2 className="w-16 h-16 mx-auto mb-6 opacity-50 animate-spin" />
            <p className="text-lg mb-2">Loading movies...</p>
            <p className="text-sm">Please wait while we fetch the data.</p>
          </div>
        )}

        {!isLoading && filteredMovies.length === 0 && (
          <div className="text-center py-12 text-white/70">
            <Film className="w-16 h-16 mx-auto mb-6 opacity-50" />
            <p className="text-lg mb-2">No movies found matching your search.</p>
            <p className="text-sm">Try searching with different keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
};
