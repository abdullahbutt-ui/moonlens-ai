
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingDown, Lightbulb, Clock } from 'lucide-react';

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
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  return (
    <Card className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 border-amber-200/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Brain className="w-5 h-5" />
          Mood Patterns & Triggers
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {patterns.length === 0 ? (
          <div className="text-center py-6">
            <TrendingDown className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Keep tracking your mood to discover patterns!</p>
            <p className="text-sm text-gray-500 mt-1">We need at least 2 weeks of data to identify triggers.</p>
          </div>
        ) : (
          patterns.map((pattern) => (
            <div
              key={pattern.id}
              className="bg-white/70 border border-amber-200/50 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getSeverityIcon(pattern.severity)}</span>
                    <Badge className={getSeverityColor(pattern.severity)}>
                      {pattern.severity} priority
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {pattern.frequency}x this month
                    </Badge>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-1">{pattern.pattern}</h4>
                  
                  {(pattern.timeOfDay || pattern.dayOfWeek) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Clock className="w-3 h-3" />
                      {pattern.dayOfWeek && <span>{pattern.dayOfWeek}s</span>}
                      {pattern.timeOfDay && <span>{pattern.timeOfDay}</span>}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50/70 border border-blue-200/50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-800 font-medium mb-1">AI Suggestion:</p>
                    <p className="text-sm text-blue-700">{pattern.suggestion}</p>
                  </div>
                </div>
                
                <Button
                  onClick={() => onApplySuggestion(pattern.id)}
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
