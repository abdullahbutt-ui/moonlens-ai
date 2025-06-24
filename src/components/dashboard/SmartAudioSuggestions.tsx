
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { EmotionType } from '@/types/emotion';

interface AudioSession {
  id: string;
  soundName: string;
  duration: number;
  startMood: EmotionType;
  endMood?: EmotionType;
  rating?: number;
  timestamp: Date;
}

interface SmartAudioSuggestionsProps {
  currentMood: EmotionType;
  recentSessions: AudioSession[];
  onStartAudio: (soundId: string) => void;
  onRateSession: (sessionId: string, rating: number, endMood: EmotionType) => void;
}

const SmartAudioSuggestions = ({ 
  currentMood, 
  recentSessions, 
  onStartAudio,
  onRateSession 
}: SmartAudioSuggestionsProps) => {
  const [showRating, setShowRating] = useState<string | null>(null);
  const [selectedEndMood, setSelectedEndMood] = useState<EmotionType>('neutral');

  const suggestions = [
    {
      id: 'forest-rain',
      name: 'Forest Rain',
      reason: 'Highly rated for your mood type',
      confidence: 95,
      moods: ['anxious', 'stressed', 'sad'] as EmotionType[],
      category: 'nature'
    },
    {
      id: 'ocean-waves',
      name: 'Ocean Waves',
      reason: 'You loved this last Tuesday',
      confidence: 88,
      moods: ['overwhelmed', 'sad'] as EmotionType[],
      category: 'nature'
    },
    {
      id: 'lofi-study',
      name: 'Lo-fi Beats',
      reason: 'Perfect for your evening routine',
      confidence: 76,
      moods: ['neutral', 'focused'] as EmotionType[],
      category: 'lofi'
    }
  ];

  const getRelevantSuggestions = () => {
    return suggestions
      .filter(s => s.moods.includes(currentMood))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 2);
  };

  const handleRating = (sessionId: string, rating: number) => {
    onRateSession(sessionId, rating, selectedEndMood);
    setShowRating(null);
  };

  const relevantSuggestions = getRelevantSuggestions();
  const activeSession = recentSessions.find(s => !s.endMood && !s.rating);

  return (
    <Card className="bg-gradient-to-br from-emerald-50/80 to-green-50/80 border-emerald-200/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-800">
          <Sparkles className="w-5 h-5" />
          Smart Audio Picks
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {relevantSuggestions.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-emerald-700 font-medium">
              Based on your {currentMood} mood:
            </p>
            
            {relevantSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white/70 border border-emerald-200/50 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{suggestion.name}</h4>
                  <Badge className="bg-emerald-100 text-emerald-800">
                    {suggestion.confidence}% match
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{suggestion.reason}</p>
                
                <Button
                  onClick={() => onStartAudio(suggestion.id)}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Play Now
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-emerald-700 text-center py-4">
            Keep using audio sessions to get personalized recommendations!
          </p>
        )}

        {activeSession && (
          <div className="bg-blue-50/70 border border-blue-200/50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">How do you feel now?</h4>
            <p className="text-sm text-blue-700 mb-3">
              You've been listening to {activeSession.soundName} for {Math.round((Date.now() - activeSession.timestamp.getTime()) / 60000)} minutes
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRating(activeSession.id, rating)}
                    className="text-yellow-400 hover:text-yellow-500 transition-colors"
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRating(activeSession.id, 4)}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Better
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRating(activeSession.id, 2)}
                  className="flex items-center gap-2"
                >
                  <ThumbsDown className="w-4 h-4" />
                  Same
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartAudioSuggestions;
