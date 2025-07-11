
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { MovieData } from '@/pages/Index';

interface MovieFormProps {
  onSubmit: (movie: MovieData) => void;
}

export const MovieForm = ({ onSubmit }: MovieFormProps) => {
  const [formData, setFormData] = useState<MovieData>({
    title: '',
    genre: '',
    director: '',
    budget: 0,
    cast: [],
    runtime: 0,
    releaseMonth: '',
    sequel: false,
    productionCompanies: 'Independent',
    originalLanguage: 'en',
    releaseYear: new Date().getFullYear(),
    avgRating: 7.0,
    ratingsCount: 1000,
  });
  const [newCastMember, setNewCastMember] = useState('');

  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 
    'Thriller', 'Romance', 'Animation', 'Documentary', 'Fantasy', 'Mystery'
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.genre && formData.director && formData.budget > 0) {
      onSubmit(formData);
    }
  };

  const addCastMember = () => {
    if (newCastMember.trim() && !formData.cast.includes(newCastMember.trim())) {
      setFormData(prev => ({
        ...prev,
        cast: [...prev.cast, newCastMember.trim()]
      }));
      setNewCastMember('');
    }
  };

  const removeCastMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      cast: prev.cast.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCastMember();
    }
  };

  return (
    <Card className="bg-slate-700/30 border-slate-600">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Movie Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter movie title"
                className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="director" className="text-white">Director *</Label>
              <Input
                id="director"
                value={formData.director}
                onChange={(e) => setFormData(prev => ({ ...prev, director: e.target.value }))}
                placeholder="Director name"
                className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-white">Genre *</Label>
              <Select value={formData.genre} onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}>
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre} className="text-white hover:bg-slate-600">
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget" className="text-white">Budget (USD) *</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                placeholder="e.g., 50000000"
                className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="runtime" className="text-white">Runtime (minutes)</Label>
              <Input
                id="runtime"
                type="number"
                value={formData.runtime || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, runtime: parseInt(e.target.value) || 0 }))}
                placeholder="e.g., 120"
                className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseMonth" className="text-white">Release Month</Label>
              <Select value={formData.releaseMonth} onValueChange={(value) => setFormData(prev => ({ ...prev, releaseMonth: value }))}>
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {months.map(month => (
                    <SelectItem key={month} value={month} className="text-white hover:bg-slate-600">
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-white">Cast Members</Label>
            <div className="flex gap-2">
              <Input
                value={newCastMember}
                onChange={(e) => setNewCastMember(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add cast member"
                className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
              />
              <Button 
                type="button" 
                onClick={addCastMember}
                variant="outline"
                className="bg-purple-600 border-purple-500 text-white hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {formData.cast.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.cast.map((actor, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-slate-600 text-white pr-1 flex items-center gap-1"
                  >
                    {actor}
                    <button
                      type="button"
                      onClick={() => removeCastMember(index)}
                      className="ml-1 hover:bg-slate-500 rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productionCompanies" className="text-white">Production Companies</Label>
              <Input
                id="productionCompanies"
                value={formData.productionCompanies}
                onChange={(e) => setFormData(prev => ({ ...prev, productionCompanies: e.target.value }))}
                placeholder="e.g., Warner Bros., Universal Pictures"
                className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalLanguage" className="text-white">Original Language</Label>
              <Select value={formData.originalLanguage} onValueChange={(value) => setFormData(prev => ({ ...prev, originalLanguage: value }))}>
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="en" className="text-white hover:bg-slate-600">English</SelectItem>
                  <SelectItem value="es" className="text-white hover:bg-slate-600">Spanish</SelectItem>
                  <SelectItem value="fr" className="text-white hover:bg-slate-600">French</SelectItem>
                  <SelectItem value="de" className="text-white hover:bg-slate-600">German</SelectItem>
                  <SelectItem value="it" className="text-white hover:bg-slate-600">Italian</SelectItem>
                  <SelectItem value="ja" className="text-white hover:bg-slate-600">Japanese</SelectItem>
                  <SelectItem value="ko" className="text-white hover:bg-slate-600">Korean</SelectItem>
                  <SelectItem value="zh" className="text-white hover:bg-slate-600">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="releaseYear" className="text-white">Release Year</Label>
              <Input
                id="releaseYear"
                type="number"
                value={formData.releaseYear || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, releaseYear: parseInt(e.target.value) || new Date().getFullYear() }))}
                placeholder="e.g., 2024"
                className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avgRating" className="text-white">Average Rating (0-10)</Label>
              <Input
                id="avgRating"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.avgRating || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, avgRating: parseFloat(e.target.value) || 7.0 }))}
                placeholder="e.g., 7.5"
                className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ratingsCount" className="text-white">Number of Ratings</Label>
            <Input
              id="ratingsCount"
              type="number"
              value={formData.ratingsCount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, ratingsCount: parseInt(e.target.value) || 1000 }))}
              placeholder="e.g., 10000"
              className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sequel"
              checked={formData.sequel}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sequel: checked as boolean }))}
              className="border-slate-500 data-[state=checked]:bg-purple-600"
            />
            <Label htmlFor="sequel" className="text-white">This is a sequel</Label>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
            disabled={!formData.title || !formData.genre || !formData.director || formData.budget <= 0}
          >
            Predict Movie Success
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
