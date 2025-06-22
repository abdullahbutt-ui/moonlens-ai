
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Target, CheckCircle, Sparkles } from 'lucide-react';
import { getTodaysChallenge } from '@/utils/challenges';
import { DailyChallenge as DailyChallengeType } from '@/types/journal';

interface DailyChallengeProps {
  todaysChallenge?: DailyChallengeType;
  onCompleteChallenge: (response: string) => void;
}

const DailyChallenge = ({ todaysChallenge, onCompleteChallenge }: DailyChallengeProps) => {
  const [response, setResponse] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const challengeText = todaysChallenge?.challengeText || getTodaysChallenge();
  const isCompleted = todaysChallenge?.completed || false;

  const handleComplete = () => {
    if (response.trim()) {
      onCompleteChallenge(response);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setResponse('');
    }
  };

  return (
    <Card className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 border-emerald-200/50 backdrop-blur-sm relative overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-emerald-800">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Daily Challenge
          </div>
          {isCompleted && <CheckCircle className="w-5 h-5 text-emerald-600" />}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="p-4 bg-white/70 rounded-lg border border-emerald-200/50">
          <p className="text-emerald-700 font-medium mb-2">Today's Reflection:</p>
          <p className="text-emerald-600 text-lg">{challengeText}</p>
        </div>

        {!isCompleted ? (
          <div className="space-y-3">
            <Textarea
              placeholder="Share your thoughts..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="bg-white/70 border-emerald-200 focus:border-emerald-400 transition-colors"
            />
            
            <Button
              onClick={handleComplete}
              disabled={!response.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Complete Challenge
            </Button>
          </div>
        ) : (
          <div className="p-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <p className="font-medium text-emerald-800">Challenge Completed!</p>
            </div>
            <p className="text-emerald-700 text-sm">
              {todaysChallenge?.response || "Great job reflecting today!"}
            </p>
            <p className="text-xs text-emerald-600 mt-2">
              Come back tomorrow for a new challenge ✨
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyChallenge;
