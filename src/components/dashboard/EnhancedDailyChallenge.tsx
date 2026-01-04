import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Target, CheckCircle, Sparkles, Calendar, Flame, Lock } from 'lucide-react';
import { EmotionType } from '@/types/emotion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface EnhancedDailyChallengeProps {
  currentMood: EmotionType;
  isPremium?: boolean;
  onUpgradeClick?: () => void;
  onChallengeComplete?: (streakCount: number) => void;
}

const EnhancedDailyChallenge = ({ 
  currentMood, 
  isPremium = false, 
  onUpgradeClick,
  onChallengeComplete 
}: EnhancedDailyChallengeProps) => {
  const { user } = useAuth();
  const [todaysChallenge, setTodaysChallenge] = useState<string>('');
  const [response, setResponse] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadTodaysChallenge();
      loadStreak();
    }
  }, [user, currentMood]);

  const getMoodBasedChallenge = (mood: EmotionType): string => {
    const challenges = {
      happy: [
        "Share your joy! Call someone you care about and spread your positive energy.",
        "Write down 3 things that made you smile today and why they matter to you.",
        "Take a photo of something beautiful you notice today.",
        "Dance to your favorite song for 5 minutes.",
        "Do a small act of kindness for someone else."
      ],
      sad: [
        "Practice self-compassion. Write yourself a kind letter as if comforting a friend.",
        "Take 10 deep breaths and notice how your body feels with each exhale.",
        "Listen to a song that always comforts you and let yourself feel.",
        "Take a warm, mindful shower or bath and focus on the sensations.",
        "Write about what you need most right now to feel supported."
      ],
      anxious: [
        "Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
        "Write down your worries, then for each one, write: 'Is this in my control?' and 'What's one small step I can take?'",
        "Spend 10 minutes in nature, even if it's just by a window with plants.",
        "Practice box breathing: breathe in for 4, hold for 4, out for 4, hold for 4. Repeat 10 times.",
        "Do gentle stretches and focus on releasing tension from your body."
      ],
      excited: [
        "Channel your energy! Set one goal you want to accomplish this week.",
        "Create something: draw, write, build, cook - let your excitement flow into creativity.",
        "Share your excitement with someone who would celebrate with you.",
        "Plan something fun to look forward to next week.",
        "Use this energy for a 15-minute workout or dance session."
      ],
      calm: [
        "Practice mindful gratitude: slowly name 5 things you appreciate right now.",
        "Spend 10 minutes journaling about your personal growth lately.",
        "Meditate for 10 minutes, focusing on maintaining this peaceful feeling.",
        "Organize a small space in your home mindfully and intentionally.",
        "Set gentle intentions for tomorrow while feeling centered."
      ],
      angry: [
        "Channel your anger constructively: write about what needs to change and one action you can take.",
        "Do 20 jumping jacks or push-ups to release the physical energy of anger.",
        "Practice progressive muscle relaxation, starting from your toes to your head.",
        "Write an angry letter you'll never send, then safely destroy it.",
        "Identify what boundary you need to set to protect your peace."
      ],
      neutral: [
        "Check in with yourself: how are you really feeling beneath the surface?",
        "Do one small thing to make tomorrow easier for yourself.",
        "Practice a 5-minute breathing meditation to connect with your inner state.",
        "Write about what you're curious about or interested in lately.",
        "Declutter one small area and notice how it affects your mental space."
      ]
    };

    const moodChallenges = challenges[currentMood] || challenges.neutral;
    return moodChallenges[Math.floor(Math.random() * moodChallenges.length)];
  };

  const loadTodaysChallenge = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('assigned_date', today)
        .single();

      if (data) {
        setTodaysChallenge(data.description || data.title);
        setIsCompleted(data.completed);
        if (data.completed) {
          // Load the user's response if they completed it
          setResponse('Challenge completed! ✨');
        }
      } else {
        // Create new challenge for today
        const challenge = getMoodBasedChallenge(currentMood);
        setTodaysChallenge(challenge);
        
        await supabase
          .from('daily_challenges')
          .insert({
            user_id: user.id,
            title: 'Daily Self-Care Challenge',
            description: challenge,
            assigned_date: today,
            challenge_type: 'mood_based',
            mood_context: currentMood,
            difficulty_level: 'easy'
          });
      }
    } catch (error) {
      console.error('Error loading challenge:', error);
      setTodaysChallenge(getMoodBasedChallenge(currentMood));
    }
  };

  const loadStreak = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_preferences')
        .select('streak_count')
        .eq('user_id', user.id)
        .single();

      setStreak(data?.streak_count || 0);
    } catch (error) {
      console.error('Error loading streak:', error);
    }
  };

  const completeChallenge = async () => {
    if (!isPremium) {
      onUpgradeClick?.();
      return;
    }

    if (!user || !response.trim()) return;

    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Mark challenge as completed
      await supabase
        .from('daily_challenges')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('assigned_date', today);

      setIsCompleted(true);
      
      // The trigger will automatically update achievements and streak
      // Load the updated streak
      setTimeout(() => {
        loadStreak();
      }, 1000);

      onChallengeComplete?.(streak + 1);
      toast.success('🎉 Challenge completed! Your streak continues!');
    } catch (error) {
      console.error('Error completing challenge:', error);
      toast.error('Failed to complete challenge');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isPremium) {
    return (
      <Card className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50 dark:border-emerald-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
            <Target className="w-5 h-5" />
            Daily Self-Care Challenge
            <Lock className="w-4 h-4 ml-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-4xl mb-4">🎯✨</div>
          <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get personalized daily challenges based on your mood, with streak tracking and achievements.
          </p>
          <Button onClick={onUpgradeClick} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Unlock Challenges
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50 dark:border-emerald-500/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Daily Challenge
          </div>
          <div className="flex items-center gap-3">
            {isCompleted && <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                {streak}
              </span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Mood Context */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white/70 dark:bg-black/30 rounded-lg">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span className="text-sm text-emerald-700 dark:text-emerald-300">
            Tailored for your <strong className="capitalize">{currentMood}</strong> mood
          </span>
        </div>

        {/* Challenge */}
        <div className="p-4 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg border border-emerald-200 dark:border-emerald-500/30">
          <div className="flex items-start gap-2 mb-2">
            <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Today's Challenge:
            </span>
          </div>
          <p className="text-emerald-800 dark:text-emerald-200 leading-relaxed">
            {todaysChallenge}
          </p>
        </div>

        {!isCompleted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <Textarea
              placeholder="Share your experience completing this challenge..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="bg-white/70 dark:bg-black/30 border-emerald-200 dark:border-emerald-500/50 focus:border-emerald-400 dark:focus:border-emerald-400"
            />
            
            <Button
              onClick={completeChallenge}
              disabled={!response.trim() || isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Challenge
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="font-medium text-green-800 dark:text-green-200">Challenge Completed!</p>
            </div>
            <p className="text-green-700 dark:text-green-300 text-sm mb-2">
              Amazing work! Your wellness streak continues.
            </p>
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <Flame className="w-3 h-3" />
              Come back tomorrow for a new challenge
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedDailyChallenge;