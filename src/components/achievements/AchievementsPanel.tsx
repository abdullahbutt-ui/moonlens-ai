import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Flame, Star } from 'lucide-react';
import AchievementBadge from './AchievementBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface AchievementsPanelProps {
  streakCount?: number;
  totalChallenges?: number;
  className?: string;
}

const AchievementsPanel = ({ streakCount = 0, totalChallenges = 0, className }: AchievementsPanelProps) => {
  const { user } = useUser();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  const defaultAchievements: Achievement[] = [
    {
      id: 'first_checkin',
      title: 'Getting Started',
      description: 'Complete your first daily check-in',
      icon: 'star',
      earned: totalChallenges > 0,
      progress: totalChallenges > 0 ? 1 : 0,
      maxProgress: 1
    },
    {
      id: 'week_streak',
      title: 'Week Warrior',
      description: 'Maintain a 7-day check-in streak',
      icon: 'flame',
      earned: streakCount >= 7,
      progress: Math.min(streakCount, 7),
      maxProgress: 7
    },
    {
      id: 'month_streak',
      title: 'Month Master',
      description: 'Maintain a 30-day check-in streak',
      icon: 'crown',
      earned: streakCount >= 30,
      progress: Math.min(streakCount, 30),
      maxProgress: 30
    },
    {
      id: 'challenge_hero',
      title: 'Challenge Hero',
      description: 'Complete 10 daily challenges',
      icon: 'target',
      earned: totalChallenges >= 10,
      progress: Math.min(totalChallenges, 10),
      maxProgress: 10
    },
    {
      id: 'wellness_champion',
      title: 'Wellness Champion',
      description: 'Complete 50 daily challenges',
      icon: 'trophy',
      earned: totalChallenges >= 50,
      progress: Math.min(totalChallenges, 50),
      maxProgress: 50
    }
  ];

  useEffect(() => {
    loadUserAchievements();
  }, [user, streakCount, totalChallenges]);

  const loadUserAchievements = async () => {
    if (!user) return;

    try {
      // Load user preferences to get saved achievements
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('achievements, streak_count')
        .eq('user_id', user.id)
        .single();

      const savedAchievements = preferences?.achievements || {};
      
      // Merge with default achievements and check for new ones
      const updatedAchievements = defaultAchievements.map(achievement => {
        const wasEarned = savedAchievements[achievement.id];
        const nowEarned = achievement.earned;
        
        // Check for newly earned achievements
        if (!wasEarned && nowEarned) {
          setNewAchievement(achievement);
          showAchievementToast(achievement);
          
          // Update in database
          updateAchievementInDB(achievement.id);
        }

        return {
          ...achievement,
          earnedAt: wasEarned ? new Date(savedAchievements[achievement.id]) : undefined
        };
      });

      setAchievements(updatedAchievements);
    } catch (error) {
      console.error('Error loading achievements:', error);
      setAchievements(defaultAchievements);
    }
  };

  const updateAchievementInDB = async (achievementId: string) => {
    if (!user) return;

    try {
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('achievements')
        .eq('user_id', user.id)
        .single();

      const currentAchievements = (preferences?.achievements as Record<string, string>) || {};
      const updatedAchievements = {
        ...currentAchievements,
        [achievementId]: new Date().toISOString()
      };

      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          achievements: updatedAchievements
        });
    } catch (error) {
      console.error('Error updating achievement:', error);
    }
  };

  const showAchievementToast = (achievement: Achievement) => {
    toast.success(`🏆 Achievement Unlocked!`, {
      description: `${achievement.title}: ${achievement.description}`,
      duration: 5000,
    });
  };

  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <Card className={`bg-gradient-to-br from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200/50 dark:border-yellow-500/30 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-yellow-800 dark:text-yellow-200">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Achievements
          </div>
          <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
            {earnedCount}/{achievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {achievements.map((achievement) => (
            <AchievementBadge 
              key={achievement.id}
              achievement={achievement}
              size="sm"
              showProgress={true}
            />
          ))}
        </div>

        {/* Current Streak Display */}
        <div className="p-3 bg-white/70 dark:bg-black/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Current Streak</span>
            </div>
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {streakCount} days
            </span>
          </div>
        </div>

        {/* Achievement Celebration Modal */}
        <AnimatePresence>
          {newAchievement && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setNewAchievement(null)}
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-xl p-8 mx-4 text-center max-w-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold mb-2">Achievement Unlocked!</h3>
                <AchievementBadge achievement={newAchievement} size="lg" />
                <p className="text-gray-600 dark:text-gray-400 mt-4">
                  {newAchievement.description}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default AchievementsPanel;