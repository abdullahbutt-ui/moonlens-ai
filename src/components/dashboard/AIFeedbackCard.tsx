
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Zap, Volume2 } from 'lucide-react';
import { EmotionType } from '@/types/emotion';

interface AIFeedbackCardProps {
  feedback: string;
  currentMood: EmotionType;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

const AIFeedbackCard = ({ feedback, currentMood, suggestions = [], onSuggestionClick }: AIFeedbackCardProps) => {
  const getMoodIcon = () => {
    switch (currentMood) {
      case 'happy': return <Heart className="w-4 h-4 text-emerald-500" />;
      case 'sad': return <Volume2 className="w-4 h-4 text-blue-500" />;
      case 'anxious': return <Zap className="w-4 h-4 text-purple-500" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getMoodGradient = () => {
    switch (currentMood) {
      case 'happy': return 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20';
      case 'sad': return 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20';
      case 'anxious': return 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20';
      default: return 'from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20';
    }
  };

  return (
    <Card className={`bg-gradient-to-br ${getMoodGradient()} border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {getMoodIcon()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              AI Reflection
            </p>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
              {feedback}
            </p>
          </div>
        </div>
        
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Gentle suggestions:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionClick?.(suggestion)}
                  className="text-xs h-7 px-3 bg-white/60 dark:bg-black/30 border-gray-300/50 dark:border-gray-600/50 hover:bg-white/80 dark:hover:bg-black/50 text-gray-600 dark:text-gray-300"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIFeedbackCard;
