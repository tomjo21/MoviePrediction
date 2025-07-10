
import { useState } from 'react';
import { Search, Film } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MovieData } from '@/pages/Index';
import { sampleMovies } from '@/data/movieData';

interface MovieSearchProps {
  onMovieSelect: (movie: MovieData) => void;
}

export const MovieSearch = ({ onMovieSelect }: MovieSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState<MovieData[]>(sampleMovies);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredMovies(sampleMovies);
      return;
    }
    
    const filtered = sampleMovies.filter(movie =>
      movie.title.toLowerCase().includes(term.toLowerCase()) ||
      movie.genre.toLowerCase().includes(term.toLowerCase()) ||
      movie.director.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredMovies(filtered);
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search by movie title, genre, or director..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="grid gap-4 max-h-96 overflow-y-auto">
        {filteredMovies.map((movie, index) => (
          <Card 
            key={index} 
            className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => onMovieSelect(movie)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                    <Film className="w-5 h-5 text-muted-foreground" />
                    {movie.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Directed by {movie.director}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  {movie.genre}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span>Budget: {formatBudget(movie.budget)}</span>
                <span>•</span>
                <span>{movie.runtime} min</span>
                <span>•</span>
                <span>{movie.releaseMonth}</span>
                {movie.sequel && (
                  <>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs border-border text-foreground">
                      Sequel
                    </Badge>
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {movie.cast.slice(0, 3).map((actor, i) => (
                  <Badge key={i} variant="outline" className="text-xs border-border text-muted-foreground">
                    {actor}
                  </Badge>
                ))}
                {movie.cast.length > 3 && (
                  <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                    +{movie.cast.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredMovies.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Film className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No movies found matching your search.</p>
            <p className="text-sm">Try searching with different keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
};
