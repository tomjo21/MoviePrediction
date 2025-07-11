import { MovieData } from '@/pages/Index';

// Interface for the raw CSV data
interface RawMovieData {
  budget: number;
  popularity: number;
  revenue: number;
  runtime: number;
  title: string;
  avg_rating: number;
  ratings: number;
  Action: number;
  Adventure: number;
  Animation: number;
  Comedy: number;
  Crime: number;
  Documentary: number;
  Drama: number;
  Family: number;
  Fantasy: number;
  Foreign: number;
  History: number;
  Horror: number;
  Music: number;
  Mystery: number;
  Romance: number;
  'Science Fiction': number;
  'TV Movie': number;
  Thriller: number;
  War: number;
  Western: number;
  release_year: number;
  director: string;
  actor_1: string;
  actor_2: string;
  actor_3: string;
  success: number;
  director_success_rate: number;
  actor_1_success_rate: number;
  actor_2_success_rate: number;
  actor_3_success_rate: number;
}

// Convert raw CSV data to our MovieData interface
const convertRawToMovieData = (raw: RawMovieData): MovieData => {
  // Determine the primary genre based on the highest value
  const genreColumns = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'Foreign', 'History', 'Horror', 'Music',
    'Mystery', 'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'
  ];
  
  let primaryGenre = 'Drama'; // Default
  let maxGenreValue = 0;
  
  for (const genre of genreColumns) {
    const value = raw[genre as keyof RawMovieData] as number;
    if (value > maxGenreValue) {
      maxGenreValue = value;
      primaryGenre = genre;
    }
  }

  // Convert month number to month name (we'll use a default since CSV doesn't have month)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const releaseMonth = months[Math.floor(Math.random() * 12)]; // Random month for demo

  return {
    title: raw.title,
    genre: primaryGenre,
    director: raw.director,
    budget: raw.budget,
    cast: [raw.actor_1, raw.actor_2, raw.actor_3].filter(actor => actor && actor.trim()),
    runtime: raw.runtime,
    releaseMonth: releaseMonth,
    sequel: false, // We'll determine this based on title patterns
    rating: 'PG-13', // Default rating
    productionCompanies: 'Major Studio', // Default since CSV doesn't have this
    originalLanguage: 'en', // Default since CSV doesn't have this
    releaseYear: raw.release_year,
    avgRating: raw.avg_rating,
    ratingsCount: raw.ratings
  };
};

// Load and cache the movie data
let cachedMovies: MovieData[] | null = null;

export const loadMovieData = async (): Promise<MovieData[]> => {
  if (cachedMovies) {
    return cachedMovies;
  }

  try {
    // Load the CSV file
    const response = await fetch('/final_tmdb_cleaned.csv');
    if (!response.ok) {
      throw new Error('Failed to load movie data');
    }

    const csvText = await response.text();
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    const movies: MovieData[] = [];
    
    // Process each line (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      try {
        const values = line.split(',');
        const rawData: any = {};
        
        // Map CSV columns to raw data object
        headers.forEach((header, index) => {
          const value = values[index];
          if (header === 'Science Fiction') {
            rawData['Science Fiction'] = parseInt(value) || 0;
          } else if (header === 'TV Movie') {
            rawData['TV Movie'] = parseInt(value) || 0;
          } else {
            rawData[header] = value;
          }
        });
        
        // Convert numeric values
        rawData.budget = parseInt(rawData.budget) || 0;
        rawData.runtime = parseFloat(rawData.runtime) || 0;
        rawData.avg_rating = parseFloat(rawData.avg_rating) || 0;
        rawData.ratings = parseInt(rawData.ratings) || 0;
        rawData.release_year = parseInt(rawData.release_year) || 2000;
        
        // Convert genre columns to numbers
        const genreColumns = [
          'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
          'Drama', 'Family', 'Fantasy', 'Foreign', 'History', 'Horror', 'Music',
          'Mystery', 'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'
        ];
        
        genreColumns.forEach(genre => {
          rawData[genre] = parseInt(rawData[genre]) || 0;
        });
        
        // Convert success rates
        rawData.director_success_rate = parseFloat(rawData.director_success_rate) || 0.5;
        rawData.actor_1_success_rate = parseFloat(rawData.actor_1_success_rate) || 0.5;
        rawData.actor_2_success_rate = parseFloat(rawData.actor_2_success_rate) || 0.5;
        rawData.actor_3_success_rate = parseFloat(rawData.actor_3_success_rate) || 0.5;
        
        const movieData = convertRawToMovieData(rawData as RawMovieData);
        movies.push(movieData);
        
      } catch (error) {
        console.warn(`Error processing line ${i}:`, error);
        continue;
      }
    }
    
    cachedMovies = movies;
    return movies;
    
  } catch (error) {
    console.error('Error loading movie data:', error);
    // Return empty array if CSV loading fails
    return [];
  }
};

// Search movies by title, director, or genre
export const searchMovies = async (searchTerm: string): Promise<MovieData[]> => {
  const movies = await loadMovieData();
  
  if (!searchTerm.trim()) {
    return movies.slice(0, 50); // Return first 50 movies if no search term
  }
  
  const term = searchTerm.toLowerCase();
  return movies.filter(movie =>
    movie.title.toLowerCase().includes(term) ||
    movie.director.toLowerCase().includes(term) ||
    movie.genre.toLowerCase().includes(term)
  ).slice(0, 50); // Limit results to 50
};

// Get movies by genre
export const getMoviesByGenre = async (genre: string): Promise<MovieData[]> => {
  const movies = await loadMovieData();
  return movies.filter(movie => 
    movie.genre.toLowerCase() === genre.toLowerCase()
  ).slice(0, 20);
};

// Get popular movies (by budget or rating)
export const getPopularMovies = async (): Promise<MovieData[]> => {
  const movies = await loadMovieData();
  return movies
    .filter(movie => movie.budget > 100000000) // High budget movies
    .sort((a, b) => b.avgRating - a.avgRating) // Sort by rating
    .slice(0, 20);
}; 