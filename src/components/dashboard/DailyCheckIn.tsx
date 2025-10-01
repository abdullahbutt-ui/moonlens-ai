import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Flame, Award } from 'lucide-react';
import { EmotionType } from '@/types/emotion';
import { emotionEmojis, emotionColors } from '@/utils/emotionData';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';

interface DailyCheckInProps {
  onCheckIn?: (mood: EmotionType) => void;
}

const DailyCheckIn = ({ onCheckIn }: DailyCheckInProps) => {
  const { user } = useUser();
  const [selectedMood, setSelectedMood] = useState<EmotionType | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [loading, setLoading] = useState(false);

  const moods: EmotionType[] = ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral'];

  useEffect(() => {
    if (user) {
      checkTodayStatus();
      fetchStreak();
    }
  }, [user]);

  const checkTodayStatus = async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('check_in_date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking today status:', error);
        return;
      }

      setHasCheckedInToday(!!data);
    } catch (error) {
      console.error('Error checking today status:', error);
    }
  };

  const fetchStreak = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .rpc('calculate_user_streak', { user_uuid: user.id });

      if (error) {
        console.error('Error fetching streak:', error);
        setCurrentStreak(0);
        return;
      }

      setCurrentStreak(data || 0);
    } catch (error) {
      console.error('Error fetching streak:', error);
      setCurrentStreak(0);
    }
  };

  const handleCheckIn = async () => {
    if (!selectedMood || !user || loading) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('daily_checkins')
        .insert({
          user_id: user.id,
          mood: selectedMood,
          check_in_date: new Date().toISOString().split('T')[0]
        });

      if (error) {
        console.error('Error checking in:', error);
        toast.error('Failed to check in. Please try again.');
        return;
      }

      setHasCheckedInToday(true);
      onCheckIn?.(selectedMood);
      toast.success('Daily check-in completed! 🎉');
      
      // Fetch updated streak
      await fetchStreak();
      
      // Show reward animation for streaks
      if (currentStreak > 0 && (currentStreak + 1) % 7 === 0) {
        setShowReward(true);
        setTimeout(() => setShowReward(false), 3000);
      }
    } catch (error) {
      console.error('Error checking in:', error);
      toast.error('Failed to check in. Please try again.');
    } finally {
      setLoading(false);
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
    <Card className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200/50 dark:border-indigo-500/30 backdrop-blur-sm relative">
      {showReward && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-4xl sm:text-6xl animate-bounce">🏆</div>
        </div>
      )}
      
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center justify-between text-indigo-800 dark:text-indigo-200 text-lg sm:text-xl">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Daily Check-In</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-base sm:text-lg font-bold">{currentStreak}</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3 sm:space-y-4">
        {!hasCheckedInToday ? (
          <>
            <p className="text-indigo-700 dark:text-indigo-300 text-center font-medium text-sm sm:text-base">
              How are you feeling today?
            </p>
            
            {/* Responsive mood grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {moods.map((mood) => (
                <Button
                  key={mood}
                  variant={selectedMood === mood ? "default" : "outline"}
                  className={`h-16 sm:h-20 flex flex-col items-center justify-center text-xs sm:text-sm p-2 ${
                    selectedMood === mood ? 'ring-2 ring-indigo-400 dark:ring-indigo-500' : ''
                  }`}
                  onClick={() => setSelectedMood(mood)}
                  style={selectedMood === mood ? { backgroundColor: emotionColors[mood] } : {}}
                >
                  <span className="text-lg sm:text-xl mb-1">{emotionEmojis[mood]}</span>
                  <span className="capitalize leading-tight">{mood}</span>
                </Button>
              ))}
            </div>

            <Button
              onClick={handleCheckIn}
              disabled={!selectedMood || loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-sm sm:text-base py-2 sm:py-3"
            >
              {loading ? 'Checking in...' : 'Complete Check-In'}
            </Button>
          </>
        ) : (
          <div className="text-center space-y-3 py-2">
            <div className="text-3xl sm:text-4xl">✅</div>
            <p className="text-indigo-700 dark:text-indigo-300 font-medium text-sm sm:text-base">
              You've checked in today!
            </p>
            <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400">
              Come back tomorrow to continue your streak
            </p>
          </div>
        )}

        {badge && (
          <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
            <Award className="w-4 h-4 text-yellow-600" />
            <Badge className={`${badge.color} text-white px-2 sm:px-3 py-1 text-xs sm:text-sm`}>
              {badge.text}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyCheckIn;