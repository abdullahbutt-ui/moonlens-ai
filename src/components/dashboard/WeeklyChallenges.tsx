
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Target, Calendar } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'breathing' | 'audio' | 'mindfulness' | 'movement';
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface WeeklyChallengesProps {
  challenges: Challenge[];
  onCompleteChallenge: (challengeId: string) => void;
}

const WeeklyChallenges = ({ challenges, onCompleteChallenge }: WeeklyChallengesProps) => {
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);

  const completedCount = challenges.filter(c => c.completed).length;
  const completionPercentage = Math.round((completedCount / challenges.length) * 100);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'breathing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'audio': return 'bg-green-100 text-green-800 border-green-200';
      case 'mindfulness': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'movement': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyEmoji = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🌱';
      case 'medium': return '🌿';
      case 'hard': return '🌳';
      default: return '🌱';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-teal-50/80 to-cyan-50/80 border-teal-200/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-teal-800">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Weekly Challenges
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{completedCount}/{challenges.length}</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-white/70 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-teal-700">Weekly Progress</span>
            <span className="text-sm text-teal-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-teal-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                challenge.completed 
                  ? 'bg-teal-100/50 border-teal-200' 
                  : 'bg-white/70 border-gray-200 hover:border-teal-300'
              }`}
              onClick={() => setExpandedChallenge(
                expandedChallenge === challenge.id ? null : challenge.id
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {challenge.completed ? (
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{challenge.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getCategoryColor(challenge.category)}>
                        {challenge.category}
                      </Badge>
                      <span className="text-xs">{getDifficultyEmoji(challenge.difficulty)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {expandedChallenge === challenge.id && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                  {!challenge.completed && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCompleteChallenge(challenge.id);
                      }}
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyChallenges;
