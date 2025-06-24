
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Target, CheckCircle, Sparkles, Calendar } from 'lucide-react';
import { getTodaysChallenge } from '@/utils/challenges';
import { useNavigate } from 'react-router-dom';

const DailyChallengePage = () => {
  const navigate = useNavigate();
  const [response, setResponse] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const challengeText = getTodaysChallenge();

  const handleComplete = () => {
    if (response.trim()) {
      setIsCompleted(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        // Auto-navigate back to dashboard after completion
        setTimeout(() => navigate('/dashboard'), 2000);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black relative">
      <div className="relative z-10">
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3">
              Daily Challenge
              <Target className="w-8 h-8 text-emerald-500" />
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Take a moment to reflect and grow
            </p>
          </div>

          <Card className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50 dark:border-emerald-500/30 backdrop-blur-sm relative overflow-hidden max-w-2xl mx-auto">
            {showConfetti && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="text-8xl animate-bounce">🎉</div>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-emerald-800 dark:text-emerald-200 text-2xl">
                <Calendar className="w-6 h-6" />
                Today's Reflection
                {isCompleted && <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="p-6 bg-white/70 dark:bg-black/30 rounded-xl border border-emerald-200/50 dark:border-emerald-500/30">
                <p className="text-emerald-600 dark:text-emerald-200 text-xl text-center leading-relaxed">
                  {challengeText}
                </p>
              </div>

              {!isCompleted ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Take your time and share your thoughts..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="bg-white/70 dark:bg-black/30 border-emerald-200 dark:border-emerald-500/50 focus:border-emerald-400 dark:focus:border-emerald-400 transition-colors text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 min-h-32 text-lg"
                  />
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={() => navigate('/dashboard')}
                      variant="outline"
                      className="flex-1 border-emerald-200 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300"
                    >
                      Skip for Today
                    </Button>
                    <Button
                      onClick={handleComplete}
                      disabled={!response.trim()}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Complete Challenge
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="p-6 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl border border-emerald-200 dark:border-emerald-500/30">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                      <p className="font-bold text-emerald-800 dark:text-emerald-200 text-xl">
                        Challenge Completed! 🌟
                      </p>
                    </div>
                    <p className="text-emerald-700 dark:text-emerald-300 text-lg mb-4">
                      "{response}"
                    </p>
                    <p className="text-emerald-600 dark:text-emerald-400">
                      Your reflection has been saved. Come back tomorrow for a new challenge! ✨
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                  >
                    Return to Dashboard
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default DailyChallengePage;
