
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingDown, Lightbulb, Clock, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TriggerPattern {
  id: string;
  pattern: string;
  frequency: number;
  timeOfDay?: string;
  dayOfWeek?: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

interface MoodTriggerInsightsProps {
  patterns: TriggerPattern[];
  onApplySuggestion: (patternId: string) => void;
}

const MoodTriggerInsights = ({ patterns, onApplySuggestion }: MoodTriggerInsightsProps) => {
  const navigate = useNavigate();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-500/30';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-500/30';
      case 'low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-500/30';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-500/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const handleSuggestionClick = (patternId: string, suggestion: string) => {
    onApplySuggestion(patternId);
    
    // Route to appropriate action based on suggestion content
    if (suggestion.includes('forest rain') || suggestion.includes('sounds')) {
      // For now, we'll show a success message - in a real app this would open the sound center
      console.log('Opening sound center with forest rain');
    } else if (suggestion.includes('breathing')) {
      // Could open breathing exercise
      console.log('Opening breathing exercise');
    } else if (suggestion.includes('trends') || suggestion.includes('pattern')) {
      navigate('/mood-trends');
    }
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50 dark:border-amber-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <Brain className="w-5 h-5" />
          Mood Patterns & Triggers
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {patterns.length === 0 ? (
          <div className="text-center py-6">
            <Activity className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">Keep tracking your mood to discover patterns!</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">We need at least 2 weeks of data to identify triggers.</p>
            <Button 
              onClick={() => navigate('/mood-trends')}
              className="mt-4 bg-amber-600 hover:bg-amber-700 text-white"
            >
              View Your Progress
            </Button>
          </div>
        ) : (
          patterns.map((pattern) => (
            <div
              key={pattern.id}
              className="bg-white/70 dark:bg-gray-800/70 border border-amber-200/50 dark:border-amber-500/30 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getSeverityIcon(pattern.severity)}</span>
                    <Badge className={getSeverityColor(pattern.severity)}>
                      {pattern.severity} priority
                    </Badge>
                    <Badge variant="outline" className="text-xs border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-300">
                      {pattern.frequency}x this month
                    </Badge>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{pattern.pattern}</h4>
                  
                  {(pattern.timeOfDay || pattern.dayOfWeek) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <Clock className="w-3 h-3" />
                      {pattern.dayOfWeek && <span>{pattern.dayOfWeek}s</span>}
                      {pattern.timeOfDay && <span>{pattern.timeOfDay}</span>}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50/70 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-500/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">AI Suggestion:</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{pattern.suggestion}</p>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleSuggestionClick(pattern.id, pattern.suggestion)}
                  size="sm"
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Try This Now
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default MoodTriggerInsights;
