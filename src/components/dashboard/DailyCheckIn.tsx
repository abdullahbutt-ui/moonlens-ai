
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Flame, Award } from 'lucide-react';
import { EmotionType } from '@/types/emotion';
import { emotionEmojis, emotionColors } from '@/utils/emotionData';

interface DailyCheckInProps {
  onCheckIn: (mood: EmotionType) => void;
  currentStreak: number;
  hasCheckedInToday: boolean;
}

const DailyCheckIn = ({ onCheckIn, currentStreak, hasCheckedInToday }: DailyCheckInProps) => {
  const [selectedMood, setSelectedMood] = useState<EmotionType | null>(null);
  const [showReward, setShowReward] = useState(false);

  const moods: EmotionType[] = ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral'];

  const handleCheckIn = () => {
    if (selectedMood) {
      onCheckIn(selectedMood);
      if (currentStreak > 0 && currentStreak % 7 === 0) {
        setShowReward(true);
        setTimeout(() => setShowReward(false), 3000);
      }
    }
  };

  const getStreakBadge = () => {
    if (currentStreak >= 30) return { text: 'Mindful Master', color: 'bg-purple-500' };
    if (currentStreak >= 14) return { text: 'Consistent Soul', color: 'bg-blue-500' };
    if (currentStreak >= 7) return { text: 'Weekly Warrior', color: 'bg-green-500' };
    if (currentStreak >= 3) return { text: 'Building Habit', color: 'bg-yellow-500' };
    return null;
  };

  const badge = getStreakBadge();

  return (
    <Card className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border-indigo-200/50 backdrop-blur-sm relative">
      {showReward && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-6xl animate-bounce">🏆</div>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-indigo-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily Check-In
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-lg font-bold">{currentStreak}</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!hasCheckedInToday ? (
          <>
            <p className="text-indigo-700 text-center font-medium">How are you feeling today?</p>
            
            <div className="grid grid-cols-4 gap-2">
              {moods.map((mood) => (
                <Button
                  key={mood}
                  variant={selectedMood === mood ? "default" : "outline"}
                  className={`h-12 flex flex-col items-center justify-center text-xs ${
                    selectedMood === mood ? 'ring-2 ring-indigo-400' : ''
                  }`}
                  onClick={() => setSelectedMood(mood)}
                  style={selectedMood === mood ? { backgroundColor: emotionColors[mood] } : {}}
                >
                  <span className="text-lg">{emotionEmojis[mood]}</span>
                  <span className="capitalize">{mood}</span>
                </Button>
              ))}
            </div>

            <Button
              onClick={handleCheckIn}
              disabled={!selectedMood}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Complete Check-In
            </Button>
          </>
        ) : (
          <div className="text-center space-y-3">
            <div className="text-4xl">✅</div>
            <p className="text-indigo-700 font-medium">You've checked in today!</p>
            <p className="text-sm text-indigo-600">Come back tomorrow to continue your streak</p>
          </div>
        )}

        {badge && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Award className="w-4 h-4 text-yellow-600" />
            <Badge className={`${badge.color} text-white px-3 py-1`}>
              {badge.text}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyCheckIn;
