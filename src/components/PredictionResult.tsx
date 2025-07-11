
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, Star, Users, Clock, Calendar, Film } from 'lucide-react';
import { MovieData, PredictionData } from '@/pages/Index';

interface PredictionResultProps {
  movie: MovieData;
  prediction: PredictionData;
}

export const PredictionResult = ({ movie, prediction }: PredictionResultProps) => {
  const formatBudget = (budget: number) => {
    if (budget >= 1000000) {
      return `$${(budget / 1000000).toFixed(1)}M`;
    }
    return `$${(budget / 1000).toFixed(0)}K`;
  };

  const getSuccessColor = (success: boolean) => {
    return success ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Prediction Card */}
      <Card className={`bg-gradient-to-r ${getSuccessColor(prediction.success)} p-1`}>
        <div className="bg-slate-800 rounded-lg m-1">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              {prediction.success ? (
                <TrendingUp className="w-8 h-8 text-green-400" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-400" />
              )}
              <CardTitle className="text-3xl text-white">
                {prediction.success ? 'HIT' : 'FLOP'}
              </CardTitle>
              {prediction.success ? (
                <TrendingUp className="w-8 h-8 text-green-400" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-400" />
              )}
            </div>
            <CardDescription className="text-xl text-gray-300">
              Prediction for "{movie.title}"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="mb-4">
                <span className="text-6xl font-bold text-white">
                  {prediction.confidence}%
                </span>
                <p className={`text-lg font-semibold ${getConfidenceColor(prediction.confidence)}`}>
                  Confidence Level
                </p>
              </div>
              <Progress 
                value={prediction.confidence} 
                className="w-full h-3 bg-slate-700"
              />
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Movie Details and Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Movie Information */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-purple-400" />
              Movie Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Director</p>
                <p className="text-white font-semibold">{movie.director}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Genre</p>
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                  {movie.genre}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Budget</p>
                  <p className="text-white font-semibold">{formatBudget(movie.budget)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Runtime</p>
                  <p className="text-white font-semibold">{movie.runtime} min</p>
                </div>
              </div>
            </div>

            {movie.releaseMonth && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                <div>
                  <p className="text-sm text-gray-400">Release Month</p>
                  <p className="text-white font-semibold">{movie.releaseMonth}</p>
                </div>
              </div>
            )}

            {movie.sequel && (
              <Badge variant="outline" className="border-green-500 text-green-400">
                Sequel
              </Badge>
            )}

            {movie.cast.length > 0 && (
              <div>
                <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Cast
                </p>
                <div className="flex flex-wrap gap-1">
                  {movie.cast.map((actor, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-slate-500 text-gray-300">
                      {actor}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prediction Analysis */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Analysis & Projections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-white">Box Office Projection</h4>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {formatBudget(prediction.boxOfficeProjection)}
              </p>
              <p className="text-sm text-gray-400">
                Estimated total revenue
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Key Success Factors</h4>
              <div className="space-y-2">
                {prediction.factors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-slate-700/30 rounded">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg border border-purple-500/20">
              <h4 className="font-semibold text-white mb-2">Recommendation</h4>
              <p className="text-gray-300 text-sm">
                {prediction.success 
                  ? `This movie shows strong potential for success with a ${prediction.confidence}% confidence rating. Consider expanding marketing efforts and securing premium release dates.`
                  : `This movie faces significant challenges with a ${prediction.confidence}% confidence in underperformance. Consider budget adjustments or release strategy changes.`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
